import type { IDatabaseAdapter, DatabaseConfig } from '@brujula-cripto/types';
import { FirestoreAdapter } from './adapters/FirestoreAdapter';

/**
 * FACTORY DE BASE DE DATOS - PATRÓN SINGLETON
 * Punto único de acceso a la base de datos en todo el backend
 * 
 * IMPORTANTE: Este es el único archivo que las Cloud Functions importan
 * Siguiendo principios de PROYEC_PARTE1.MD - Centralización Absoluta
 */
class DatabaseFactory {
  private static instance: DatabaseFactory;
  private adapter: IDatabaseAdapter | null = null;
  private config: DatabaseConfig;

  private constructor() {
    // Configuración por defecto - Firestore
    this.config = {
      provider: 'firestore',
      projectId: process.env.GOOGLE_CLOUD_PROJECT || undefined,
    };
  }

  /**
   * SINGLETON - UNA SOLA INSTANCIA
   */
  public static getInstance(): DatabaseFactory {
    if (!DatabaseFactory.instance) {
      DatabaseFactory.instance = new DatabaseFactory();
    }
    return DatabaseFactory.instance;
  }

  /**
   * OBTENER ADAPTADOR ACTIVO
   */
  public getAdapter(): IDatabaseAdapter {
    if (!this.adapter) {
      this.adapter = this.createAdapter();
    }
    return this.adapter;
  }

  /**
   * CAMBIAR CONFIGURACIÓN (PARA FUTURAS MIGRACIONES)
   */
  public configure(config: DatabaseConfig): void {
    this.config = config;
    this.adapter = null; // Forzar recreación
  }

  /**
   * FACTORY METHOD - CREAR ADAPTADOR SEGÚN CONFIGURACIÓN
   */
  private createAdapter(): IDatabaseAdapter {
    switch (this.config.provider) {
      case 'firestore':
        return new FirestoreAdapter();
      
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
export const database = DatabaseFactory.getInstance().getAdapter();

/**
 * FUNCIÓN DE CONFIGURACIÓN (PARA TESTING O MIGRACIONES FUTURAS)
 */
export const configureDatabase = (config: DatabaseConfig): void => {
  DatabaseFactory.getInstance().configure(config);
};