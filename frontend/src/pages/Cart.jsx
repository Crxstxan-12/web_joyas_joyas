import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createOrder, getPaymentUrl } from '../api';

const Cart = () => {
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [customer, setCustomer] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [formError, setFormError] = useState('');

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const isCustomerValid = () => {
    const { full_name, email, phone, address } = customer;
    if (!full_name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      return false;
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleCheckout = async () => {
    if (!isCustomerValid()) {
      setFormError('Completa todos tus datos con un email válido antes de continuar.');
      return;
    }
    setFormError('');
    setIsProcessing(true);

    // Preparar datos para Django (datos reales ingresados por el cliente)
    const orderData = {
      full_name: customer.full_name.trim(),
      email: customer.email.trim(),
      phone: customer.phone.trim(),
      address: customer.address.trim(),
      total_amount: cartTotal,
      items: cart.map(item => ({
        product: item.id,
        price: item.price,
        quantity: item.quantity
      }))
    };

    const response = await createOrder(orderData);

    if (response) {
      // Solicitar la URL de pago al endpoint dedicado
      const paymentData = await getPaymentUrl(response.id);

      if (paymentData?.payment_url) {
        setIsProcessing(false);
        setIsSuccess(true);

        setTimeout(() => {
          window.location.href = paymentData.payment_url;
        }, 1500);
        return;
      }

      // Fallback WhatsApp si no está configurado Mercado Pago
      const message = `¡Hola Infinito Joyas! Realicé el pedido #${response.id} en la web:\n\n` +
        cart.map(item => `- ${item.name} (${item.quantity}x)`).join('\n') +
        `\n\n*Total: $${cartTotal.toLocaleString('es-CL')}*` +
        `\n\nPor favor, confírmenme los pasos para el pago.`;
      
      const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent(message)}`;

      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
        }, 2000);
      }, 1000);
    } else {
      setIsProcessing(false);
      alert("Hubo un error al procesar tu pedido. Por favor intenta de nuevo.");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-infinito-cream px-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md border border-infinito-gold/20"
        >
          <CheckCircle2 size={80} className="mx-auto text-green-500 mb-6" />
          <h2 className="text-3xl font-serif text-infinito-black mb-4">¡Pedido Procesado!</h2>
          <p className="text-gray-600 mb-8">
            Estamos redirigiéndote para completar tu pago de forma segura.
          </p>
          <div className="animate-pulse text-infinito-gold font-medium">
            Redirigiendo...
          </div>
          <button 
            onClick={() => { setIsSuccess(false); clearCart(); }}
            className="mt-8 text-sm text-gray-400 hover:text-infinito-gold underline"
          >
            Volver a la tienda
          </button>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-infinito-cream px-4">
        <div className="bg-white p-12 rounded-3xl shadow-sm text-center max-w-md">
          <ShoppingBag size={64} className="mx-auto text-infinito-gold mb-6 opacity-20" />
          <h2 className="text-3xl font-serif text-infinito-black mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">Parece que aún no has agregado ninguna joya a tu carrito.</p>
          <Link to="/catalogo" className="btn-primary inline-block">
            Explorar Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-infinito-cream py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif text-infinito-black mb-12 text-center">Tu Carrito de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <motion.div
                layout
                key={item.id}
                className="bg-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-6"
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-lg font-serif font-bold text-infinito-black">{item.name}</h3>
                  <p className="text-infinito-gold font-bold">${item.price.toLocaleString('es-CL')}</p>
                </div>

                <div className="flex items-center gap-4 bg-infinito-cream px-4 py-2 rounded-full">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="text-infinito-gold hover:scale-120 transition-transform"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="text-infinito-gold hover:scale-120 transition-transform"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg mb-2">
                    ${(item.price * item.quantity).toLocaleString('es-CL')}
                  </p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}

            <button 
              onClick={clearCart}
              className="text-gray-500 hover:text-red-500 text-sm font-medium transition-colors ml-auto block"
            >
              Vaciar carrito
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-xl sticky top-32">
              <h3 className="text-2xl font-serif text-infinito-black mb-6">Resumen de Compra</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${cartTotal.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-600 font-medium">Calculado al pagar</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between text-xl font-bold text-infinito-black">
                  <span>Total</span>
                  <span>${cartTotal.toLocaleString('es-CL')}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-left">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Datos de envío</p>
                <input
                  type="text"
                  name="full_name"
                  placeholder="Nombre completo"
                  value={customer.full_name}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-infinito-gold text-sm"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={customer.email}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-infinito-gold text-sm"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Teléfono (ej: +56912345678)"
                  value={customer.phone}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-infinito-gold text-sm"
                />
                <textarea
                  name="address"
                  placeholder="Dirección de despacho"
                  value={customer.address}
                  onChange={handleCustomerChange}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-infinito-gold text-sm resize-none"
                />
                {formError && (
                  <p className="text-red-500 text-xs">{formError}</p>
                )}
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Procesando...
                    </div>
                  ) : (
                    <>Proceder al Pago <ArrowRight size={20} /></>
                  )}
                </button>
                <Link 
                  to="/catalogo" 
                  className="w-full border border-gray-200 text-gray-600 py-4 rounded-full font-medium hover:bg-gray-50 transition-colors block text-center"
                >
                  Continuar Comprando
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400 mb-4 uppercase tracking-widest">Métodos de pago aceptados</p>
                <div className="flex justify-center gap-4 opacity-50 grayscale">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
