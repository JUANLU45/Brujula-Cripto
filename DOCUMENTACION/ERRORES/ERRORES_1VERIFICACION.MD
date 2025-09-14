ANÁLISIS DE CENTRALIZACIÓN DE IDIOMAS ❌ VIOLACIONES CRÍTICAS DETECTADAS: ARCHIVOS DE TRADUCCIÓN
VACÍOS

es.json - VACÍO en.json - VACÍO Documentación especifica: "Todo el texto estático debe venir de
estos archivos" CONFIGURACIÓN INCOMPLETA

request.ts referencia ../messages/${locale}.json Pero los archivos están en es.json y en.json Ruta
incorrecta: messages/ vs i18n/ COMPONENTES CON TEXTOS SIN TRADUCCIONES

Todos los componentes usan useTranslations() correctamente Pero faltan las claves de traducción en
los archivos JSON ✅ ELEMENTOS CORRECTAMENTE CENTRALIZADOS: Configuración de next-intl:

routing.ts ✅ Configurado correctamente middleware.ts ✅ Integra i18n con auth next.config.js ✅
Plugin configurado Uso en componentes:

useTranslations() implementado en todos los componentes Patrón consistente de uso 3. TEMAS
CENTRALIZADOS Texto buscado para next-themes|theme|dark.*mode|light.*mode|claro.*oscuro
(**/DOCUMENTACION/COMUN/**), resultados 17 Texto buscado para
next-themes|ThemeProvider|ThemeSwitcher|useTheme (**/packages/app/**), 1 resultado Se buscaron
archivos que coinciden con \*\*/*theme\*.tsx, no hay coincidencias

Se buscaron archivos que coinciden con \**/*Theme\*.tsx, no hay coincidencias

Texto buscado para dark:|dark:bg|dark:text (**/packages/app/**), resultados 20 Leer layout.tsx

Leer layout.tsx

🔍 ANÁLISIS DE CENTRALIZACIÓN DE TEMAS ❌ VIOLACIONES MASIVAS DETECTADAS: PROVEEDOR DE TEMAS AUSENTE

No existe ThemeProvider global layout.tsx está VACÍO Documentación exige: "Implementar el
ThemeSwitcher para el modo claro/oscuro" COMPONENTE THEMESWITCHER AUSENTE

No existe ningún ThemeSwitcher.tsx Documentación especifica: "Un icono de sol/luna" CONFIGURACIÓN
INCOMPLETA

next-themes instalado pero sin configurar No hay proveedor global configurado ✅ ELEMENTOS
PARCIALMENTE CORRECTOS: Estilos dark: implementados: Componentes UI usan clases dark: correctamente
Colores estándar de Tailwind ✅ (tras corrección previa) 4. IMPORT/EXPORT CENTRALIZADOS Texto
buscado para import._\.\./\.\.|import._\./\./\./|import.\*\./\./\./\./ (**/packages/app/**),
resultados 16 Leer tsconfig.json

🔍 ANÁLISIS DE CENTRALIZACIÓN DE IMPORT/EXPORT ❌ VIOLACIONES MASIVAS DETECTADAS: RUTAS RELATIVAS
MASIVAS

Todos los componentes usan rutas relativas: ../../../lib/api Documentación exige: Path aliases con
@/ tsconfig.json ✅ Configurado correctamente IMPORTACIONES INCORRECTAS

import { createArticle } from '../../../lib/api' DEBE SER: import { createArticle } from '@/lib/api'
✅ CONFIGURACIÓN CORRECTA: Path aliases en tsconfig.json: @/_, @/components/_, @/lib/\* ✅
Configurados @brujula-cripto/types ✅ Referencia correcta 📋 RESUMEN FASE 4 - CENTRALIZACIONES
CRÍTICAS ❌ VIOLACIONES DETECTADAS:

1. USUARIOS/ADMIN - FALTA IMPLEMENTACIÓN Firebase Auth configurado ✅ Custom claims implementados ✅
   FALTA: AuthProvider global funcional
2. IDIOMAS - CONFIGURACIÓN INCOMPLETA next-intl configurado ✅ Middleware integrado ✅ FALTA:
   Archivos de traducción en.json VACÍOS ERROR: Ruta incorrecta en request.ts
3. TEMAS - SIN IMPLEMENTAR next-themes instalado ✅ FALTA: ThemeProvider global FALTA: ThemeSwitcher
   component FALTA: Layout con providers
4. IMPORT/EXPORT - VIOLACIÓN MASIVA Path aliases configurados ✅ VIOLACIÓN: Todos los componentes
   usan rutas relativas DEBE CORREGIRSE: '../../../' → '@/' 🚨 PRIORIDAD MÁXIMA: Completar archivos
   de traducción (es.json/en.json) Implementar ThemeProvider + ThemeSwitcher Corregir TODAS las
   importaciones relativas Implementar AuthProvider funcional ¿Continuar con las correcciones de
   estas violaciones críticas?
