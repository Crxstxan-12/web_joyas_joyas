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
- **Django + Django REST Framework**: API robusta y segura.
- **MySQL**: Base de datos para productos, categorías y pedidos.
- **Mercado Pago SDK**: Integración de pagos automáticos con tarjeta.
- **Python Environ**: Gestión segura de credenciales y variables de entorno.

---

## 📂 Estructura del Proyecto

```text
infinito-joyas/
├── frontend/        # Código de la interfaz (React)
└── backend/         # Código del servidor y API (Django)
```

---

## 🛠️ Configuración e Instalación

### 1. Requisitos Previos
- Python 3.x instalado.
- Node.js y npm instalados.
- Servidor MySQL activo.

### 2. Configuración del Backend (Django)
1. Entra a la carpeta backend:
   ```bash
   cd backend
   ```
2. Crea y activa el entorno virtual:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Configura las variables de entorno:
   - Crea un archivo `.env` basado en el ejemplo proporcionado.
   - Configura tu `DATABASE_URL` de MySQL y tu `MERCADO_PAGO_ACCESS_TOKEN`.
5. Ejecuta las migraciones y crea un superusuario:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```
6. Inicia el servidor:
   ```bash
   python manage.py runserver
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
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

## 📱 Visualización en Dispositivos Móviles
Para revisar la página desde tu teléfono dentro de la misma red Wi-Fi:
1. Inicia el backend permitiendo todas las IPs:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```
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
