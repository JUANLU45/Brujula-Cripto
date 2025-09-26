// index.ts - Entry point para Cloud Functions
// Fuente: PROYEC_PARTE1.MD líneas 194-218 y PROYEC_PARTE3.MD

// Importar handlers admin
export { setAdminRole } from './admin/setAdminRole';

// Importar handlers de artículos
export {
  createArticle,
  deleteArticle,
  listArticles,
  publishArticle,
  updateArticle,
} from './admin/articleHandlers';

// Importar handlers de contenido del sitio
export {
  getHomepageContent,
  resetHomepageContent,
  updateHomepageContent,
} from './admin/siteContentHandlers';

// ✅ COMPLETADO - serviceDirectoryHandlers.ts
export {
  createService,
  deleteService,
  getService,
  listServices,
  updateService,
} from './admin/serviceDirectoryHandlers';

// ✅ COMPLETADO - adminPriceHandlers.ts
export {
  calculateCost,
  getPricingConfig,
  resetPricingToDefault,
  updatePricingConfig,
} from './admin/adminPriceHandlers';

// ✅ COMPLETADO - payments handlers
export { createCheckout } from './payments/createCheckout';
export { createStripePortalSession } from './payments/createStripePortalSession';
export { stripeWebhooks } from './payments/stripeWebhooks';

// ✅ COMPLETADO - lib handlers
export { getUserCredits, trackUsage } from './lib/trackUsage';

// ✅ COMPLETADO - public handlers
export { handleContactForm } from './public/handleContactForm';

// ✅ COMPLETADO - recovery handlers
export { analyzeFileRecovery } from './recovery/analyzeFileRecovery';

// NOTA: Los siguientes archivos fueron implementados por el usuario
// pero necesitan verificación de exportaciones antes de incluir:
