import { Router } from 'express';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { prisma, config } from '../config.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notFound } from '../middleware/auth.js';

const router = Router();

// Limita las notificaciones del webhook.
const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

// Cliente de Mercado Pago (SDK v2). Solo se crea si hay token configurado;
// si no, el checkout no genera link y el frontend usa el fallback de WhatsApp.
const mpClient = config.mercadoPagoToken
  ? new MercadoPagoConfig({ accessToken: config.mercadoPagoToken })
  : null;

// POST /api/orders/:id/payment/
// Crea una preferencia de pago en Mercado Pago y devuelve la URL init_point.
router.post(
  '/orders/:id/payment',
  asyncHandler(async (req, res) => {
    const orderId = parseInt(req.params.id, 10);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) return notFound(res, 'Orden no encontrada.');

    if (order.status !== 'pending') {
      return res
        .status(400)
        .json({ error: 'La orden no está pendiente de pago.' });
    }

    if (!mpClient) {
      // Mercado Pago no configurado: el frontend usará el fallback de WhatsApp.
      return res.json({ payment_url: null });
    }

    const preference = new Preference(mpClient);
    const result = await preference.create({
      body: {
        items: order.items.map((item) => ({
          id: String(item.productId),
          title: item.product.name,
          quantity: item.quantity,
          unit_price: Number(item.price),
          currency_id: 'CLP',
        })),
        back_urls: {
          success: `${config.frontendUrl}/pago-exitoso`,
          failure: `${config.frontendUrl}/carrito`,
          pending: `${config.frontendUrl}/carrito`,
        },
        auto_return: 'approved',
        external_reference: String(order.id),
        notification_url: `${config.backendUrl}/api/webhook/mercadopago`,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { payment_id: String(result.id) },
    });

    return res.json({ payment_url: result.init_point });
  })
);

// POST /api/webhook/mercadopago/
// Recibe notificaciones de Mercado Pago y confirma el pago de la orden.
router.post(
  '/mercadopago',
  webhookLimiter,
  asyncHandler(async (req, res) => {
    const mpSecret = config.mercadoPagoWebhookSecret;

    if (!mpSecret) {
      if (config.isProd) {
        console.error(
          'MERCADO_PAGO_WEBHOOK_SECRET no está configurado; webhook rechazado por seguridad.'
        );
        return res.sendStatus(503);
      }
      console.warn(
        'MERCADO_PAGO_WEBHOOK_SECRET no configurado: validación de firma omitida (solo desarrollo).'
      );
    } else {
      // Validación de firma HMAC (igual que en el webhook original de Django).
      const xSignature = req.headers['x-signature'] || '';
      const xRequestId = req.headers['x-request-id'] || '';
      const dataId = req.body?.data?.id || '';

      const parts = {};
      xSignature.split(',').forEach((part) => {
        const [k, ...rest] = part.split('=');
        if (k && rest.length) parts[k.trim()] = rest.join('=').trim();
      });

      const ts = parts.ts || '';
      const v1 = parts.v1 || '';

      const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
      const expected = crypto
        .createHmac('sha256', mpSecret)
        .update(manifest)
        .digest('hex');

      const expectedBuf = Buffer.from(expected);
      const receivedBuf = Buffer.from(v1);
      const valid =
        expectedBuf.length === receivedBuf.length &&
        crypto.timingSafeEqual(expectedBuf, receivedBuf);

      if (!valid) {
        return res.sendStatus(400);
      }
    }

    const data = req.body;
    if (data?.type === 'payment') {
      const paymentId = data?.data?.id;
      if (paymentId && mpClient) {
        try {
          const payment = new Payment(mpClient);
          const response = await payment.get({ id: Number(paymentId) });
          const externalReference = response?.external_reference;
          const paymentStatus = response?.status;

          if (externalReference && paymentStatus === 'approved') {
            await confirmOrderPayment(externalReference);
          }
        } catch (err) {
          console.error('Error al consultar pago en Mercado Pago:', err);
        }
      }
    }

    return res.sendStatus(200);
  })
);

// Marca la orden como pagada y descuenta el stock. El stock se descuenta
// SOLO al confirmar el pago (no al crear la orden), y se revalida en ese
// momento por si cambió mientras la orden estaba pendiente.
async function confirmOrderPayment(orderId) {
  const id = Number(orderId);

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!order) return;
    if (order.status !== 'pending') return; // ya procesada o cancelada

    // Revalidamos stock en el momento del pago.
    for (const item of order.items) {
      if (item.product.stock < item.quantity) {
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'cancelled' },
        });
        console.warn(
          `Orden ${order.id} cancelada por falta de stock al confirmar pago.`
        );
        return;
      }
    }

    // Descontamos stock.
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.order.update({
      where: { id: order.id },
      data: { status: 'paid' },
    });
  });
}

export default router;
