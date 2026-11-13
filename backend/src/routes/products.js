import { Router } from 'express';
import { prisma } from '../config.js';
import { paginate } from '../utils/pagination.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAdmin, notFound } from '../middleware/auth.js';

const router = Router();

// Formatea un producto incluyendo el nombre de la categoría (category_name),
// igual que hacía el ProductSerializer de Django.
function formatProduct(p) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    image: p.image,
    category: p.categoryId,
    category_name: p.category?.name || null,
  };
}

// GET /api/products/
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category, search } = req.query;
    const where = {};
    if (category) {
      where.category = { slug: category };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const page = await paginate(req, prisma.product, {
      where,
      orderBy: { id: 'asc' },
      include: { category: true },
    });
    res.json({
      count: page.count,
      next: page.next,
      previous: page.previous,
      results: page.results.map(formatProduct),
    });
  })
);

// GET /api/products/:id/
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id, 10) },
      include: { category: true },
    });
    if (!product) return notFound(res, 'Producto no encontrado.');
    res.json(formatProduct(product));
  })
);

// POST /api/products/ (admin)
router.post(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { name, description, price, stock, image, category } = req.body;
    if (!name || price === undefined || category === undefined) {
      return res
        .status(400)
        .json({ detail: 'name, price y category son obligatorios.' });
    }
    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: Number(price),
        stock: Number(stock) || 0,
        image: image || null,
        categoryId: Number(category),
      },
      include: { category: true },
    });
    res.status(201).json(formatProduct(product));
  })
);

// PUT /api/products/:id/ (admin)
router.put(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { name, description, price, stock, image, category } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = Number(price);
    if (stock !== undefined) data.stock = Number(stock);
    if (image !== undefined) data.image = image;
    if (category !== undefined) data.categoryId = Number(category);

    try {
      const product = await prisma.product.update({
        where: { id: parseInt(req.params.id, 10) },
        data,
        include: { category: true },
      });
      res.json(formatProduct(product));
    } catch (e) {
      if (e.code === 'P2025') return notFound(res, 'Producto no encontrado.');
      throw e;
    }
  })
);

// DELETE /api/products/:id/ (admin)
router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    try {
      await prisma.product.delete({ where: { id: parseInt(req.params.id, 10) } });
      res.status(204).end();
    } catch (e) {
      if (e.code === 'P2025') return notFound(res, 'Producto no encontrado.');
      throw e;
    }
  })
);

export default router;
