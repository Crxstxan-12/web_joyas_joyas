# 💎 Infinito Joyas - Tienda Online

Plataforma digital moderna y funcional para **Infinito Joyas**, un emprendimiento de joyería artesanal basado en Chillán, Chile. La web permite visualizar catálogos, gestionar un carrito de compras y realizar pagos automáticos.

## 🚀 Tecnologías Utilizadas

### Frontend
- **React + Vite**: Framework principal para una interfaz rápida y moderna.
- **Tailwind CSS**: Estilos elegantes, minimalistas y responsivos.
- **Framer Motion**: Animaciones suaves para una experiencia de lujo.
- **Lucide React**: Iconografía profesional.
- **Context API**: Gestión del estado del carrito de compras.

### Backend
- **Node.js + Express**: API REST rápida y segura.
- **Prisma ORM**: Acceso type-safe a la base de datos.
- **PostgreSQL**: Base de datos para productos, categorías y pedidos.
- **Mercado Pago SDK**: Integración de pagos automáticos con tarjeta.
- **dotenv**: Gestión segura de credenciales y variables de entorno.

---

## 📂 Estructura del Proyecto

```text
infinito-joyas/
├── frontend/        # Código de la interfaz (React)
└── backend/         # Código del servidor y API (Node.js + Express + Prisma)
    ├── prisma/      # Schema y migraciones de la base de datos
    ├── src/
    │   ├── routes/  # Endpoints (categorías, productos, órdenes, Mercado Pago)
    │   ├── middleware/
    │   └── utils/
    └── media/       # Imágenes de los productos
```

---

## 🛠️ Configuración e Instalación

### 1. Requisitos Previos
- **Node.js 18+** y npm instalados.
- **PostgreSQL** activo (local o en la nube).

### 2. Configuración del Backend (Node.js + Express)
1. Entra a la carpeta backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno:
   - Copia `.env.example` a `.env`.
   - Ajusta `DATABASE_URL` (PostgreSQL) y, si usas pagos, `MERCADO_PAGO_ACCESS_TOKEN`.
4. Aplica las migraciones de la base de datos:
   ```bash
   npx prisma migrate deploy
   ```
5. Carga el catálogo inicial (una sola vez):
   ```bash
   npm run seed
   ```
6. Inicia el servidor:
   ```bash
   npm run dev
   ```

### 3. Configuración del Frontend (React)
1. Entra a la carpeta frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura `.env` (copia de `.env.example`) con `VITE_API_URL`.
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

## 🚀 Despliegue en Producción

Arquitectura: **Frontend en Vercel** + **Backend en Railway/Render** + **PostgreSQL**.

### 1. Backend (Railway o Render)
1. Crea un servicio apuntando a la carpeta `backend/` del repositorio.
   - Build command: `./build.sh`
   - Start command: `node src/index.js`
   (En Railway basta el `Procfile` incluido.)
2. Agrega una base de datos **PostgreSQL** y copia su `DATABASE_URL`.
3. Define las variables de entorno (ver `backend/.env.example`):
   - `SECRET_KEY` → genera una con `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
   - `NODE_ENV=production`
   - `DATABASE_URL=postgresql://...`
   - `CORS_ORIGINS=https://tu-frontend.vercel.app`
   - `FRONTEND_URL=https://tu-frontend.vercel.app`
   - `BACKEND_URL=https://tu-backend.up.railway.app`
   - `MERCADO_PAGO_ACCESS_TOKEN` y `MERCADO_PAGO_WEBHOOK_SECRET` (si usas pagos)
   - `ADMIN_API_KEY` (clave para operar el CRUD de administración)
4. Carga el catálogo inicial (una sola vez): `npm run seed`

> Las imágenes de los productos viven en `backend/media/` y se despliegan con el
> proyecto (están versionadas en git). Si en el futuro subes imágenes desde un
> panel, considera un almacenamiento externo (S3/Cloudinary), ya que el disco de
> Railway/Render es efímero.

### 2. Frontend (Vercel)
1. Importa el repositorio y configura el **Root Directory** como `frontend`
   (importante: si no, Vercel intentará construir el backend).
2. Agrega la variable de entorno `VITE_API_URL=https://tu-backend.up.railway.app/api`
   (debe terminar en `/api`).
3. Deploy. El archivo `vercel.json` ya incluye el rewrite necesario para que las
   rutas de React Router (`/catalogo`, `/carrito`, etc.) funcionen al recargar.

---

## 📱 Visualización en Dispositivos Móviles
Para revisar la página desde tu teléfono dentro de la misma red Wi-Fi:
1. Inicia el backend escuchando en todas las interfaces (por defecto ya lo hace en el puerto 8000).
2. Inicia el frontend con el flag host:
   ```bash
   npm run dev -- --host
   ```
3. Accede desde tu móvil usando la dirección **Network** que aparecerá en la terminal de React.

---

## 🎨 Identidad de Marca
- **Ubicación**: Chillán, Chile.
- **Colores**: Crema (#FDFCF8), Dorado (#D4AF37), Negro (#1A1A1A), Rosado Pastel (#F8E1E7).
- **Valores**: Elegancia, delicadeza y amor infinito en cada pieza artesanal.

---
Desarrollado con ❤️ para Infinito Joyas.
