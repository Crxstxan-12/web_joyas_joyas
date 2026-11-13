import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { prisma } from '../config.js';
import { paginate } from '../utils/pagination.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAdmin, notFound } from '../middleware/auth.js';

const router = Router();

// Limita la creación de órdenes anónimas (evita spam).
const orderCreateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas órdenes, intenta en un minuto.' },
});

// Formatea una orden incluyendo sus items y el nombre del producto, igual que
// el OrderSerializer de Django.
function formatOrder(order) {
  return {
    id: order.id,
    full_name: order.full_name,
    email: order.email,
    phone: order.phone,
    address: order.address,
    total_amount: order.total_amount,
    status: order.status,
    payment_id: order.payment_id,
    created_at: order.created_at,
    items: (order.items || []).map((item) => ({
      id: item.id,
      product: item.productId,
      product_name: item.product?.name || null,
      price: item.price,
      quantity: item.quantity,
    })),
  };
}

// GET /api/orders/ (admin)
router.get(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const page = await paginate(req, prisma.order, {
      orderBy: { created_at: 'desc' },
      include: { items: { include: { product: true } } },
    });
    res.json({
      count: page.count,
      next: page.next,
      previous: page.previous,
      results: page.results.map(formatOrder),
    });
  })
);

// GET /api/orders/:id/ (admin)
router.get(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id, 10) },
      include: { items: { include: { product: true } } },
    });
    if (!order) return notFound(res, 'Orden no encontrada.');
    res.json(formatOrder(order));
  })
);

// POST /api/orders/ (público — cualquiera puede crear una orden)
router.post(
  '/',
  orderCreateLimiter,
  asyncHandler(async (req, res) => {
    const { full_name, email, phone, address, items } = req.body;

    if (!full_name || !email || !phone || !address) {
      return res.status(400).json({
        detail: 'full_name, email, phone y address son obligatorios.',
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        items: 'La orden debe incluir al menos un producto.',
      });
    }

    // Validamos cada item: debe tener product y quantity.
    for (const item of items) {
      if (!item.product || !item.quantity) {
        return res.status(400).json({
          items: 'Cada item debe tener product y quantity.',
        });
      }
    }

    // Recuperamos los productos de la BD. NUNCA confiamos en el precio que
    // envía el cliente: el precio y el total se recalculan desde la base.
    const productIds = items.map((i) => Number(i.product));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validamos stock y recalculamos precios.
    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = productMap.get(Number(item.product));
      if (!product) {
        return res.status(400).json({
          items: `Producto con id ${item.product} no existe.`,
        });
      }
      const quantity = Number(item.quantity);
      if (quantity < 1) {
        return res.status(400).json({
          items: `Cantidad inválida para "${product.name}".`,
        });
      }
      if (product.stock < quantity) {
        return res.status(400).json({
          items: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}.`,
        });
      }
      // El precio se toma de la BD, no del cliente.
      orderItemsData.push({
        productId: product.id,
        price: product.price,
        quantity,
      });
      total += product.price * quantity;
    }

    // Creamos la orden con sus items. El stock NO se descuenta acá: solo se
    // descuenta cuando Mercado Pago confirma el pago (ver mercadopago.js).
    const order = await prisma.order.create({
      data: {
        full_name,
        email,
        phone,
        address,
        total_amount: total,
        status: 'pending',
        items: { create: orderItemsData },
      },
      include: { items: { include: { product: true } } },
    });

    res.status(201).json(formatOrder(order));
  })
);

// PUT /api/orders/:id/ (admin)
router.put(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { status, payment_id } = req.body;
    const data = {};
    if (status !== undefined) data.status = status;
    if (payment_id !== undefined) data.payment_id = payment_id;

    try {
      const order = await prisma.order.update({
        where: { id: parseInt(req.params.id, 10) },
        data,
        include: { items: { include: { product: true } } },
      });
      res.json(formatOrder(order));
    } catch (e) {
      if (e.code === 'P2025') return notFound(res, 'Orden no encontrada.');
      throw e;
    }
  })
);

// DELETE /api/orders/:id/ (admin)
router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    try {
      await prisma.order.delete({ where: { id: parseInt(req.params.id, 10) } });
      res.status(204).end();
    } catch (e) {
      if (e.code === 'P2025') return notFound(res, 'Orden no encontrada.');
      throw e;
    }
  })
);

export { formatOrder };
export default router;
