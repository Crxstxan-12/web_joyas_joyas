import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import PaymentSuccess from './pages/PaymentSuccess';
import Privacy from './pages/Privacy';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/sobre-nosotros" element={<About />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/privacidad" element={<Privacy />} />
            <Route path="/pago-exitoso" element={<PaymentSuccess />} />
            {/* Fallback route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </CartProvider>
  );
}

export default App;
