'use strict';
/**
 * Módulo para get/set en Redis (Upstash/Memorystore) para respuestas frecuentes
 * TTL: 5 minutos para APIs externas
 * Sin alterar flujos existentes
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.get = get;
exports.set = set;
exports.del = del;
exports.exists = exists;
const redis_1 = require('@upstash/redis');
// Configuración Redis (Upstash)
const redis = new redis_1.Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
// TTL por defecto: 5 minutos (300 segundos)
const DEFAULT_TTL = 300;
/**
 * Obtener valor desde caché
 */
async function get(key) {
  try {
    const value = await redis.get(key);
    return value;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}
/**
 * Establecer valor en caché con TTL de 5 minutos
 */
async function set(key, value, ttl = DEFAULT_TTL) {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
}
/**
 * Eliminar valor del caché
 */
async function del(key) {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Cache del error:', error);
    return false;
  }
}
/**
 * Verificar si existe una clave en caché
 */
async function exists(key) {
  try {
    const result = await redis.exists(key);
    return result === 1;
  } catch (error) {
    console.error('Cache exists error:', error);
    return false;
  }
}
//# sourceMappingURL=cache.js.map
