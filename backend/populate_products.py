import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from core_api.models import Category, Product

def run():
    # Obtener o crear categorías
    cat_aros, _ = Category.objects.get_or_create(name='Aros', slug='aros')
    cat_collares, _ = Category.objects.get_or_create(name='Collares', slug='collares')
    cat_pulseras, _ = Category.objects.get_or_create(name='Pulseras', slug='pulseras')
    cat_conjuntos, _ = Category.objects.get_or_create(name='Conjuntos', slug='conjuntos')
    
    # ELIMINAR TODO LO ANTIGUO PARA LIMPIEZA TOTAL
    Product.objects.all().delete()
    
    products = [
        {'name': 'Aros racimo', 'price': 16990, 'category': cat_aros, 'image': 'products/Aros_color.jpeg', 'description': 'Disponible en color rosa.'},
        {'name': 'Collar cereza', 'price': 17990, 'category': cat_collares, 'image': 'products/Cadena_cereza_Bañada en oro.jpeg', 'description': 'Collar con cadena con borlas, dije de cereza, ambos laminado en oro 18k.'},
        {'name': 'Aros gota', 'price': 8990, 'category': cat_aros, 'image': 'products/Aros_Rosados_Bañados_oro.jpeg', 'description': 'Disponible en color rosa.'},
        {'name': 'Pulsera tipo pandora', 'price': 16990, 'category': cat_pulseras, 'image': 'products/conjunto_color.jpeg', 'description': 'Pulsera tipo pandora con charms de flor y corazón rosa, todo es laminado en oro 18k.'},
        {'name': 'Aros flor', 'price': 7990, 'category': cat_aros, 'image': 'products/Aros_Flores.jpeg', 'description': 'Disponible en color rosa, naranja, rojo y amarillo.'},
        {'name': 'Aros corazón', 'price': 7990, 'category': cat_aros, 'image': 'products/Aros_Corazon.jpeg', 'description': 'Disponible en rosa y naranja.'},
        {'name': 'Pulsera corazón con circones', 'price': 14990, 'category': cat_pulseras, 'image': 'products/Cadena_Corazón_Bañada en oro.jpeg', 'description': 'Pulsera de laminado en oro 18k con circones blancos.'},
        {'name': 'Aros largo', 'price': 6990, 'category': cat_aros, 'image': 'products/Aros.jpeg', 'description': 'Disponible en verde agua.'},
        {'name': 'Aros argolla', 'price': 16990, 'category': cat_aros, 'image': 'products/Aros_corazon_brillante.jpeg', 'description': 'Aros argolla laminados en oro 18k.'},
        {'name': 'Aros cadena', 'price': 12990, 'category': cat_aros, 'image': 'products/cadena.jpeg', 'description': 'Cadena con baño de oro y perlas de río.'},
        {'name': 'Pulsera Flor circones', 'price': 21990, 'category': cat_pulseras, 'image': 'products/Gargantilla_Bañada_en_oro.jpeg', 'description': 'Pulsera de flores con circones blancos laminada en oro 18k.'},
        {'name': 'Collar nudo de bruja', 'price': 18990, 'category': cat_collares, 'image': 'products/Cadena_Flor_Bañada_en_oro.jpeg', 'description': 'Cadena con baño de oro y dije nudo de bruja.'},
        {'name': 'Collar sol', 'price': 17990, 'category': cat_collares, 'image': 'products/Cadena_Sol_Bañada_en_oro.jpeg', 'description': 'Cadena con baño de oro 18k y dije de sol baño 18k mas circones.'},
        {'name': 'Collar Flor', 'price': 17990, 'category': cat_collares, 'image': 'products/collar_Flores.jpeg', 'description': 'Collar flor rosa laminado en oro 18k.'},
        {'name': 'Collar mariposa', 'price': 21990, 'category': cat_collares, 'image': 'products/collar_Mariposa.jpeg', 'description': 'Perlas cuarzo rosa, cadena baño 18k y dije de mariposa baño 18k con circones.'},
        {'name': 'Collar cadena larga', 'price': 18990, 'category': cat_collares, 'image': 'products/Cadena_Petalo_oro.jpeg', 'description': 'cadena con baño de oro y perlas de río.'},
        {'name': 'Collar serpiente', 'price': 14990, 'category': cat_collares, 'image': 'products/safiro_cadena.jpeg', 'description': 'collar serpiente laminado en oro 18k.'},
        {'name': 'Collar maxi corazón con circones', 'price': 17990, 'category': cat_collares, 'image': 'products/collar_con corazon.jpeg', 'description': 'Collar maxi corazon con circones blancos laminado en oro 18k.'},
        {'name': 'Anillo javi', 'price': 9990, 'category': cat_conjuntos, 'image': 'products/Aros_Colores.jpeg', 'description': 'Anillo ajustable con circones blancos laminado en oro 18k.'},
        {'name': 'Pulsera suerte jade', 'price': 13990, 'category': cat_pulseras, 'image': 'products/Collar_Plantita.jpeg', 'description': 'Piedras jade, dije de trebol y cadena baño 18k.'},
        {'name': 'Collar corazon rosa', 'price': 27990, 'category': cat_collares, 'image': 'products/Collar corazon.jpeg', 'description': 'Collar de plata 925 con dije chunky esmaltado rosa.'},
        {'name': 'Punto de Luz', 'price': 21990, 'category': cat_collares, 'image': 'products/Collar_Perla.jpeg', 'description': 'Collar plata 925 con punto de luz 6mm.'},
        {'name': 'Aros perla', 'price': 8990, 'category': cat_aros, 'image': 'products/Aros_Perla_corazon.jpeg', 'description': 'Aros de perla 10 mm.'},
        {'name': 'Conjunto perla', 'price': 23990, 'category': cat_conjuntos, 'image': 'products/conjunto, collar mas aros.jpeg', 'description': 'Conjunto de perlas 10 mm con cadena plata 925.'},
    ]

    for p_data in products:
        Product.objects.create(stock=10, **p_data)
    
    print(f"Catálogo limpiado y {len(products)} productos cargados correctamente.")

if __name__ == "__main__":
    run()
