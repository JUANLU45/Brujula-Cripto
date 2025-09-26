/**
 * Módulo para get/set en Redis (Upstash/Memorystore) para respuestas frecuentes
 * TTL: 5 minutos para APIs externas
 * Sin alterar flujos existentes
 */

import { defineSecret } from 'firebase-functions/params';
import { Redis } from '@upstash/redis';

// Definir secrets para Redis
const upstashRedisUrl = defineSecret('UPSTASH_REDIS_REST_URL');
const upstashRedisToken = defineSecret('UPSTASH_REDIS_REST_TOKEN');

// Exportar secrets para ser usados en declaraciones de funciones
export const redisSecrets = [upstashRedisUrl, upstashRedisToken];

// Función para obtener instancia Redis configurada con secrets
function getRedisInstance(): Redis {
  return new Redis({
    url: upstashRedisUrl.value(),
    token: upstashRedisToken.value(),
  });
}

// TTL por defecto: 5 minutos (300 segundos)
const DEFAULT_TTL = 300;

/**
 * Obtener valor desde caché
 */
export async function get<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedisInstance();
    const value = await redis.get(key);
    return value as T;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Establecer valor en caché con TTL de 5 minutos
 */
export async function set<T>(key: string, value: T, ttl: number = DEFAULT_TTL): Promise<boolean> {
  try {
    const redis = getRedisInstance();
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
export async function del(key: string): Promise<boolean> {
  try {
    const redis = getRedisInstance();
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
export async function exists(key: string): Promise<boolean> {
  try {
    const redis = getRedisInstance();
    const result = await redis.exists(key);
    return result === 1;
  } catch (error) {
    console.error('Cache exists error:', error);
    return false;
  }
}
