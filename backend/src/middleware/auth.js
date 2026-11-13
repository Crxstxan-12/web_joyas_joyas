import { config } from '../config.js';

// Middleware que autoriza operaciones de escritura (crear/editar/borrar
// productos o categorías). En Django esto lo hacía el permiso ReadOnlyOrAdmin;
// aquí usamos una API key simple porque el frontend no tiene login.
//
// Envía el header:  X-Admin-Key: <ADMIN_API_KEY>
//
// Si ADMIN_API_KEY no está configurada, las escrituras quedan bloqueadas.
export function requireAdmin(req, res, next) {
  if (!config.adminApiKey) {
    return res
      .status(503)
      .json({ error: 'Operaciones de administración no habilitadas (falta ADMIN_API_KEY).' });
  }

  const key = req.headers['x-admin-key'];
  if (key !== config.adminApiKey) {
    return res.status(403).json({ error: 'No autorizado.' });
  }

  next();
}

// Respuesta de error 404 genérica.
export function notFound(res, message = 'No encontrado.') {
  return res.status(404).json({ detail: message });
}
