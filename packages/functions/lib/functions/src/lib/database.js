"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureDatabase = exports.database = void 0;
const FirestoreAdapter_1 = require("./adapters/FirestoreAdapter");
/**
 * FACTORY DE BASE DE DATOS - PATRÓN SINGLETON
 * Punto único de acceso a la base de datos en todo el backend
 *
 * IMPORTANTE: Este es el único archivo que las Cloud Functions importan
 * Siguiendo principios de PROYEC_PARTE1.MD - Centralización Absoluta
 */
class DatabaseFactory {
    constructor() {
        this.adapter = null;
        // Configuración por defecto - Firestore
        this.config = {
            provider: 'firestore',
            projectId: process.env.GOOGLE_CLOUD_PROJECT || undefined,
        };
    }
    /**
     * SINGLETON - UNA SOLA INSTANCIA
     */
    static getInstance() {
        if (!DatabaseFactory.instance) {
            DatabaseFactory.instance = new DatabaseFactory();
        }
        return DatabaseFactory.instance;
    }
    /**
     * OBTENER ADAPTADOR ACTIVO
     */
    getAdapter() {
        if (!this.adapter) {
            this.adapter = this.createAdapter();
        }
        return this.adapter;
    }
    /**
     * CAMBIAR CONFIGURACIÓN (PARA FUTURAS MIGRACIONES)
     */
    configure(config) {
        this.config = config;
        this.adapter = null; // Forzar recreación
    }
    /**
     * FACTORY METHOD - CREAR ADAPTADOR SEGÚN CONFIGURACIÓN
     */
    createAdapter() {
        switch (this.config.provider) {
            case 'firestore':
                return new FirestoreAdapter_1.FirestoreAdapter();
            // PREPARADO PARA FUTURAS IMPLEMENTACIONES:
            // case 'dynamodb':
            //   return new DynamoDBAdapter(this.config);
            // case 'mongodb':
            //   return new MongoDBAdapter(this.config);
            default:
                throw new Error(`Unsupported database provider: ${this.config.provider}`);
        }
    }
}
/**
 * EXPORTACIÓN PRINCIPAL - INSTANCIA SINGLETON
 * Todas las Cloud Functions importan esta variable
 */
exports.database = DatabaseFactory.getInstance().getAdapter();
/**
 * FUNCIÓN DE CONFIGURACIÓN (PARA TESTING O MIGRACIONES FUTURAS)
 */
const configureDatabase = (config) => {
    DatabaseFactory.getInstance().configure(config);
};
exports.configureDatabase = configureDatabase;
//# sourceMappingURL=database.js.map