📋 ANÁLISIS COMPLETO PARA IMPLEMENTACIÓN DE HERRAMIENTA "ARCHIVOS ELIMINADOS"
🔍 1. ANÁLISIS DE LA DOCUMENTACIÓN EXISTENTE
Arquitectura Base Detectada:
Monorepo TypeScript con paquetes centralizados
Frontend: Next.js 15+ App Router con rutas [locale] (ES/EN)
Backend: Firebase Cloud Functions v2
Base de datos: Cloud Firestore con colecciones tipadas
Tipos centralizados: @brujula-cripto/types
Internacionalización: next-intl con archivos es.json y en.json
Autenticación: Firebase Auth con Custom Claims para roles admin
UI: Componentes centralizados en components/ui/
Patrón de Herramientas Existente:
Analizando WasmPasswordEngine.tsx y TransactionTracker.tsx:

Ubicación: recovery
Página: page.tsx
Tipos: Importados desde @brujula-cripto/types
API: Centralizada en api.ts
Backend: Cloud Functions en packages/functions/src/tools/
Traducciones: Namespace específico en archivos i18n
🏗️ 2. ARQUITECTURA COMPLETA DE LA HERRAMIENTA
Componentes Frontend Requeridos:
DeletedFilesRecovery.tsx (Componente principal)

Formulario de diagnóstico inicial
Wizard paso a paso según tipo de archivo
Interfaz de resultados y guías
Integración con sistema de créditos/premium
FileTypeSelector.tsx (Subcomponente)

Selector visual de tipos de wallet
Bitcoin Core, Ethereum Keystore, Electrum, etc.
Iconos específicos por tipo de archivo
SystemDiagnostic.tsx (Subcomponente)

Detección automática de sistema operativo
Análisis de tiempo transcurrido
Evaluación de probabilidad de recuperación
RecoveryInstructions.tsx (Subcomponente)

Guías paso a paso personalizadas
Descarga de herramientas recomendadas
Videos/tutoriales embebidos
Enlaces a servicios profesionales
ProbabilityAnalyzer.tsx (Premium)

Análisis avanzado de recuperabilidad
Métricas detalladas de éxito
Recomendaciones personalizadas
Backend Functions Requeridas:
analyzeFileRecovery.ts

Lógica de análisis de recuperabilidad
Base de datos de herramientas por OS/tipo
Cálculo de probabilidades
getRecoveryGuides.ts

Generación de guías personalizadas
Filtrado por nivel de usuario (free/premium)
Tracking de uso de herramientas
professionalServices.ts

Conexión con directorio de servicios
Filtrado por especialidad en recuperación
Sistema de referidos
Tipos TypeScript Centralizados:

// En @brujula-cripto/typesinterface IFileRecoveryCase {  id: string;  userId: string;  fileType: WalletFileType;  operatingSystem: OperatingSystem;  timeElapsed: TimeRange;  estimatedValue?: number;  recoveryProbability: number;  recommendedTools: RecoveryTool[];  status: RecoveryStatus;  createdAt: Timestamp;  updatedAt: Timestamp;}enum WalletFileType {  BITCOIN_CORE = 'bitcoin-core',  ETHEREUM_KEYSTORE = 'ethereum-keystore',  ELECTRUM = 'electrum',  METAMASK = 'metamask',  EXODUS = 'exodus',  OTHER = 'other'}enum OperatingSystem {  WINDOWS = 'windows',  MACOS = 'macos',  LINUX = 'linux',  ANDROID = 'android',  IOS = 'ios'}interface RecoveryTool {  name: string;  type: 'free' | 'paid' | 'professional';  operatingSystems: OperatingSystem[];  supportedFileTypes: WalletFileType[];  successRate: number;  downloadUrl?: string;  instructions: RecoveryStep[];  cost?: number;  difficulty: 'easy' | 'medium' | 'hard';}interface RecoveryStep {  stepNumber: number;  title: string;  description: string;  commands?: string[];  warningLevel: 'info' | 'warning' | 'critical';  estimatedTime: number; // en minutos  requiredTools?: string[];}
🗄️ 3. ESTRUCTURA DE BASE DE DATOS
Colección Firestore: fileRecoveryTools

// Documento por herramienta{  id: 'recuva-windows',  name: 'Recuva',  type: 'free',  operatingSystems: ['windows'],  supportedFileTypes: ['bitcoin-core', 'electrum', 'other'],  successRate: 75,  downloadUrl: 'https://...',  instructions: [...],  lastUpdated: timestamp,  isActive: true}
Colección Firestore: recoveryGuides

// Guías personalizadas por escenario{  id: 'bitcoin-core-windows-24h',  fileType: 'bitcoin-core',  operatingSystem: 'windows',  timeRange: 'under-24h',  steps: [...],  estimatedSuccess: 85,  difficulty: 'medium',  requiredTier: 'free' | 'premium'}
Colección Firestore: userRecoveryCases

// Historial de casos por usuario{  userId: 'user123',  caseId: 'case456',  scenario: {...},  toolsUsed: ['recuva', 'photorec'],  outcome: 'success' | 'partial' | 'failed' | 'pending',  notes: 'Usuario recuperó 80% de archivos',  createdAt: timestamp}
🔗 4. INTEGRACIÓN CON SISTEMA EXISTENTE
Sistema de Créditos/Premium:
Usuarios gratuitos: Guías básicas, herramientas gratuitas solamente
Usuarios premium: Análisis avanzado, herramientas comerciales, soporte prioritario
Tracking de uso: Integración con trackUsage existente
Límites: Número de análisis por mes según plan
Integración con Directorio de Servicios:
Casos complejos: Redirección automática a /herramientas/servicios
Filtrado especializado: Profesionales con especialidad en recuperación de archivos
Sistema de referidos: Tracking de usuarios enviados desde herramienta
Integración con Chatbot:
Asistencia contextual: Chatbot especializado en recuperación de archivos
Seguimiento de casos: IA que ayuda durante el proceso de recuperación
Escalación automática: Derivar a soporte humano en casos críticos
📍 5. UBICACIÓN EN ARQUITECTURA DE RUTAS
Ruta Principal:

/[locale]/(main)/recuperacion/deleted-files/page.tsx
Modificación en RecoveryWizard:

// Cambiar en RecoveryWizard.tsx línea 54:{  id: 'deleted-files',  icon: '🗂️',  title: t('options.deleted.title'),  description: t('options.deleted.description'),  link: '/recuperacion/deleted-files', // <-- NUEVA RUTA  difficulty: 'easy',  estimatedTime: t('options.deleted.time'),  isPremium: false,}
🌐 6. INTERNACIONALIZACIÓN COMPLETA
Namespace en i18n: recovery.deletedFiles
Estructura requerida para traducciones:


{  "recovery": {    "deletedFiles": {      "seo": { "title": "...", "description": "...", "keywords": "..." },      "wizard": {        "title": "Recuperación de Archivos Eliminados",        "subtitle": "Te guiamos paso a paso...",        "steps": { "diagnosis": "...", "analysis": "...", "recovery": "..." }      },      "fileTypes": {        "bitcoinCore": "Bitcoin Core (.dat)",        "ethereumKeystore": "Ethereum Keystore (.json)",        // ... más tipos      },      "timeline": {        "under24h": "Menos de 24 horas",        "under7days": "Menos de 7 días",        // ... más opciones      },      "results": {        "probability": "Probabilidad de recuperación: {percentage}%",        "recommendedTools": "Herramientas recomendadas",        "instructions": "Instrucciones paso a paso"      },      "tools": {        "free": "Gratuita",        "paid": "De pago",         "professional": "Servicio profesional"      }    }  }}
⚙️ 7. LÓGICA DE NEGOCIO CENTRAL
Algoritmo de Análisis de Recuperabilidad:
Variables de entrada:

Tipo de archivo de wallet
Sistema operativo
Tiempo transcurrido desde eliminación
Tipo de almacenamiento (SSD vs HDD)
Actividad del disco posterior
Cálculo de probabilidad:


// Pseudocódigo de la lógicafunction calculateRecoveryProbability(inputs: DiagnosisInputs): number {  let baseProbability = getBaseProbabilityByFileType(inputs.fileType);    // Reducir por tiempo transcurrido  baseProbability *= getTimeDecayFactor(inputs.timeElapsed);    // Ajustar por tipo de disco  baseProbability *= getStorageTypeFactor(inputs.storageType);    // Ajustar por actividad posterior  baseProbability *= getActivityFactor(inputs.diskActivity);    return Math.min(Math.max(baseProbability, 5), 95); // Entre 5% y 95%}
Sistema de Recomendaciones:
Herramientas por OS: Recuva (Windows), Disk Drill (Mac), PhotoRec (Linux)
Escalación por complejidad: Gratuitas → Comerciales → Profesionales
Filtrado por éxito: Solo mostrar herramientas con >70% éxito para el escenario
Personalización premium: Análisis más profundo, herramientas especializadas
🔒 8. CONSIDERACIONES DE SEGURIDAD Y PRIVACIDAD
Datos Sensibles:
NO almacenar rutas de archivos reales del usuario
NO solicitar información sobre montos o valores
Anonimización de datos de uso para estadísticas
Encriptación de casos de usuario en Firestore
Disclaimers Legales:
Sin garantías de recuperación exitosa
Responsabilidad del usuario en uso de herramientas
Enlaces externos: Descargo sobre herramientas de terceros
Privacidad: Claridad sobre datos recopilados
📊 9. MÉTRICAS Y ANALYTICS
KPIs a Trackear:
Tasa de conversión: Diagnóstico → Herramienta usada
Probabilidades vs resultados reales (feedback usuario)
Herramientas más exitosas por escenario
Escalación a servicios profesionales
Satisfacción del usuario post-recuperación
Integración con Sistema Existente:
trackUsage: Eventos de uso de herramienta
Google Analytics: Funnel de conversión
Feedback sistema: Recopilación de resultados
A/B testing: Optimización de flujos
🎯 RESULTADO FINAL
La herramienta completa sería:

Totalmente integrada con la arquitectura existente
Completamente bilingüe (ES/EN)
Robusta para producción con manejo de errores
Escalable desde usuarios gratuitos hasta premium
Conectada con el ecosistema de servicios
Medible con analytics completos
Segura con manejo apropiado de datos sensibles
Diferenciada de la competencia por valor/precio
Esta implementación seguiría exactamente los patrones establecidos en el proyecto, mantendría la centralización absoluta y proporcionaría valor real masivo a usuarios en situaciones críticas de pérdida de archivos de wallet.