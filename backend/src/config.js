import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Cliente de Prisma (conexión a la base de datos).
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

// Variables de entorno centralizadas.
export const config = {
  port: process.env.PORT || 8000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: (process.env.NODE_ENV || 'development') === 'production',

  secretKey: process.env.SECRET_KEY || '',

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:8000',

  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  mercadoPagoToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
  mercadoPagoWebhookSecret: process.env.MERCADO_PAGO_WEBHOOK_SECRET || '',

  adminApiKey: process.env.ADMIN_API_KEY || '',
};

// En producción SECRET_KEY es obligatorio: si falta, el servidor no arranca
// (fallo "cerrado", nunca se expone la app sin clave).
if (config.isProd && !config.secretKey) {
  console.error('FATAL: SECRET_KEY no está definida en producción.');
  process.exit(1);
}
