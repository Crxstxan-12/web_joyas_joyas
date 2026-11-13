import { motion } from 'framer-motion';
import { ShieldCheck, Cookie, CreditCard, UserCheck, Lock, Mail } from 'lucide-react';

// Secciones con marcadores [ENTRE CORCHETES] que debes completar con tus
// datos legales reales antes de publicar el sitio.
const sections = [
  {
    icon: UserCheck,
    title: '1. Responsable del tratamiento',
    body: [
      'El responsable del tratamiento de tus datos personales es [RAZÓN SOCIAL / NOMBRE DEL RESPONSABLE], RUT [RUT], con domicilio en [DOMICILIO], Chillán, Chile. Para cualquier consulta sobre tus datos puedes escribir a [CORREO DE CONTACTO].',
    ],
  },
  {
    icon: ShieldCheck,
    title: '2. Qué datos recopilamos',
    body: [
      'Recopilamos únicamente los datos necesarios para gestionar tu compra:',
      '• Datos de contacto y despacho: nombre completo, correo electrónico, teléfono y dirección de envío, que nos entregas al finalizar tu pedido.',
      '• Datos del pedido: productos, cantidades y monto total.',
      'No solicitamos ni almacenamos datos de tarjetas bancarias.',
    ],
  },
  {
    icon: Mail,
    title: '3. Para qué usamos tus datos',
    body: [
      'Usamos tus datos para: procesar y despachar tu pedido, contactarte ante cualquier problema con la compra, emitir los documentos que correspondan y responder tus consultas.',
      'No vendemos ni cedemos tus datos a terceros con fines publicitarios.',
    ],
  },
  {
    icon: CreditCard,
    title: '4. Pagos con tarjeta',
    body: [
      'Los pagos son procesados por Mercado Pago, una pasarela de pago externa. Los datos de tu tarjeta son ingresados y tratados directamente por Mercado Pago bajo sus propias políticas de seguridad; nosotros no tenemos acceso a ellos ni los guardamos en nuestros servidores.',
    ],
  },
  {
    icon: Cookie,
    title: '5. Cookies y almacenamiento local',
    body: [
      'Este sitio utiliza almacenamiento local del navegador (localStorage) y cookies técnicas necesarias para su funcionamiento:',
      '• Carrito de compras ("infinito-joyas-cart"): recuerda los productos que agregaste para que no los pierdas al navegar o recargar la página. Es estrictamente necesario.',
      '• Preferencia de cookies ("infinito-joyas-cookie-consent"): guarda si aceptaste o rechazaste este aviso, para no volver a mostrártelo.',
      'Al ingresar por primera vez puedes aceptar o rechazar el uso de cookies. Las cookies estrictamente necesarias se utilizan siempre, ya que sin ellas el carrito no funciona.',
    ],
  },
  {
    icon: Lock,
    title: '6. Conservación y seguridad',
    body: [
      'Conservamos tus datos durante el tiempo necesario para cumplir con la finalidad del pedido y las obligaciones legales aplicables. Aplicamos medidas técnicas y organizativas razonables para proteger tu información.',
    ],
  },
  {
    icon: UserCheck,
    title: '7. Tus derechos',
    body: [
      'Conforme a la Ley N° 19.628 y a la Ley N° 21.719 sobre protección de datos personales, puedes ejercer tus derechos de acceso, rectificación, cancelación, oposición, portabilidad y bloqueo de tus datos escribiendo a [CORREO DE CONTACTO].',
    ],
  },
  {
    icon: ShieldCheck,
    title: '8. Cambios en esta política',
    body: [
      'Podemos actualizar esta política para reflejar cambios en nuestras prácticas o en la normativa. Publicaremos cualquier cambio en esta misma página.',
      'Última actualización: [FECHA DE ÚLTIMA ACTUALIZACIÓN].',
    ],
  },
];

const Privacy = () => {
  return (
    <div className="bg-infinito-cream min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-infinito-black mb-4">
            Política de Privacidad y Cookies
          </h1>
          <div className="w-24 h-1 bg-infinito-gold mx-auto mb-6"></div>
          <p className="text-gray-600 italic max-w-2xl mx-auto">
            Tu privacidad es importante. Aquí te explicamos qué datos usamos y para qué.
          </p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="bg-white p-8 rounded-3xl shadow-sm border border-infinito-gold/10"
              >
                <h2 className="flex items-center gap-3 text-xl font-serif text-infinito-black mb-4">
                  <span className="p-2 bg-infinito-pink/30 rounded-xl text-infinito-gold">
                    <Icon size={20} />
                  </span>
                  {section.title}
                </h2>
                <div className="space-y-3 text-gray-600 leading-relaxed">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-12">
          Este documento es un modelo base y no constituye asesoría legal. Completa los
          datos entre corchetes y revísalo antes de publicarlo.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
