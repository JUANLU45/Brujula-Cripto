/**
 * ABSTRACCIONES DE BASE DE DATOS - VENDOR AGNOSTIC
 * Siguiendo principios de PROYEC_PARTE1.MD - Centralización Absoluta
 * 
 * Estas interfaces permiten intercambiar proveedores de base de datos
 * sin modificar la lógica de negocio del proyecto.
 */

export interface QueryFilter {
  field: string;
  operator: 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte' | 'in' | 'array-contains';
  value: any;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export interface DatabaseDocument {
  id: string;
  data: Record<string, any>;
  exists: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface DatabaseCollection {
  id: string;
  path: string;
}

/**
 * INTERFAZ PRINCIPAL - ADAPTADOR DE BASE DE DATOS
 * Abstrae operaciones CRUD de cualquier proveedor de base de datos
 */
export interface IDatabaseAdapter {
  // Operaciones de documento individual
  getDocument(collection: string, documentId: string): Promise<DatabaseDocument | null>;
  setDocument(collection: string, documentId: string, data: Record<string, any>): Promise<void>;
  updateDocument(collection: string, documentId: string, data: Record<string, any>): Promise<void>;
  deleteDocument(collection: string, documentId: string): Promise<void>;
  
  // Operaciones de colección
  addDocument(collection: string, data: Record<string, any>): Promise<string>; // retorna ID generado
  queryCollection(collection: string, filters?: QueryFilter[], options?: QueryOptions): Promise<DatabaseDocument[]>;
  
  // Operaciones de subcolección
  getSubDocument(collection: string, documentId: string, subCollection: string, subDocumentId: string): Promise<DatabaseDocument | null>;
  setSubDocument(collection: string, documentId: string, subCollection: string, subDocumentId: string, data: Record<string, any>): Promise<void>;
  addSubDocument(collection: string, documentId: string, subCollection: string, data: Record<string, any>): Promise<string>;
  
  // Operaciones especiales
  serverTimestamp(): any;
  incrementValue(amount: number): any;
  arrayUnion(elements: any[]): any;
  arrayRemove(elements: any[]): any;
}

/**
 * FACTORY PATTERN - INSTANCIACIÓN DE ADAPTADORES
 */
export interface IDatabaseFactory {
  createAdapter(): IDatabaseAdapter;
}

/**
 * CONFIGURACIÓN DE BASE DE DATOS
 */
export interface DatabaseConfig {
  provider: 'firestore' | 'dynamodb' | 'mongodb' | 'postgresql';
  connectionString?: string;
  projectId?: string;
  region?: string;
  credentials?: Record<string, any>;
}