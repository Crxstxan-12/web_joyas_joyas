import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Catálogo', path: '/catalogo' },
    { name: 'Sobre Nosotros', path: '/sobre-nosotros' },
    { name: 'Contacto', path: '/contacto' },
  ];

  return (
    <nav className="bg-infinito-cream/80 backdrop-blur-md sticky top-0 z-50 border-b border-infinito-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <span className="text-3xl font-serif font-bold text-infinito-black tracking-tighter">
                Infinito
              </span>
              <Heart className="absolute -top-1 -right-4 w-4 h-4 text-infinito-gold fill-infinito-gold group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xl font-light text-infinito-gold ml-4">Joyas</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-infinito-black hover:text-infinito-gold transition-colors font-medium text-sm tracking-widest uppercase"
              >
                {link.name}
              </Link>
            ))}
            <Link to="/carrito" className="relative p-2 text-infinito-black hover:text-infinito-gold transition-colors">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-infinito-gold text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/carrito" className="relative p-2 text-infinito-black">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-infinito-gold text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-infinito-black focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-infinito-cream border-b border-infinito-gold/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-infinito-black hover:bg-infinito-pink/30 rounded-lg transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
