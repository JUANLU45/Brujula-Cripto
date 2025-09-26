"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreAdapter = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
/**
 * ADAPTADOR FIRESTORE - IMPLEMENTACIÓN ESPECÍFICA
 * Encapsula todas las llamadas directas a Firebase/Firestore
 *
 * IMPORTANTE: Este es el ÚNICO archivo que conoce Firebase/Firestore
 * Todo el resto del código usa las abstracciones genéricas
 */
class FirestoreAdapter {
    constructor() {
        // Inicializar Firebase Admin si no está ya inicializado
        if ((0, app_1.getApps)().length === 0) {
            (0, app_1.initializeApp)();
        }
        this.db = (0, firestore_1.getFirestore)();
    }
    /**
     * OBTENER DOCUMENTO INDIVIDUAL
     */
    async getDocument(collection, documentId) {
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
        }
        catch (error) {
            console.error(`Error getting document ${collection}/${documentId}:`, error);
            throw error;
        }
    }
    /**
     * CREAR/SOBRESCRIBIR DOCUMENTO
     */
    async setDocument(collection, documentId, data) {
        try {
            const docRef = this.db.collection(collection).doc(documentId);
            await docRef.set(data);
        }
        catch (error) {
            console.error(`Error setting document ${collection}/${documentId}:`, error);
            throw error;
        }
    }
    /**
     * ACTUALIZAR DOCUMENTO EXISTENTE
     */
    async updateDocument(collection, documentId, data) {
        try {
            const docRef = this.db.collection(collection).doc(documentId);
            await docRef.update(data);
        }
        catch (error) {
            console.error(`Error updating document ${collection}/${documentId}:`, error);
            throw error;
        }
    }
    /**
     * ELIMINAR DOCUMENTO
     */
    async deleteDocument(collection, documentId) {
        try {
            const docRef = this.db.collection(collection).doc(documentId);
            await docRef.delete();
        }
        catch (error) {
            console.error(`Error deleting document ${collection}/${documentId}:`, error);
            throw error;
        }
    }
    /**
     * AÑADIR DOCUMENTO CON ID AUTOGENERADO
     */
    async addDocument(collection, data) {
        try {
            const collectionRef = this.db.collection(collection);
            const docRef = await collectionRef.add(data);
            return docRef.id;
        }
        catch (error) {
            console.error(`Error adding document to ${collection}:`, error);
            throw error;
        }
    }
    /**
     * CONSULTAR COLECCIÓN CON FILTROS
     */
    async queryCollection(collection, filters = [], options = {}) {
        try {
            let query = this.db.collection(collection);
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
        }
        catch (error) {
            console.error(`Error querying collection ${collection}:`, error);
            throw error;
        }
    }
    /**
     * OBTENER SUBDOCUMENTO
     */
    async getSubDocument(collection, documentId, subCollection, subDocumentId) {
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
        }
        catch (error) {
            console.error(`Error getting subdocument ${collection}/${documentId}/${subCollection}/${subDocumentId}:`, error);
            throw error;
        }
    }
    /**
     * CREAR SUBDOCUMENTO
     */
    async setSubDocument(collection, documentId, subCollection, subDocumentId, data) {
        try {
            const docRef = this.db
                .collection(collection)
                .doc(documentId)
                .collection(subCollection)
                .doc(subDocumentId);
            await docRef.set(data);
        }
        catch (error) {
            console.error(`Error setting subdocument ${collection}/${documentId}/${subCollection}/${subDocumentId}:`, error);
            throw error;
        }
    }
    /**
     * AÑADIR SUBDOCUMENTO CON ID AUTOGENERADO
     */
    async addSubDocument(collection, documentId, subCollection, data) {
        try {
            const collectionRef = this.db
                .collection(collection)
                .doc(documentId)
                .collection(subCollection);
            const docRef = await collectionRef.add(data);
            return docRef.id;
        }
        catch (error) {
            console.error(`Error adding subdocument to ${collection}/${documentId}/${subCollection}:`, error);
            throw error;
        }
    }
    /**
     * OPERACIONES ESPECIALES DE FIRESTORE
     */
    serverTimestamp() {
        return firestore_1.FieldValue.serverTimestamp();
    }
    incrementValue(amount) {
        return firestore_1.FieldValue.increment(amount);
    }
    arrayUnion(elements) {
        return firestore_1.FieldValue.arrayUnion(...elements);
    }
    arrayRemove(elements) {
        return firestore_1.FieldValue.arrayRemove(...elements);
    }
    /**
     * CONVERTIR OPERADORES GENÉRICOS A FIRESTORE
     */
    convertOperator(operator) {
        const operatorMap = {
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
exports.FirestoreAdapter = FirestoreAdapter;
//# sourceMappingURL=FirestoreAdapter.js.map