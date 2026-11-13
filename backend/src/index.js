import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';

import categoriesRouter from './routes/categories.js';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import mercadopagoRouter from './routes/mercadopago.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Detrás de un proxy (Railway/Render) confiamos en X-Forwarded-Proto para
// que las URLs y cookies sean https correctas.
app.set('trust proxy', 1);

// Middlewares
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS: solo los orígenes configurados pueden llamar a la API.
app.use(
  cors({
    origin: (origin, callback) => {
      // Permite peticiones sin origin (Postman, curl, Mercado Pago webhook).
      if (!origin) return callback(null, true);
      if (config.corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origen no permitido por CORS.'));
    },
    credentials: true,
  })
);

// Rate limiting general (evita abuso de la API).
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones, intenta más tarde.' },
});
app.use('/api/', generalLimiter);

// Sirve las imágenes de productos (media).
app.use('/media', express.static(path.join(__dirname, '..', 'media')));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', environment: config.nodeEnv });
});

// Rutas
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api', mercadopagoRouter);

// Manejo de errores de CORS
app.use((err, _req, res, _next) => {
  if (err.message === 'Origen no permitido por CORS.') {
    return res.status(403).json({ error: err.message });
  }
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`✅ Servidor de Infinito Joyas corriendo en el puerto ${PORT}`);
  console.log(`   Entorno: ${config.nodeEnv}`);
  console.log(`   API: http://localhost:${PORT}/api/`);
});

export default app;
