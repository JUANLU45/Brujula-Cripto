Claro, aquí tienes el contenido del documento explicado en un formato de texto convencional.

Organización de la Carpeta public
Introducción
Este documento detalla cómo está organizada la carpeta public, que se encuentra en la ruta packages/app/public/. La estructura sigue de manera estricta las especificaciones de otros documentos del proyecto para garantizar la coherencia.

El propósito principal de esta carpeta es almacenar todos los archivos estáticos (imágenes, iconos, etc.) que necesita el sitio web. Al estar en esta ubicación, el sistema (Next.js) puede servirlos directamente. Esto incluye imágenes fijas como banners y logos, los iconos de redes sociales que aparecen en el pie de página, y archivos importantes para el posicionamiento en buscadores (SEO), como el robots.txt.

Es importante destacar que en esta carpeta no se guardan archivos dinámicos. Por ejemplo, las imágenes de portada para las entradas del blog, que se generan automáticamente, se almacenan en otro lugar (Firestore/Storage). De esta manera, todo el contenido estático está centralizado y optimizado para un rendimiento rápido y un buen SEO.

Estructura de la Carpeta
La carpeta /public/ está organizada de la siguiente manera:

Carpeta images: Contiene las imágenes optimizadas del sitio en formatos modernos como .webp o AVIF.

Dentro de images, hay una subcarpeta home que contiene el banner principal de la página de inicio (banner-hero.webp).

También hay una subcarpeta recovery con el banner para la página de diagnóstico (banner-diagnosis.webp).

Carpeta icons: Aquí se guardan todos los iconos en formato SVG, lo que permite que se vean bien a cualquier tamaño. Incluye:

Iconos para la sección de propuesta de valor: un escudo (shield-check-icon.svg), una llave inglesa (wrench-icon.svg) y una brújula (compass-icon.svg).

El icono de la brújula (compass-icon.svg) también se usa como logo en el chatbot.

Iconos de redes sociales para el pie de página: Twitter/X (twitter-icon.svg), Telegram (telegram-icon.svg) y YouTube (youtube-icon.svg).

Archivos en la raíz de public:

404-compass.webp: Una imagen de una brújula que se muestra cuando un usuario llega a una página que no existe (Error 404).

favicon.ico: El icono pequeño que aparece en la pestaña del navegador.

apple-touch-icon.png: El icono que se usa cuando alguien guarda la web en la pantalla de inicio de un dispositivo Apple.

site.webmanifest: Un archivo de configuración que le dice al navegador y al sistema operativo cómo debe comportarse la web si se instala como una aplicación (PWA). Define el nombre "Brújula Cripto", sus iconos y su color de tema (azul).

robots.txt: Un archivo que da instrucciones a los motores de búsqueda como Google, permitiéndoles rastrear todo el sitio e indicándoles dónde está el mapa del sitio (sitemap.xml).

Uso y detalles específicos de los archivos
Banners:

El banner de la página de inicio (/public/images/home/banner-hero.webp) tiene un texto alternativo descriptivo para SEO: "Brújula Cripto - Navega con confianza".

El banner de la página de diagnóstico (/public/images/recovery/banner-diagnosis.webp) usa el texto alternativo: "Diagnóstico Brújula Cripto - Ayuda en recuperación".

Imagen de error 404:

La imagen para la página no encontrada (/public/404-compass.webp) tiene el texto alternativo: "Página no encontrada - Brújula Cripto".

Archivos de configuración:

El archivo robots.txt permite el acceso a todos los buscadores y especifica la ruta del mapa del sitio: <https://brujulacripto.com/sitemap.xml>.

El site.webmanifest está configurado con el nombre "Brújula Cripto", utiliza el icono de la brújula y define el color principal como azul (#0000FF).
