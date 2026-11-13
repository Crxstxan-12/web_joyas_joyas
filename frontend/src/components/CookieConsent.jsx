import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

// Clave donde guardamos la decisión del usuario (localStorage, no cookie).
const STORAGE_KEY = 'infinito-joyas-cookie-consent';

// Banner de consentimiento de cookies. Se muestra solo si el usuario aún no
// ha aceptado ni rechazado, y recuerda su elección en el navegador.
const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // Si localStorage está bloqueado, mostramos el aviso igualmente.
      setVisible(true);
    }
  }, []);

  const handleChoice = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Ignoramos el fallo: el aviso simplemente se ocultará en esta sesión.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4">
      <div className="max-w-5xl mx-auto bg-white border border-infinito-gold/30 rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-start gap-3 flex-grow">
          <div className="p-3 bg-infinito-pink/30 rounded-xl text-infinito-gold shrink-0">
            <Cookie size={22} />
          </div>
          <div>
            <h3 className="font-serif text-infinito-black text-lg mb-1">
              Uso de cookies
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Usamos cookies y almacenamiento local para que el carrito funcione y
              para mejorar tu experiencia. Al aceptar, consientes su uso conforme a
              nuestra{' '}
              <Link
                to="/privacidad"
                className="text-infinito-gold font-medium hover:underline"
              >
                Política de Privacidad y Cookies
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={() => handleChoice('rejected')}
            className="flex-1 md:flex-none border border-gray-200 text-gray-600 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Rechazar
          </button>
          <button
            onClick={() => handleChoice('accepted')}
            className="flex-1 md:flex-none btn-primary text-sm"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
