import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Search, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../api';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('cat') || 'todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const categories = ['todos', 'aros', 'collares', 'pulseras', 'anillos'];

  const filteredProducts = products.filter(p => {
    const matchesCategory = category === 'todos' || p.category_name.toLowerCase() === category.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSearchParams(cat === 'todos' ? {} : { cat });
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400';
    if (url.startsWith('http')) return url;
    return `http://localhost:8000${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-infinito-cream">
        <div className="w-12 h-12 border-4 border-infinito-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-infinito-cream py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-infinito-black mb-4">Nuestro Catálogo</h1>
          <p className="text-gray-600 max-w-2xl mx-auto italic">
            "Joyas que representan momentos infinitos"
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-6 py-2 rounded-full text-sm uppercase tracking-widest transition-all ${
                  category === cat
                    ? 'bg-infinito-gold text-white shadow-lg'
                    : 'bg-white text-infinito-black hover:bg-infinito-pink/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Buscar joyas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-infinito-gold/20 focus:outline-none focus:border-infinito-gold bg-white"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* Product Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-infinito-black hover:text-red-500 transition-colors">
                    <Heart size={20} />
                  </button>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-white text-infinito-black px-6 py-2 rounded-full font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform"
                    >
                      <ShoppingCart size={18} /> Agregar
                    </button>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <span className="text-xs text-infinito-gold uppercase tracking-tighter mb-2 block">{product.category_name}</span>
                  <h3 className="text-lg font-serif font-bold text-infinito-black mb-2">{product.name}</h3>
                  <p className="text-infinito-gold font-bold text-xl">
                    ${product.price.toLocaleString('es-CL')}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No encontramos productos en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
