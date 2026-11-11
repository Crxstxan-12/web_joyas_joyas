import { useState } from 'react';
import { Instagram, MessageCircle, Clock, MapPin, Send } from 'lucide-react';

// Número de WhatsApp de la tienda (código país + número, sin + ni espacios).
const WHATSAPP_NUMBER = '56952196382';

const Contact = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    asunto: 'Consulta General',
    mensaje: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text =
      `¡Hola Infinito Joyas!\n\n` +
      `Nombre: ${form.nombre}\n` +
      `Email: ${form.email}\n` +
      `Asunto: ${form.asunto}\n\n` +
      `${form.mensaje}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  return (
    <div className="bg-infinito-cream min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-infinito-black mb-4">Contacto</h1>
          <p className="text-gray-600 italic">Estamos aquí para ayudarte a encontrar tu joya ideal.</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
              <h3 className="text-2xl font-serif text-infinito-black mb-6">Información de Atención</h3>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-infinito-pink/30 rounded-xl text-infinito-gold">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-infinito-black">WhatsApp</h4>
                  <p className="text-gray-600">+56 9 52196382</p>
                  <a
                    href="https://wa.me/56952196382"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-infinito-gold text-sm font-medium hover:underline"
                  >
                    Escríbenos ahora
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-infinito-pink/30 rounded-xl text-infinito-gold">
                  <Instagram size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-infinito-black">Instagram</h4>
                  <p className="text-gray-600">@infinitojoyas.cl</p>
                  <a 
                    href="https://www.instagram.com/infinitojoyas.cl" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-infinito-gold text-sm font-medium hover:underline"
                  >
                    Síguenos en redes
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-infinito-pink/30 rounded-xl text-infinito-gold">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-infinito-black">Horario</h4>
                  <p className="text-gray-600">Lunes a Viernes: 09:00 - 18:00</p>
                  <p className="text-gray-600">Sábados: 10:00 - 14:00</p>
                </div>
              </div>
            </div>

            <div className="bg-infinito-gold/10 p-8 rounded-3xl border border-infinito-gold/20 overflow-hidden">
              <h4 className="text-infinito-black font-serif text-xl mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-infinito-gold" /> Envíos a todo Chile
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                Realizamos despachos a través de las principales agencias de envío desde Chillán. El tiempo de entrega varía según tu ubicación, generalmente entre 2 a 5 días hábiles.
              </p>
              
              {/* Mapa de Google Maps */}
              <div className="w-full h-64 rounded-2xl overflow-hidden shadow-inner">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102434.37257121287!2d-72.1645842509653!3d-36.60014238515392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9668d7e974950e3d%3A0xd68019062098007e!2sChill%C3%A1n%2C%20%C3%91uble!5e0!3m2!1ses-419!2scl!4v1715011200000!5m2!1ses-419!2scl" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Infinito Joyas Chillán"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-10 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-serif text-infinito-black mb-8">Envíanos un mensaje</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input 
                    type="text" 
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-infinito-cream focus:outline-none focus:ring-2 focus:ring-infinito-gold/20"
                    placeholder="Tu nombre"
                  />
                  
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-infinito-cream focus:outline-none focus:ring-2 focus:ring-infinito-gold/20"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                <select
                  name="asunto"
                  value={form.asunto}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-infinito-cream focus:outline-none focus:ring-2 focus:ring-infinito-gold/20"
                >
                  <option>Consulta General</option>
                  <option>Estado de Pedido</option>
                  <option>Personalizaciones</option>
                  <option>Ventas por Mayor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                <textarea 
                  rows="5"
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-infinito-cream focus:outline-none focus:ring-2 focus:ring-infinito-gold/20"
                  placeholder="¿En qué podemos ayudarte?"
                ></textarea>
              </div>

              <button type="submit" className="w-full btn-primary py-4 flex items-center justify-center gap-2 shadow-lg shadow-infinito-gold/20">
                Enviar Mensaje <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
