// URL base de la API. En desarrollo se usa el backend local; en producción
// se define VITE_API_URL en Vercel (ej: https://mi-backend.up.railway.app/api).
const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
).replace(/\/+$/, '');

// Origen del backend (sin /api), usado para resolver las imágenes de productos.
const API_ORIGIN = API_URL.replace(/\/api$/, '');

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400';

// Resuelve la URL de una imagen de producto. Acepta URLs absolutas (las que
// devuelve la API) o rutas relativas, evitando el hardcode de localhost.
export const getImageUrl = (url) => {
  if (!url) return DEFAULT_IMAGE;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return `${API_ORIGIN}${url}`;
  if (url.startsWith('media/')) return `${API_ORIGIN}/${url}`;
  return `${API_ORIGIN}/media/${url}`;
};

// Recorre la paginación de DRF y devuelve una lista plana.
const fetchAll = async (endpoint) => {
  let all = [];
  let nextUrl = `${API_URL}/${endpoint}/`;

  while (nextUrl) {
    const response = await fetch(nextUrl);
    if (!response.ok) throw new Error(`Error fetching ${endpoint}`);
    const data = await response.json();
    if (Array.isArray(data)) return data;
    all = all.concat(data.results || []);
    nextUrl = data.next || null;
  }

  return all;
};

export const fetchProducts = async () => {
  try {
    return await fetchAll('products');
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchCategories = async () => {
  try {
    return await fetchAll('categories');
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_URL}/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Error creating order');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getPaymentUrl = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/payment/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Error getting payment URL');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
