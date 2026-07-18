import hmac
import hashlib
import logging
import mercadopago
from django.conf import settings
from django.db import transaction
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from .models import Category, Product, Order
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer

logger = logging.getLogger(__name__)


class OrderCreateThrottle(AnonRateThrottle):
    """Limita la creación de órdenes anónimas para evitar spam / agotamiento de stock."""
    scope = 'order_create'


class WebhookThrottle(AnonRateThrottle):
    scope = 'webhook'


class ReadOnlyOrAdmin(permissions.BasePermission):
    """
    Cualquiera puede leer el catálogo (GET/HEAD/OPTIONS).
    Solo usuarios staff pueden crear/editar/borrar productos o categorías.
    Antes esto era IsAuthenticatedOrReadOnly, que permitía escritura a
    CUALQUIER usuario autenticado (no solo administradores).
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class OrderPermission(permissions.BasePermission):
    """
    Guests can only create orders.
    Everything else (list, retrieve, update, delete) requires staff.
    """
    def has_permission(self, request, view):
        if view.action == 'create':
            return True
        return bool(request.user and request.user.is_staff)

    def has_object_permission(self, request, view, obj):
        return bool(request.user and request.user.is_staff)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [ReadOnlyOrAdmin]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [ReadOnlyOrAdmin]


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [OrderPermission]

    def get_throttles(self):
        if self.action == 'create':
            return [OrderCreateThrottle()]
        return super().get_throttles()

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def payment(self, request, pk=None):
        order = self.get_object()

        if order.status != 'pending':
            return Response(
                {'error': 'La orden no está pendiente de pago.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not settings.MERCADO_PAGO_ACCESS_TOKEN:
            return Response({'payment_url': None})

        sdk = mercadopago.SDK(settings.MERCADO_PAGO_ACCESS_TOKEN)

        items_data = [
            {
                'id': str(item.product.id),
                'title': item.product.name,
                'quantity': item.quantity,
                'unit_price': float(item.price),
                'currency_id': 'CLP',
            }
            for item in order.items.select_related('product').all()
        ]

        preference_response = sdk.preference().create({
            'items': items_data,
            'back_urls': {
                'success': f'{settings.FRONTEND_URL}/pago-exitoso',
                'failure': f'{settings.FRONTEND_URL}/carrito',
                'pending': f'{settings.FRONTEND_URL}/carrito',
            },
            'auto_return': 'approved',
            'external_reference': str(order.id),
            'notification_url': f'{settings.BACKEND_URL}/api/webhook/mercadopago/',
        })

        preference = preference_response['response']
        order.payment_id = preference['id']
        order.save(update_fields=['payment_id'])

        return Response({'payment_url': preference['init_point']})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@throttle_classes([WebhookThrottle])
def mercadopago_webhook(request):
    mp_secret = settings.MERCADO_PAGO_WEBHOOK_SECRET

    if not mp_secret:
        # Antes: si no había secreto configurado, se omitía la validación de
        # firma por completo -> cualquiera podía llamar a este endpoint y
        # marcar cualquier orden como pagada sin pagar nada.
        # Ahora: en producción esto se rechaza (falla "cerrado"). En
        # desarrollo local se permite pero se deja advertencia en el log.
        if not settings.DEBUG:
            logger.error(
                'MERCADO_PAGO_WEBHOOK_SECRET no está configurado; '
                'webhook rechazado por seguridad.'
            )
            return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)
        logger.warning(
            'MERCADO_PAGO_WEBHOOK_SECRET no configurado: validación de firma '
            'omitida (solo aceptable en desarrollo local).'
        )
    else:
        x_signature = request.headers.get('x-signature', '')
        x_request_id = request.headers.get('x-request-id', '')
        data_id = request.data.get('data', {}).get('id', '')

        parts = dict(
            part.split('=', 1) for part in x_signature.split(',') if '=' in part
        )
        ts = parts.get('ts', '')
        v1 = parts.get('v1', '')

        manifest = f'id:{data_id};request-id:{x_request_id};ts:{ts};'
        expected = hmac.new(
            mp_secret.encode(), manifest.encode(), hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(expected, v1):
            return Response(status=status.HTTP_400_BAD_REQUEST)

    data = request.data
    if data.get('type') == 'payment':
        payment_id = data.get('data', {}).get('id')
        sdk = mercadopago.SDK(settings.MERCADO_PAGO_ACCESS_TOKEN)
        payment_info = sdk.payment().get(payment_id)

        if payment_info['status'] == 200:
            external_reference = payment_info['response'].get('external_reference')
            payment_status = payment_info['response'].get('status')

            if external_reference and payment_status == 'approved':
                _confirm_order_payment(external_reference)

    return Response(status=status.HTTP_200_OK)


def _confirm_order_payment(order_id):
    """
    Marca la orden como pagada y recién ahí descuenta el stock.

    Antes el stock se descontaba al CREAR la orden (aunque nunca se
    pagara), lo que permitía a cualquiera vaciar el stock haciendo
    pedidos falsos sin pagar. Ahora el stock solo se descuenta cuando
    Mercado Pago confirma el pago, y se revalida disponibilidad en ese
    momento por si cambió mientras la orden estaba pendiente.
    """
    from django.db.models import F

    with transaction.atomic():
        try:
            order = Order.objects.select_for_update().get(id=order_id)
        except Order.DoesNotExist:
            return

        if order.status != 'pending':
            return  # ya procesada o cancelada; evita descontar dos veces

        items = list(order.items.select_related('product').all())
        for item in items:
            if item.product.stock < item.quantity:
                # Se agotó el stock mientras la orden estaba pendiente.
                order.status = 'cancelled'
                order.save(update_fields=['status'])
                logger.warning(
                    'Orden %s cancelada por falta de stock al confirmar pago.',
                    order.id,
                )
                return

        for item in items:
            Product.objects.filter(pk=item.product_id).update(
                stock=F('stock') - item.quantity
            )

        order.status = 'paid'
        order.save(update_fields=['status'])
