import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import type { 
  IDatabaseAdapter, 
  QueryFilter, 
  QueryOptions, 
  DatabaseDocument 
} from '@brujula-cripto/types';

/**
 * ADAPTADOR FIRESTORE - IMPLEMENTACIÓN ESPECÍFICA
 * Encapsula todas las llamadas directas a Firebase/Firestore
 * 
 * IMPORTANTE: Este es el ÚNICO archivo que conoce Firebase/Firestore
 * Todo el resto del código usa las abstracciones genéricas
 */
export class FirestoreAdapter implements IDatabaseAdapter {
  private db: FirebaseFirestore.Firestore;

  constructor() {
    // Inicializar Firebase Admin si no está ya inicializado
    if (getApps().length === 0) {
      initializeApp();
    }
    this.db = getFirestore();
  }

  /**
   * OBTENER DOCUMENTO INDIVIDUAL
   */
  async getDocument(collection: string, documentId: string): Promise<DatabaseDocument | null> {
    try {
      const docRef = this.db.collection(collection).doc(documentId);
      const docSnap = await docRef.get();
      
      if (!docSnap.exists) {
        return null;
      }
      
      return {
        id: docSnap.id,
        data: docSnap.data() || {},
        exists: true,
        createdAt: docSnap.createTime,
        updatedAt: docSnap.updateTime,
      };
    } catch (error) {
      console.error(`Error getting document ${collection}/${documentId}:`, error);
      throw error;
    }
  }

  /**
   * CREAR/SOBRESCRIBIR DOCUMENTO
   */
  async setDocument(collection: string, documentId: string, data: Record<string, any>): Promise<void> {
    try {
      const docRef = this.db.collection(collection).doc(documentId);
      await docRef.set(data);
    } catch (error) {
      console.error(`Error setting document ${collection}/${documentId}:`, error);
      throw error;
    }
  }

  /**
   * ACTUALIZAR DOCUMENTO EXISTENTE
   */
  async updateDocument(collection: string, documentId: string, data: Record<string, any>): Promise<void> {
    try {
      const docRef = this.db.collection(collection).doc(documentId);
      await docRef.update(data);
    } catch (error) {
      console.error(`Error updating document ${collection}/${documentId}:`, error);
      throw error;
    }
  }

  /**
   * ELIMINAR DOCUMENTO
   */
  async deleteDocument(collection: string, documentId: string): Promise<void> {
    try {
      const docRef = this.db.collection(collection).doc(documentId);
      await docRef.delete();
    } catch (error) {
      console.error(`Error deleting document ${collection}/${documentId}:`, error);
      throw error;
    }
  }

  /**
   * AÑADIR DOCUMENTO CON ID AUTOGENERADO
   */
  async addDocument(collection: string, data: Record<string, any>): Promise<string> {
    try {
      const collectionRef = this.db.collection(collection);
      const docRef = await collectionRef.add(data);
      return docRef.id;
    } catch (error) {
      console.error(`Error adding document to ${collection}:`, error);
      throw error;
    }
  }

  /**
   * CONSULTAR COLECCIÓN CON FILTROS
   */
  async queryCollection(
    collection: string, 
    filters: QueryFilter[] = [], 
    options: QueryOptions = {}
  ): Promise<DatabaseDocument[]> {
    try {
      let query: FirebaseFirestore.Query = this.db.collection(collection);

      // Aplicar filtros
      for (const filter of filters) {
        query = query.where(filter.field, this.convertOperator(filter.operator), filter.value);
      }

      // Aplicar ordenamiento
      if (options.orderBy) {
        query = query.orderBy(options.orderBy.field, options.orderBy.direction);
      }

      // Aplicar límite
      if (options.limit) {
        query = query.limit(options.limit);
      }

      // Aplicar offset
      if (options.offset) {
        query = query.offset(options.offset);
      }

      const querySnapshot = await query.get();
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
        exists: true,
        createdAt: doc.createTime,
        updatedAt: doc.updateTime,
      }));
    } catch (error) {
      console.error(`Error querying collection ${collection}:`, error);
      throw error;
    }
  }

  /**
   * OBTENER SUBDOCUMENTO
   */
  async getSubDocument(
    collection: string, 
    documentId: string, 
    subCollection: string, 
    subDocumentId: string
  ): Promise<DatabaseDocument | null> {
    try {
      const docRef = this.db
        .collection(collection)
        .doc(documentId)
        .collection(subCollection)
        .doc(subDocumentId);
      
      const docSnap = await docRef.get();
      
      if (!docSnap.exists) {
        return null;
      }
      
      return {
        id: docSnap.id,
        data: docSnap.data() || {},
        exists: true,
        createdAt: docSnap.createTime,
        updatedAt: docSnap.updateTime,
      };
    } catch (error) {
      console.error(`Error getting subdocument ${collection}/${documentId}/${subCollection}/${subDocumentId}:`, error);
      throw error;
    }
  }

  /**
   * CREAR SUBDOCUMENTO
   */
  async setSubDocument(
    collection: string, 
    documentId: string, 
    subCollection: string, 
    subDocumentId: string, 
    data: Record<string, any>
  ): Promise<void> {
    try {
      const docRef = this.db
        .collection(collection)
        .doc(documentId)
        .collection(subCollection)
        .doc(subDocumentId);
      
      await docRef.set(data);
    } catch (error) {
      console.error(`Error setting subdocument ${collection}/${documentId}/${subCollection}/${subDocumentId}:`, error);
      throw error;
    }
  }

  /**
   * AÑADIR SUBDOCUMENTO CON ID AUTOGENERADO
   */
  async addSubDocument(
    collection: string, 
    documentId: string, 
    subCollection: string, 
    data: Record<string, any>
  ): Promise<string> {
    try {
      const collectionRef = this.db
        .collection(collection)
        .doc(documentId)
        .collection(subCollection);
      
      const docRef = await collectionRef.add(data);
      return docRef.id;
    } catch (error) {
      console.error(`Error adding subdocument to ${collection}/${documentId}/${subCollection}:`, error);
      throw error;
    }
  }

  /**
   * OPERACIONES ESPECIALES DE FIRESTORE
   */
  serverTimestamp(): any {
    return FieldValue.serverTimestamp();
  }

  incrementValue(amount: number): any {
    return FieldValue.increment(amount);
  }

  arrayUnion(elements: any[]): any {
    return FieldValue.arrayUnion(...elements);
  }

  arrayRemove(elements: any[]): any {
    return FieldValue.arrayRemove(...elements);
  }

  /**
   * CONVERTIR OPERADORES GENÉRICOS A FIRESTORE
   */
  private convertOperator(operator: string): FirebaseFirestore.WhereFilterOp {
    const operatorMap: Record<string, FirebaseFirestore.WhereFilterOp> = {
      'eq': '==',
      'neq': '!=',
      'lt': '<',
      'lte': '<=',
      'gt': '>',
      'gte': '>=',
      'in': 'in',
      'array-contains': 'array-contains',
    };
    
    return operatorMap[operator] || '==';
  }
}