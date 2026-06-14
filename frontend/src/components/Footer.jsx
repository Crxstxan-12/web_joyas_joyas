import React from 'react';
import { Instagram, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-infinito-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-serif font-bold text-white">Infinito</span>
              <Heart className="w-4 h-4 text-infinito-gold fill-infinito-gold" />
              <span className="text-lg font-light text-infinito-gold">Joyas</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Joyas artesanales en plata 925 y baño de oro 18k. Piezas únicas diseñadas para resaltar tu elegancia natural.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-infinito-gold font-serif text-lg mb-6">Explorar</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/catalogo" className="hover:text-white transition-colors">Catálogo Completo</Link></li>
              <li><Link to="/catalogo?cat=aros" className="hover:text-white transition-colors">Aros</Link></li>
              <li><Link to="/catalogo?cat=collares" className="hover:text-white transition-colors">Collares</Link></li>
              <li><Link to="/catalogo?cat=anillos" className="hover:text-white transition-colors">Anillos</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-infinito-gold font-serif text-lg mb-6">Ayuda</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/sobre-nosotros" className="hover:text-white transition-colors">Nuestra Historia</Link></li>
              <li><Link to="/envios" className="hover:text-white transition-colors">Información de Envío</Link></li>
              <li><Link to="/contacto" className="hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-infinito-gold font-serif text-lg mb-6">Contacto</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <Instagram size={18} className="text-infinito-gold" />
                <a href="https://www.instagram.com/infinito.joyascl?igsh=MWsxczdlc2Y4am8zeQ==" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@infinitojoyas.cl</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-infinito-gold" />
                <span>+569 52196382</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-infinito-gold" />
                <a href="mailto:hola@infinitojoyas.cl" className="hover:text-white transition-colors">hola@infinitojoyas.cl</a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-infinito-gold" />
                <span>Chillán, Chile (Envíos a todo el país)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2024 Infinito Joyas. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link to="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link>
            <Link to="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
