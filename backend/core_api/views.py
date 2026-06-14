import hmac
import hashlib
import mercadopago
from django.conf import settings
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from .models import Category, Product, Order
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer


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
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [OrderPermission]

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
def mercadopago_webhook(request):
    mp_secret = settings.MERCADO_PAGO_WEBHOOK_SECRET
    if mp_secret:
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
                try:
                    order = Order.objects.get(id=external_reference)
                    order.status = 'paid'
                    order.save(update_fields=['status'])
                except Order.DoesNotExist:
                    pass

    return Response(status=status.HTTP_200_OK)
