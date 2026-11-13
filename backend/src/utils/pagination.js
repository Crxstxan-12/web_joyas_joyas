// Devuelve una respuesta paginada con el mismo formato que Django REST Framework:
// { count, next, previous, results }
//
// req: objeto request de Express
// query: prisma query (ej: prisma.product.findMany) ya filtrado/ordenado
// model: prisma model para contar (ej: prisma.product)
// where: filtro para el count (debe coincidir con el del findMany)
export async function paginate(req, model, findArgs = {}) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const pageSize = Math.min(parseInt(req.query.page_size, 10) || 20, 100);
  const skip = (page - 1) * pageSize;

  const where = findArgs.where || {};

  const [results, count] = await Promise.all([
    model.findMany({ ...findArgs, skip, take: pageSize }),
    model.count({ where }),
  ]);

  const totalPages = Math.ceil(count / pageSize);
  const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

  const buildUrl = (p) => {
    const params = new URLSearchParams(req.query);
    params.set('page', String(p));
    return `${baseUrl}?${params.toString()}`;
  };

  return {
    count,
    next: page < totalPages ? buildUrl(page + 1) : null,
    previous: page > 1 ? buildUrl(page - 1) : null,
    results,
  };
}
