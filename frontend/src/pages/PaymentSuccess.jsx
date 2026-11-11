import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  useEffect(() => {
    if (status === 'approved') {
      clearCart();
    }
  }, [status, clearCart]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-infinito-cream px-4">
      <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-lg border border-infinito-gold/20">
        <div className="mb-6 flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle2 size={64} className="text-green-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-serif text-infinito-black mb-4">¡Pago Exitoso!</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Gracias por tu compra en Infinito Joyas. Tu pedido ha sido recibido y estamos preparando tus joyas con todo el cariño.
        </p>
        
        <div className="bg-infinito-cream p-6 rounded-2xl mb-8 text-left">
          <p className="text-sm text-gray-500 mb-2 uppercase tracking-widest font-bold">Detalles de la transacción</p>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">ID de Pago:</span>
            <span className="font-mono font-medium">{paymentId || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Estado:</span>
            <span className="text-green-600 font-bold uppercase">{status || 'Aprobado'}</span>
          </div>
        </div>

        <div className="space-y-4">
          <Link to="/catalogo" className="btn-primary w-full flex items-center justify-center gap-2 py-4">
            Seguir Comprando <ShoppingBag size={20} />
          </Link>
          <Link to="/" className="text-infinito-gold font-medium hover:underline flex items-center justify-center gap-2">
            Volver al inicio <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
