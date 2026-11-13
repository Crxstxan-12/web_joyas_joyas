import { Router } from 'express';
import { prisma } from '../config.js';
import { paginate } from '../utils/pagination.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAdmin, notFound } from '../middleware/auth.js';

const router = Router();

// GET /api/categories/
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const page = await paginate(req, prisma.category, {
      orderBy: { id: 'asc' },
    });
    res.json(page);
  })
);

// GET /api/categories/:id/
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(req.params.id, 10) },
    });
    if (!category) return notFound(res, 'Categoría no encontrada.');
    res.json(category);
  })
);

// POST /api/categories/ (admin)
router.post(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { name, slug } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ detail: 'name y slug son obligatorios.' });
    }
    const category = await prisma.category.create({ data: { name, slug } });
    res.status(201).json(category);
  })
);

// PUT /api/categories/:id/ (admin)
router.put(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { name, slug } = req.body;
    try {
      const category = await prisma.category.update({
        where: { id: parseInt(req.params.id, 10) },
        data: { name, slug },
      });
      res.json(category);
    } catch (e) {
      if (e.code === 'P2025') return notFound(res, 'Categoría no encontrada.');
      throw e;
    }
  })
);

// DELETE /api/categories/:id/ (admin)
router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    try {
      await prisma.category.delete({
        where: { id: parseInt(req.params.id, 10) },
      });
      res.status(204).end();
    } catch (e) {
      if (e.code === 'P2025') return notFound(res, 'Categoría no encontrada.');
      throw e;
    }
  })
);

export default router;
