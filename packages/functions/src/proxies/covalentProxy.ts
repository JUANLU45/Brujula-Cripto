/**
 * Proxy para API Covalent con caché Redis (TTL 5min) via cache.ts
 * Implementa patrón cache-aside según PROYEC_PARTE1.MD línea 239
 * MANDAMIENTO #2: CÓDIGO PRODUCTIVO - Sin placeholders, todo funcional
 */

import { defineSecret } from 'firebase-functions/params';
import { get, set } from '../lib/cache';

// Definir secret para Covalent API
const covalentApiKey = defineSecret('COVALENT_API_KEY');

interface CovalentWalletResponse {
  address: string;
  chain_id: number;
  items: Array<{
    contract_decimals: number;
    contract_name: string;
    contract_ticker_symbol: string;
    contract_address: string;
    balance: string;
    balance_24h: string;
    quote_rate: number;
    quote: number;
  }>;
}

interface CovalentTransactionResponse {
  transaction_hash: string;
  block_height: number;
  block_signed_at: string;
  successful: boolean;
  from_address: string;
  to_address: string;
  value: string;
  gas_offered: number;
  gas_spent: number;
  gas_price: number;
}

/**
 * Obtener análisis de wallet desde Covalent API con caché
 * Patrón cache-aside: verificar caché → API → guardar en caché
 */
export async function getWalletAnalysis(address: string, chainId: number): Promise<CovalentWalletResponse | null> {
  const cacheKey = `covalent:wallet:${address}:${chainId}`;
  
  try {
    // 1. Cache hit: intentar obtener desde caché
    const cachedData = await get<CovalentWalletResponse>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for wallet analysis: ${address}`);
      return cachedData;
    }

    // 2. Cache miss: llamar a API Covalent
    console.log(`Cache miss for wallet analysis: ${address}, calling Covalent API`);
    
    const apiKey = covalentApiKey.value();

    const response = await fetch(
      `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Covalent API error: ${response.status} ${response.statusText}`);
    }

    const apiData = await response.json() as { data: CovalentWalletResponse };
    const walletData = apiData.data;

    // 3. Guardar en caché con TTL 5min (300s)
    await set(cacheKey, walletData, 300);
    console.log(`Cached wallet analysis for: ${address}`);

    return walletData;

  } catch (error) {
    console.error('Error en getWalletAnalysis:', error);
    return null;
  }
}

/**
 * Obtener estado de transacción desde Covalent API con caché
 */
export async function getTransactionStatus(txHash: string, chainId: number): Promise<CovalentTransactionResponse | null> {
  const cacheKey = `covalent:transaction:${txHash}:${chainId}`;
  
  try {
    // 1. Cache hit: verificar caché primero
    const cachedData = await get<CovalentTransactionResponse>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for transaction: ${txHash}`);
      return cachedData;
    }

    // 2. Cache miss: llamar a API
    console.log(`Cache miss for transaction: ${txHash}, calling Covalent API`);
    
    const apiKey = covalentApiKey.value();

    const response = await fetch(
      `https://api.covalenthq.com/v1/${chainId}/transaction_v2/${txHash}/?key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Covalent API error: ${response.status} ${response.statusText}`);
    }

    const apiData = await response.json() as { data: { items: CovalentTransactionResponse[] } };
    const transactionData = apiData.data.items[0];

    // 3. Guardar en caché
    await set(cacheKey, transactionData, 300);
    console.log(`Cached transaction status for: ${txHash}`);

    return transactionData;

  } catch (error) {
    console.error('Error en getTransactionStatus:', error);
    return null;
  }
}

/**
 * Obtener balances de tokens específicos con caché
 */
export async function getTokenBalances(address: string, chainId: number): Promise<CovalentWalletResponse | null> {
  const cacheKey = `covalent:tokens:${address}:${chainId}`;
  
  try {
    // Patrón cache-aside
    const cachedData = await get<CovalentWalletResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const apiKey = covalentApiKey.value();

    const response = await fetch(
      `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?nft=false&key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Covalent API error: ${response.status}`);
    }

    const apiData = await response.json() as { data: CovalentWalletResponse };
    const tokenData = apiData.data;

    await set(cacheKey, tokenData, 300);
    
    return tokenData;

  } catch (error) {
    console.error('Error en getTokenBalances:', error);
    return null;
  }
}
