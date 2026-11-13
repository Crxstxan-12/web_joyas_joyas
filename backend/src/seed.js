import { prisma } from './config.js';

// Datos de catálogo (iguales al script original populate_products.py).
const CATEGORIES = [
  { name: 'Aros', slug: 'aros' },
  { name: 'Collares', slug: 'collares' },
  { name: 'Pulseras', slug: 'pulseras' },
  { name: 'Conjuntos', slug: 'conjuntos' },
];

const PRODUCTS = [
  // Aros
  { name: 'Aros Racimo', price: 16990, category: 'aros', image: 'products/aros/Aros racimo.jpeg', description: 'Elegantes aros tipo racimo, perfectos para cualquier ocasión.' },
  { name: 'Aros Gota Rosa', price: 8990, category: 'aros', image: 'products/aros/Aros Cuarzo rosa.jpeg', description: 'Delicados aros gota en color rosa.' },
  { name: 'Aros Flor', price: 7990, category: 'aros', image: 'products/aros/WhatsApp Image 2026-05-05 at 11.53.17.jpeg', description: 'Disponibles en varios colores: rosa, naranja, rojo y amarillo.' },
  { name: 'Aros Corazón', price: 7990, category: 'aros', image: 'products/aros/Aros Corazón.jpeg', description: 'Románticos aros en forma de corazón, disponibles en rosa y naranja.' },
  { name: 'Aros Largo Verde', price: 6990, category: 'aros', image: 'products/aros/Aros.jpeg', description: 'Aros largos disponibles en color verde agua.' },
  { name: 'Aros Argolla Corazón', price: 16990, category: 'aros', image: 'products/aros/Aros Corazon.jpeg', description: 'Aros argolla laminados en oro 18k con dije de corazón brillante.' },
  { name: 'Aros Cadena Perlas', price: 12990, category: 'aros', image: 'products/aros/Copia de Aros.jpeg', description: 'Cadena con baño de oro y perlas de río.' },
  { name: 'Aros Clásicos', price: 6990, category: 'aros', image: 'products/aros/WhatsApp Image 2026-05-05 at 19.22.16.jpeg', description: 'Aros clásicos atemporales para uso diario.' },
  { name: 'Aros Modernos', price: 8990, category: 'aros', image: 'products/aros/WhatsApp Image 2026-05-05 at 19.22.17.jpeg', description: 'Aros de diseño moderno y elegante.' },
  // Collares
  { name: 'Collar Cereza', price: 17990, category: 'collares', image: 'products/collar/Collar Cereza.jpeg', description: 'Collar con cadena y dije de cereza, laminado en oro 18k.' },
  { name: 'Collar Flor Rosa', price: 17990, category: 'collares', image: 'products/collar/Collar Flor.jpeg', description: 'Collar flor rosa laminado en oro 18k.' },
  { name: 'Collar Tulipán', price: 16990, category: 'collares', image: 'products/collar/Collar Tulipan.jpeg', description: 'Diseño delicado de tulipán, ideal para looks románticos.' },
  { name: 'Collar Turquesa', price: 18990, category: 'collares', image: 'products/collar/Collar Turquesa.jpeg', description: 'Piedra turquesa con cadena en plata 925.' },
  { name: 'Collar Corazón Rosa', price: 27990, category: 'collares', image: 'products/collar/Collar corazon rosa.jpeg', description: 'Collar de plata 925 con dije chunky esmaltado rosa.' },
  { name: 'Collar Flor de Loto', price: 18990, category: 'collares', image: 'products/collar/Collar flor de loto.jpeg', description: 'Símbolo espiritual con dije de flor de loto en baño de oro.' },
  { name: 'Collar Maxi Corazón Circones', price: 17990, category: 'collares', image: 'products/collar/Collar maxi corazón con circones .jpeg', description: 'Maxi corazón con circones blancos, laminado en oro 18k.' },
  { name: 'Collar Punto de Luz Corazón', price: 21990, category: 'collares', image: 'products/collar/Collar punto de luz corazon.jpeg', description: 'Punto de luz con dije de corazón en plata 925.' },
  { name: 'Collar Serpiente', price: 14990, category: 'collares', image: 'products/collar/Collar serpiente.jpeg', description: 'Diseño de serpiente laminado en oro 18k.' },
  { name: 'Collar Clásico', price: 15990, category: 'collares', image: 'products/collar/Collar.jpeg', description: 'Collar clásico, versátil y atemporal.' },
  { name: 'Punto de Luz', price: 21990, category: 'collares', image: 'products/collar/Punto de luz.jpeg', description: 'Collar plata 925 con punto de luz de 6mm.' },
  { name: 'Collar Nudo de Bruja', price: 18990, category: 'collares', image: 'products/collar/WhatsApp Image 2026-05-05 at 12.17.27 (1).jpeg', description: 'Cadena con baño de oro y dije nudo de bruja.' },
  // Conjuntos
  { name: 'Conjunto Perla', price: 23990, category: 'conjuntos', image: 'products/collar/Collar conjunto perla.jpeg', description: 'Conjunto de collar y aros de perlas 10mm con cadena plata 925.' },
  { name: 'Collar Conjunto Delicado', price: 19990, category: 'conjuntos', image: 'products/collar/Conjutno collar.jpeg', description: 'Conjunto delicado de collar y aros coordinados.' },
  // Pulseras
  { name: 'Pulsera Charms', price: 16990, category: 'pulseras', image: 'products/pulsera/WhatsApp Image 2026-05-05 at 19.22.17 (1).jpeg', description: 'Pulsera con charms de flor y corazón rosa, laminada en oro 18k.' },
];

async function main() {
  // Upsert de categorías.
  const categoryMap = {};
  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }

  // Borramos productos existentes y los recreamos (igual que el script original).
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  for (const p of PRODUCTS) {
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        stock: 10,
        image: p.image,
        categoryId: categoryMap[p.category],
      },
    });
  }

  console.log(`✅ Catálogo limpiado y ${PRODUCTS.length} productos cargados.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
