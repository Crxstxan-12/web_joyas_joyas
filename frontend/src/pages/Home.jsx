import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Truck } from 'lucide-react';
import { getImageUrl } from '../api';

const Home = () => {
  const categories = [
    { name: 'Aros', image: getImageUrl('/media/products/aros/Aros racimo.jpeg'), path: '/catalogo?cat=aros' },
    { name: 'Collares', image: getImageUrl('/media/products/collar/Collar Flor.jpeg'), path: '/catalogo?cat=collares' },
    { name: 'Pulseras', image: getImageUrl('/media/products/pulsera/WhatsApp Image 2026-05-05 at 19.22.17 (1).jpeg'), path: '/catalogo?cat=pulseras' },
    { name: 'Conjuntos', image: getImageUrl('/media/products/collar/Collar conjunto perla.jpeg'), path: '/catalogo?cat=conjuntos' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center bg-infinito-cream">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1920" 
            alt="Joyería de lujo" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-infinito-cream via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center md:text-left md:ml-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif text-infinito-black mb-6 leading-tight"
          >
            Joyas que representan <br />
            <span className="text-infinito-gold italic">momentos infinitos</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl leading-relaxed"
          >
            Descubre nuestra colección artesanal en plata 925 y baño de oro 18k. Piezas creadas con amor para durar toda la vida.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/catalogo" className="btn-primary inline-flex items-center gap-2 text-lg py-4 px-10 shadow-xl shadow-infinito-gold/20">
              Ver Catálogo <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-infinito-black mb-4">Nuestras Colecciones</h2>
            <div className="w-24 h-1 bg-infinito-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4]"
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-infinito-black/70 to-transparent flex items-end justify-center pb-8">
                  <Link to={cat.path} className="text-white text-xl font-medium tracking-widest hover:text-infinito-gold transition-colors">
                    {cat.name}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-infinito-pink/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-infinito-gold shadow-md">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold">Calidad Garantizada</h3>
              <p className="text-gray-600">Plata 925 y oro 18k de la mejor calidad para que tus joyas brillen siempre.</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-infinito-gold shadow-md">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold">Envíos a todo Chile</h3>
              <p className="text-gray-600">Desde Chillán con despacho seguro y coordinado para que recibas tu pedido donde quieras.</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-infinito-gold shadow-md">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold">Compra Segura</h3>
              <p className="text-gray-600">Múltiples métodos de pago con total seguridad en tus transacciones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800" 
              alt="Handmade Jewelry" 
              className="rounded-3xl shadow-2xl"
            />
          </div>
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-4xl font-serif text-infinito-black">Elegancia y delicadeza en cada pieza</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Infinito Joyas nace de la pasión por crear piezas que cuenten historias. Cada uno de nuestros productos es seleccionado y terminado a mano, asegurando que recibas no solo una joya, sino un símbolo de amor y conexión.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Utilizamos materiales nobles como Plata 925 y baño en Oro 18k, combinando técnicas artesanales con diseños modernos y femeninos.
            </p>
            <Link to="/sobre-nosotros" className="btn-outline inline-block mt-4">
              Nuestra Historia
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;