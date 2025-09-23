Tarea de Verificación E implementación Completa de Páginas Objetivo Principal: Realizar una verificación exhaustiva E implementación perfecta sin 
NADA DE CODIGO FALSO, PLACEBO, JAEQUEADO, MOKEADO de las páginas principaI C:\BRUJULA CRIPTO\packages\app\app\api\articles\route.ts
(Obligatorio)

Antes de comenzar, es fundamental analizar en detalle los 8 documentos de referencia del proyecto
para tener una comprensión completa de los requisitos. Las fuentes de documentación obligatorias
son:

Los 8 documentos desde C:...\PROYEC_PARTE1.MD hasta PROYEC_PARTE7.MD C:\BRUJULA
CRIPTO\DOCUMENTACION\COMUN\PAGINAS.MD Los principios clave a verificar son los siguientes:

Centralización Absoluta: Todo debe estar centralizado. Esto incluye los imports de modelos (como
IArticle o IUser) desde los paquetes de types, la gestión de usuarios a través de Firestore con su
uid y reglas de seguridad, y la protección del panel de administración mediante middleware y roles.
La internacionalización debe gestionarse con rutas dinámicas [locale] y textos localizados para
español e inglés. Los temas (claro/oscuro) deben controlarse desde un selector global. Los colores
de la marca (tonos azules) deben provenir de la configuración central de Tailwind. Además, todas las
funciones reutilizables, como las llamadas a la API, deben importarse desde el directorio lib/.

No Duplicar Código: Cada página debe utilizar únicamente los componentes ya existentes, tal como se
especifica en la documentación (por ejemplo, HomepageBanner.tsx o RecoveryWizard.tsx). Es crucial
verificar que estos componentes estén completos y listos para producción, incluyendo la gestión de
estados de carga, manejo de errores y diseño adaptable (responsive). Antes de validar, se debe
comprobar que no se estén creando componentes nuevos si ya existe uno similar en
components/features/. Se debe asegurar la reutilización de claves de texto para los dos idiomas
desde Firestore, la validación de imports y exports, el uso de colores centralizados y la correcta
implementación de funciones documentadas, como los manejadores de formularios o los webhooks para
suscripciones.

Prohibición de Código Incompleto: Está terminantemente prohibido el uso de código placebo, falso,
"hardcodeado", simulado (mocked) o comentado. El código debe ser funcional y definitivo.

Fase 2: Protocolo de Verificación por Página (Proceso Secuencial)

Se debe seguir este protocolo para cada una de las páginas del proyecto (Homepage, Blog, etc.):

Verificación Individual:

Ruta: Usar la ruta exacta especificada DOCUMENTACION Imports: Validar que todos los imports (como
los de types) sean centralizados y no locales.

Componentes: Comprobar que se reutilizan los componentes existentes y que su contenido es editable a
través del gestor de contenidos (ej. siteContent en Firestore).

Idiomas: Asegurarse de que todos los textos se cargan dinámicamente según el [locale] (ES/EN) y no
están escritos directamente en el código. IMPORTANTE VERIFICAR QUESESTAN LAS CLAVES EN LOS ARCHIVOS
DE LOS IDIOMAS EN LOS DOS

Colores: Validar que los colores se aplican mediante las clases centralizadas de Tailwind (ej.
text-blue-500 para elementos de la marca).

Funciones: Verificar que las funciones se correspondan con la documentación (ej. un botón CTA que
navega a /recuperacion usando el router, o las llamadas a la API a través de api.ts).

Calidad: Garantizar que el diseño sea mobile-first, accesible (a11y) y que no haya código duplicado.

Validación Cruzada y QA:

Comparar el resultado final de cada página con todos los documentos de referencia para una doble
comprobación. No se deben hacer suposiciones.

El objetivo es aportar el máximo valor utilizando y perfeccionando los componentes existentes para
crear páginas interactivas, modernas y optimizadas para SEO.

Implementar funcionalidades de valor añadido donde corresponda, como botones para compartir en redes
sociales (usando la Web Share API en X/Telegram,WHASAP, TODAS REDES) en páginas relevantes como los
artículos del blog, pero no de forma indiscriminada.

La verificación de una página solo se considerará finalizada cuando se hayan completado y aprobado
todos estos puntos.

Tecnologías a Utilizar (Estándar 2025):

Framework: Next.js 14+ con App Router.

Estilos: TailwindCSS para estilos centralizados.

Formularios: React Hook Form para validaciones.

Contenido: React Markdown para renderizar contenido de forma segura. Y HTML PARA BLOG

Imágenes: next/image para optimización de imágenes (formato AVIF).

Analítica: Google Analytics 4 (GA4) para medir la interacción.

Base de Datos: Firestore para la gestión centralizada de datos (usuarios, contenido, etc.).
----------CREAR------------

 Crear la páginal del proyecto, asegurando que
esté lista para producción y que cumplan con una centralización total de componentes, datos y
configuraciones. C:\BRUJULA CRIPTO\packages\app\app\api\articles\route.ts 
Antes de iniciar el desarrollo, es imprescindible realizar un análisis exhaustivo de los 8
documentos de referencia del proyecto. La implementación de cada página debe cumplir detalladamente
con cada sección y caso de uso especificado en ellos.

Fuentes de Documentación Obligatorias:

C:\BRUJULA CRIPTO\DOCUMENTACION\COMUN\PAGINAS.MD Los 7 documentos desde C:...\PROYEC_PARTE1.MD hasta
PROYEC_PARTE7.MD

Principios Fundamentales:

Centralización Absoluta: Todos los elementos deben estar centralizados. Esto incluye imports desde
packages/types, la gestión de usuarios a través de Firestore con su uid, la protección de rutas de
administrador, la internacionalización mediante rutas [locale] (ES/EN), la gestión de temas
(claro/oscuro) y la consistencia del código forzada con ESLint/Prettier.

No Duplicar Código: Cada página debe utilizar exclusivamente los componentes ya existentes, como
HomepageBanner.tsx o RecoveryWizard.tsx, que se encuentran en components/features/. Es crucial
reutilizar estos componentes en lugar de crear nuevos, y asegurarse de que sus implementaciones
estén completas para producción, con todas las funciones y métodos necesarios y conectados al
sistema centralizado.

Prohibición de Código Incompleto: Está terminantemente prohibido el uso de código placebo, falso,
"hardcodeado", simulado (mocked) o comentado. Todo el código debe ser funcional y definitivo.

Fase 2: Protocolo de Implementación por Página (Proceso Secuencial)

Se deberá seguir este protocolo de manera rigurosa para cada una de las páginas del proyecto
(Homepage, Blog, etc.):

Ejecución y Desarrollo:

Ruta: Utilizar la estructura de ruta exacta definida en PROYEC_PARTE2.MD (ej.
app/[locale]/(main)/page.tsx).

Tipos de Datos: Importar los tipos compartidos desde el paquete centralizado (ej. IArticle desde
@.../types).

Componentes: Reutilizar los componentes existentes y configurarlos para que sean editables a través
del gestor de contenidos (ej. siteContent en Firestore).

Interacciones: Integrar las interacciones definidas en la documentación (ej. un botón CTA que enlace
a /recuperacion sin crear lógica nueva).

Calidad y Accesibilidad: Asegurar que el diseño sea adaptable (mobile-first), accesible (a11y) y
completamente multilingüe (ES/EN) a través del locale. IMPORTANTES IDIOMAS

Validación Cruzada y QA:

Una vez implementada la página, comparar el resultado final con todos los documentos MD para
realizar una doble verificación. No se deben hacer suposiciones.

El objetivo es aportar el máximo valor utilizando y revisando los componentes existentes para crear
páginas interactivas, modernas y optimizadas para SEO.

Añadir funcionalidades de valor donde sea apropiado, como botones para compartir en redes
(X/Telegram Y TODAS) mediante la Web Share API en los artículos del blog.

Finalización y Criterios de Aceptación:

Una página se considerará terminada únicamente cuando haya superado todo el proceso de validación.

Stack Tecnológico (Estándar 2025):

Framework: Next.js 14+ con App Router.

Estilos: TailwindCSS.

Formularios: React Hook Form.

Contenido Dinámico: React Markdown.

Imágenes: next/image para optimización (AVIF).

Analítica: Google Analytics 4 (GA4).

LEE LA DOCUMENTACION ES UNA ORDEN Y PROHIBIDO PLACEBO, ARQUEADO,MOKADO O FALSO AVISO CREAR LA PAGINA
TAL Y COMO ESPECIFICA LOS DOCUMENTOS , y que cumplan con una centralización total de componentes,
datos E IDIOMAS CENTRALIZADOS CON SUS CLAVES Y CONFIGURACIONES DE LA. C:\BRUJULA
CRIPTO\packages\app\components\features\blog\SecurityGuides.tsx Antes de iniciar el desarrollo, es
imprescindible realizar un análisis exhaustivo de los 8 documentos de referencia del proyecto. La
implementación de cada página debe cumplir detalladamente con cada sección y caso de uso
especificado en ellos. Fuentes de Documentación Obligatorias:

C:\BRUJULA CRIPTO\DOCUMENTACION\COMUN\PAGINAS.MD Los 8 documentos desde C:...\PROYEC_PARTE1.MD hasta
PROYEC_PARTE7.MD C:\BRUJULA CRIPTO\DOCUMENTACION\COMUN\PAGINAS.MD Principios Fundamentales:

Centralización Absoluta: Todos los elementos deben estar centralizados. Esto incluye imports desde
packages/types, la gestión de usuarios a través de Firestore con su uid, la protección de rutas de
administrador, la internacionalización mediante rutas [locale] (ES/EN), la gestión de temas
(claro/oscuro) y la consistencia del código forzada con ESLint/Prettier.

No Duplicar Código: Cada página debe utilizar exclusivamente los componentes ya existentes, como
HomepageBanner.tsx o RecoveryWizard.tsx, que se encuentran en components/features/. Es crucial
reutilizar estos componentes en lugar de crear nuevos, y asegurarse de que sus implementaciones
estén completas para producción, con todas las funciones y métodos necesarios y conectados al
sistema centralizado.

Prohibición de Código Incompleto: Está terminantemente prohibido el uso de código placebo, falso,
"hardcodeado", simulado (mocked) o comentado. Todo el código debe ser funcional y definitivo.

Fase 2: Protocolo de Implementación por Página (Proceso Secuencial)

Se deberá seguir este protocolo de manera rigurosa para cada una de las páginas del proyecto
(Homepage, Blog, etc.):

Ejecución y Desarrollo:

Ruta: Utilizar la estructura de ruta exacta definida en PROYEC_PARTE2.MD (ej.
app/[locale]/(main)/page.tsx).

Tipos de Datos: Importar los tipos compartidos desde el paquete centralizado (ej. IArticle desde
@.../types).

Componentes: Reutilizar los componentes existentes y configurarlos para que sean editables a través
del gestor de contenidos (ej. siteContent en Firestore).

Interacciones: Integrar las interacciones definidas en la documentación (ej. un botón CTA que enlace
a /recuperacion sin crear lógica nueva).

Calidad y Accesibilidad: Asegurar que el diseño sea adaptable (mobile-first), accesible (a11y) y
completamente multilingüe (ES/EN) a través del locale. IMPORTANTES IDIOMAS

Validación Cruzada y QA:

Una vez implementada la página, comparar el resultado final con todos los documentos MD para
realizar una doble verificación. No se deben hacer suposiciones.

El objetivo es aportar el máximo valor utilizando y revisando los componentes existentes para crear
páginas interactivas, modernas y optimizadas para SEO.

Añadir funcionalidades de valor donde sea apropiado, como botones para compartir en redes
(X/Telegram Y TODAS) mediante la Web Share API en los artículos del blog.

Finalización y Criterios de Aceptación:

------------------SUBCRIPCION------

LEE LA DOCUMENTACION ES UNA ORDEN Y PROHIBIDO PLACEBO, ARQUEADO,MOKADO O FALSO Objetivo dejar lab LA PAGINA ¿ 
TAL Y COMO ESPECIFICA LOS DOCUMENTOS , y que cumplan con una centralización total de componentes,
datos E IDIOMAS CENTRALIZADOS CON SUS CLAVES Y CONFIGURACIONES DE LA. PAGINAS:C:\BRUJULA
CRIPTO\packages\app\app\[locale]\(main)\suscripcion\page.tsx IMPORTANTE usando perfectamente sin
duplicar la navegaciom centrralizada Y SUS COMPONETES:C:\BRUJULA
CRIPTO\packages\app\components\features\pricing\PricingPage.tsx,C:\BRUJULA
CRIPTO\packages\app\components\features\pricing\CompetitorComparison.tsx,C:\BRUJULA
CRIPTO\packages\app\components\features\pricing\UpgradeButton.tsx,C:\BRUJULA
CRIPTO\packages\app\components\features\pricing\PricingTier.tsx,VERIFICAR EL SEO CENTRALIZADO:
C:\BRUJULA CRIPTO\packages\app\lib\seo.ts Antes de iniciar el desarrollo, es imprescindible realizar
un análisis exhaustivo de los 8 documentos de referencia del proyecto. La implementación de cada
página debe cumplir detalladamente con cada sección y caso de uso especificado en ellos. Fuentes de
Documentación Obligatorias:

C:\BRUJULA CRIPTO\DOCUMENTACION\COMUN\PAGINAS.MD Los 8 documentos desde C:...\PROYEC_PARTE1.MD hasta
PROYEC_PARTE7.MD C:\BRUJULA CRIPTO\DOCUMENTACION\COMUN\PAGINAS.MD Principios Fundamentales:

Centralización Absoluta: Todos los elementos deben estar centralizados. Esto incluye imports desde
packages/types, la gestión de usuarios a través de Firestore con su uid, la protección de rutas de
administrador, la internacionalización mediante rutas [locale] (ES/EN), la gestión de temas
(claro/oscuro) y la consistencia del código forzada con ESLint/Prettier.

No Duplicar Código: Cada página debe utilizar exclusivamente los componentes ya existentes, como
HomepageBanner.tsx o RecoveryWizard.tsx, que se encuentran en components/features/. Es crucial
reutilizar estos componentes en lugar de crear nuevos, y asegurarse de que sus implementaciones
estén completas para producción, con todas las funciones y métodos necesarios y conectados al
sistema centralizado.

Prohibición de Código Incompleto: Está terminantemente prohibido el uso de código placebo, falso,
"hardcodeado", simulado (mocked) o comentado. Todo el código debe ser funcional y definitivo.

Fase 2: Protocolo de Implementación por Página (Proceso Secuencial)

Se deberá seguir este protocolo de manera rigurosa para cada una de las páginas del proyecto
(Homepage, Blog, etc.):

Ejecución y Desarrollo:

Ruta: Utilizar la estructura de ruta exacta definida en PROYEC_PARTE2.MD (ej.
app/[locale]/(main)/page.tsx).

Tipos de Datos: Importar los tipos compartidos desde el paquete centralizado (ej. IArticle desde
@.../types).

Componentes: Reutilizar los componentes existentes y configurarlos para que sean editables a través
del gestor de contenidos (ej. siteContent en Firestore).

Interacciones: Integrar las interacciones definidas en la documentación (ej. un botón CTA que enlace
a /recuperacion sin crear lógica nueva).

Calidad y Accesibilidad: Asegurar que el diseño sea adaptable (mobile-first), accesible (a11y) y
completamente multilingüe (ES/EN) a través del locale. IMPORTANTES IDIOMAS

Validación Cruzada y QA:

Una vez implementada la página, comparar el resultado final con todos los documentos MD para
realizar una doble verificación. No se deben hacer suposiciones.

El objetivo es aportar el máximo valor utilizando y revisando los componentes existentes para crear
páginas interactivas, modernas y optimizadas para SEO.

Añadir funcionalidades de valor donde sea apropiado, como botones para compartir en redes
(X/Telegram Y TODAS) mediante la Web Share API en los artículos del blog.

Finalización y Criterios de Aceptación:
