Entendido. A continuación, he reestructurado y refinado cada uno de los prompts que me has proporcionado para que sean claros, precisos y sin ambigüedades, tal como solicitas. El objetivo es que una IA pueda ejecutarlos de manera milimétrica, eliminando cualquier posibilidad de especulación o interpretación.

Aquí están los prompts optimizados, presentados por separado.

Prompt 1: Verificación de Estructura de Archivos
Objetivo Original: Verificar que la estructura de archivos y carpetas en la ruta C:\BRUJULA CRIPTO\DOCUMENTACION\COMUN sea correcta y completa.

▶️ Prompt Optimizado:

Tarea: Verificar la integridad de la estructura de archivos del proyecto.

Directorio de Referencia: Accede a la ruta C:\BRUJULA CRIPTO\DOCUMENTACION\COMUN.

Acción: Realiza un listado completo de todos los archivos y subdirectorios contenidos en esa ubicación.

Verificación: Compara el listado obtenido contra la documentación oficial del proyecto que define la estructura de archivos esperada para dicho directorio.

Reporte:

Confirma si la estructura actual coincide exactamente con la documentación.

Si existen discrepancias, genera un informe detallado que liste de forma explícita:

Archivos o directorios faltantes.

Archivos o directorios adicionales que no deberían estar.

Archivos o directorios ubicados en una ruta incorrecta.

Regla Crítica: No asumas ni infieras ninguna estructura. El reporte debe basarse únicamente en la comparación directa entre el estado actual del directorio y la documentación de referencia.

Prompt 2: Implementación de la Fase 2.2
Objetivo Original: Desarrollar la Fase 2.2 del proyecto siguiendo estrictamente las directrices, sin usar código falso o de relleno y respetando la centralización.

▶️ Prompt Optimizado:

Tarea: Implementar la Fase 2.2 del proyecto.

Instrucciones de Ejecución:

Alcance: Tu única responsabilidad en esta tarea es implementar las funcionalidades y componentes especificados para la Fase 2.2, tal y como se describe en el documento de planificación del proyecto.

Adherencia a la Arquitectura:

Centralización: Utiliza obligatoriamente los sistemas centralizados del proyecto para:

Estilos: Colores, fuentes y temas (Modo Oscuro/Claro).

Idiomas: Textos y etiquetas (internacionalización - i18n).

Estado Global: Gestión de sesión de usuario, estado de administrador, etc.

Rutas: Importaciones y exportaciones mediante alias de ruta preconfigurados (ej: @/components, @/utils).

Calidad del Código:

El código debe ser funcional y definitivo.

Está estrictamente prohibido el uso de:

Código de relleno (placeholder).

Datos falsos o "mockeados" (mock data) en la implementación final.

Bloques de código funcional comentados.

Valores "hardcodeados" (escritos directamente en el código) que deberían provenir de los sistemas centralizados.

Manejo de Código Placebo Existente: Si durante la implementación de la Fase 2.2 encuentras código placebo o componentes incompletos pertenecientes a otras fases, no los modifiques. Déjalos como están. Tu enfoque debe estar exclusivamente en la Fase 2.2.

Prompt 3: Auditoría de Calidad y Cumplimiento
Objetivo Original: Verificar que todo el trabajo realizado cumple con las reglas de centralización del proyecto y no contiene código falso o innecesario.

▶️ Prompt Optimizado:

Tarea: Realizar una auditoría de calidad y cumplimiento sobre el código base del proyecto.

Proceso de Verificación (Checklist):

Examina cada archivo del proyecto y verifica el cumplimiento de las siguientes reglas. Para cada punto, el resultado debe ser "Cumple" o "No Cumple", y en caso de no cumplir, se debe listar el archivo y la línea de código específicos.

✅ Centralización de Estilos:

¿Todos los componentes utilizan las variables de color definidas en el sistema de temas centralizado?

¿La implementación del Modo Claro y Oscuro se gestiona a través del proveedor de temas global?

✅ Centralización de Idiomas:

¿Todos los textos visibles para el usuario están siendo gestionados por el sistema de internacionalización (i18n)? No debe haber texto "hardcodeado".

✅ Centralización de Estado:

¿La detección del estado de login del usuario (registrado vs. no registrado) se consume desde el gestor de estado global?

¿La verificación de permisos de administrador se consume desde el gestor de estado global?

✅ Centralización de Rutas (Imports/Exports):

¿Todas las declaraciones import y export utilizan los alias de ruta definidos en el proyecto (ej: @/services) en lugar de rutas relativas (ej: ../services)?

✅ Limpieza de Código:

¿Existen archivos duplicados?

¿Hay código de funcionalidad comentado?

¿Se utiliza código falso, placebo o "mockeado" en componentes funcionales?

Resultado Final: Genera un informe detallado con los resultados de la auditoría para cada punto del checklist.

Prompt 4: Acción Correctiva de Importaciones y Exportaciones
Objetivo Original: Arreglar de forma masiva todas las importaciones y exportaciones para que dejen de usar rutas relativas y cumplan con la centralización del proyecto.

▶️ Prompt Optimizado:

Tarea: Acción Correctiva Crítica: Refactorizar todas las importaciones y exportaciones del proyecto para cumplir con la regla de centralización de rutas.

Problema Identificado: Se ha detectado una violación masiva de la arquitectura del proyecto. Múltiples archivos utilizan rutas relativas (ej: ../../components/Button) en lugar de los alias de ruta configurados (ej: @/components/Button).

Plan de Ejecución (Secuencial y Obligatorio):

Análisis: Escanea todos los archivos de código fuente del proyecto (ej: .js, .jsx, .ts, .tsx, .vue).

Identificación: En cada archivo, identifica todas las declaraciones import y export que utilicen una ruta relativa (que comience con . o ..).

Refactorización:

Modifica cada ruta relativa identificada para reemplazarla por su alias de ruta absoluto equivalente, según la configuración del proyecto (ej: jsconfig.json o tsconfig.json).

Realiza esta operación archivo por archivo, de manera sistemática.

Verificación Final: Una vez modificados todos los archivos, ejecuta un proceso de verificación para confirmar que no queda ninguna importación o exportación con ruta relativa en todo el proyecto.

Directiva Final: Esta tarea tiene la máxima prioridad. No inicies ninguna otra tarea de desarrollo o modificación hasta que esta refactorización esté 100% completada y verificada. El sistema de rutas debe quedar perfectamente centralizado como exige el proyecto.












Deep Research

Vídeo

🍌 Imagen

Canvas


