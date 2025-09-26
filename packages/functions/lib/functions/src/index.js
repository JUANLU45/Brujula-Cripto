"use strict";
// index.ts - Entry point para Cloud Functions
// Fuente: PROYEC_PARTE1.MD líneas 194-218 y PROYEC_PARTE3.MD
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeFileRecovery = exports.handleContactForm = exports.trackUsage = exports.getUserCredits = exports.stripeWebhooks = exports.createStripePortalSession = exports.createCheckout = exports.updatePricingConfig = exports.resetPricingToDefault = exports.getPricingConfig = exports.calculateCost = exports.updateService = exports.listServices = exports.getService = exports.deleteService = exports.createService = exports.updateHomepageContent = exports.resetHomepageContent = exports.getHomepageContent = exports.updateArticle = exports.publishArticle = exports.listArticles = exports.deleteArticle = exports.createArticle = exports.setAdminRole = void 0;
// Importar handlers admin
var setAdminRole_1 = require("./admin/setAdminRole");
Object.defineProperty(exports, "setAdminRole", { enumerable: true, get: function () { return setAdminRole_1.setAdminRole; } });
// Importar handlers de artículos
var articleHandlers_1 = require("./admin/articleHandlers");
Object.defineProperty(exports, "createArticle", { enumerable: true, get: function () { return articleHandlers_1.createArticle; } });
Object.defineProperty(exports, "deleteArticle", { enumerable: true, get: function () { return articleHandlers_1.deleteArticle; } });
Object.defineProperty(exports, "listArticles", { enumerable: true, get: function () { return articleHandlers_1.listArticles; } });
Object.defineProperty(exports, "publishArticle", { enumerable: true, get: function () { return articleHandlers_1.publishArticle; } });
Object.defineProperty(exports, "updateArticle", { enumerable: true, get: function () { return articleHandlers_1.updateArticle; } });
// Importar handlers de contenido del sitio
var siteContentHandlers_1 = require("./admin/siteContentHandlers");
Object.defineProperty(exports, "getHomepageContent", { enumerable: true, get: function () { return siteContentHandlers_1.getHomepageContent; } });
Object.defineProperty(exports, "resetHomepageContent", { enumerable: true, get: function () { return siteContentHandlers_1.resetHomepageContent; } });
Object.defineProperty(exports, "updateHomepageContent", { enumerable: true, get: function () { return siteContentHandlers_1.updateHomepageContent; } });
// ✅ COMPLETADO - serviceDirectoryHandlers.ts
var serviceDirectoryHandlers_1 = require("./admin/serviceDirectoryHandlers");
Object.defineProperty(exports, "createService", { enumerable: true, get: function () { return serviceDirectoryHandlers_1.createService; } });
Object.defineProperty(exports, "deleteService", { enumerable: true, get: function () { return serviceDirectoryHandlers_1.deleteService; } });
Object.defineProperty(exports, "getService", { enumerable: true, get: function () { return serviceDirectoryHandlers_1.getService; } });
Object.defineProperty(exports, "listServices", { enumerable: true, get: function () { return serviceDirectoryHandlers_1.listServices; } });
Object.defineProperty(exports, "updateService", { enumerable: true, get: function () { return serviceDirectoryHandlers_1.updateService; } });
// ✅ COMPLETADO - adminPriceHandlers.ts
var adminPriceHandlers_1 = require("./admin/adminPriceHandlers");
Object.defineProperty(exports, "calculateCost", { enumerable: true, get: function () { return adminPriceHandlers_1.calculateCost; } });
Object.defineProperty(exports, "getPricingConfig", { enumerable: true, get: function () { return adminPriceHandlers_1.getPricingConfig; } });
Object.defineProperty(exports, "resetPricingToDefault", { enumerable: true, get: function () { return adminPriceHandlers_1.resetPricingToDefault; } });
Object.defineProperty(exports, "updatePricingConfig", { enumerable: true, get: function () { return adminPriceHandlers_1.updatePricingConfig; } });
// ✅ COMPLETADO - payments handlers
var createCheckout_1 = require("./payments/createCheckout");
Object.defineProperty(exports, "createCheckout", { enumerable: true, get: function () { return createCheckout_1.createCheckout; } });
var createStripePortalSession_1 = require("./payments/createStripePortalSession");
Object.defineProperty(exports, "createStripePortalSession", { enumerable: true, get: function () { return createStripePortalSession_1.createStripePortalSession; } });
var stripeWebhooks_1 = require("./payments/stripeWebhooks");
Object.defineProperty(exports, "stripeWebhooks", { enumerable: true, get: function () { return stripeWebhooks_1.stripeWebhooks; } });
// ✅ COMPLETADO - lib handlers
var trackUsage_1 = require("./lib/trackUsage");
Object.defineProperty(exports, "getUserCredits", { enumerable: true, get: function () { return trackUsage_1.getUserCredits; } });
Object.defineProperty(exports, "trackUsage", { enumerable: true, get: function () { return trackUsage_1.trackUsage; } });
// ✅ COMPLETADO - public handlers
var handleContactForm_1 = require("./public/handleContactForm");
Object.defineProperty(exports, "handleContactForm", { enumerable: true, get: function () { return handleContactForm_1.handleContactForm; } });
// ✅ COMPLETADO - recovery handlers
var analyzeFileRecovery_1 = require("./recovery/analyzeFileRecovery");
Object.defineProperty(exports, "analyzeFileRecovery", { enumerable: true, get: function () { return analyzeFileRecovery_1.analyzeFileRecovery; } });
// NOTA: Los siguientes archivos fueron implementados por el usuario
// pero necesitan verificación de exportaciones antes de incluir:
//# sourceMappingURL=index.js.map