// Express 4 no captura los errores lanzados dentro de funciones `async`:
// un rechazo queda sin manejar y tumba el proceso. Este envoltorio pasa
// cualquier error al middleware de errores de Express, así la API responde
// con un 500 controlado en vez de caerse.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
