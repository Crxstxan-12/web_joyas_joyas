import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Shield, MapPin } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-infinito-cream min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif text-infinito-black mb-6"
          >
            Nuestra Historia
          </motion.h1>
          <div className="w-24 h-1 bg-infinito-gold mx-auto mb-12"></div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-infinito-pink/30 rounded-full blur-3xl z-0 animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-infinito-gold/20 rounded-full blur-3xl z-0 animate-pulse"></div>
            
            <div className="relative z-10 group">
              <img 
                src="http://localhost:8000/media/products/safiro_cadena.jpeg" 
                alt="Joyas Infinito Zafiro" 
                className="rounded-3xl shadow-2xl transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-infinito-gold/20 pointer-events-none"></div>
              
              {/* Icono de Infinito Decorativo */}
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-infinito-gold/10 transform rotate-12">
                <svg 
                  viewBox="0 0 24 24" 
                  width="40" 
                  height="40" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  className="text-infinito-gold"
                >
                  <path d="M18.178 8c5.096 0 5.096 8 0 8-1.698 0-2.547-.8-4.178-2.4l-4-4C8.37 8.001 7.521 7.201 5.822 7.201c-5.096 0-5.096 8 0 8 1.698 0 2.547-.8 4.178-2.4l4-4c1.63-1.6 2.479-2.4 4.178-2.4z" />
                </svg>
              </div>
            </div>
          </div>
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-serif text-infinito-black italic text-center">La historia detrás de Infinito Joyas</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Infinito nació desde el amor, la confianza y ese vínculo especial que solo algunas personas logran regalarnos en la vida.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Con mi hermana menor he construido una relación profundamente hermosa. Somos muy unidas, nos acompañamos y nos amamos con una intensidad que pocas veces cabe en palabras. Ella es de esas personas que te miran con amor cuando tú dudas de ti misma, y que te impulsan a crecer cuando a ti te cuesta creerlo.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Un día, caminando juntas por una feria, me enamoré de unos aros. Fue entonces cuando ella, con esa naturalidad tan suya, me dijo algo que cambiaría todo: "Tú podrías hacerlos."
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Esa frase se quedó viviendo en mí. Empecé a investigar, a aprender, a practicar, hasta que descubrí que mis manos podían crear algo hermoso. Esperé hasta su cumpleaños, para dar el primer paso: lanzar la pyme y entregarle el primer par de aros que hice con mis propias manos.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                No eran solo aros. Eran una forma de agradecerle por creer en mí, por impulsarme y por recordarme que soy capaz. Estaban hechos con dedicación pero, sobre todo, llenos de amor.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Por eso esta marca se llama Infinito: nuestro símbolo de un amor que no termina, un lazo que nos acompaña y una historia que sigue creciendo.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg font-medium italic">
                Infinito Joyas nació desde una hermana que creyó en mí, desde unas manos que se atrevieron a crear y desde un amor que, como su nombre, no tiene fin.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-infinito-pink/30 rounded-xl text-infinito-gold">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-infinito-black">Pasión</h4>
                    <p className="text-sm text-gray-500">Amamos lo que hacemos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-infinito-pink/30 rounded-xl text-infinito-gold">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-infinito-black">Calidad</h4>
                    <p className="text-sm text-gray-500">Plata 925 y Oro 18k.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-infinito-black mb-4">Nuestros Materiales</h2>
            <p className="text-gray-600">La calidad es nuestra prioridad número uno.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-infinito-gold/10">
              <h3 className="text-2xl font-serif text-infinito-gold mb-4">Plata 925</h3>
              <p className="text-gray-600 leading-relaxed">
                Nuestras joyas de plata están fabricadas con Plata de Ley 925, lo que garantiza un 92.5% de plata pura mezclada con otros metales para darle la resistencia necesaria. Es hipoalergénica y diseñada para durar.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-infinito-gold/10">
              <h3 className="text-2xl font-serif text-infinito-gold mb-4">Baño en Oro 18k</h3>
              <p className="text-gray-600 leading-relaxed">
                Utilizamos baños de oro de 18 kilates sobre plata o latón de alta calidad, asegurando un color dorado vibrante y una mayor durabilidad del acabado. Un toque de lujo accesible para tu día a día.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
