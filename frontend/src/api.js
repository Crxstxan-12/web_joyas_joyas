// Para ver la página en tu teléfono, reemplaza 'localhost' por la IP de tu PC 
// (ejemplo: '192.168.1.XX'). Si estás en tu PC, 'localhost' funciona bien.
const BASE_URL = `http://${window.location.hostname}:8000/api`;

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products/`);
    if (!response.ok) throw new Error('Error fetching products');
    return await response.ok ? response.json() : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/categories/`);
    if (!response.ok) throw new Error('Error fetching categories');
    return await response.ok ? response.json() : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${BASE_URL}/orders/`, {
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
    const response = await fetch(`${BASE_URL}/orders/${orderId}/payment/`, {
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
