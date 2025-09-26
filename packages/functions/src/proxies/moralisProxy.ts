/**
 * Proxy para API Moralis con caché Redis (TTL 5min) via cache.ts
 * Implementa patrón cache-aside según PROYEC_PARTE1.MD línea 239    console.log(`Cache miss for wallet transactions: ${address}, calling Moralis API`);
    
    const apiKey = moralisApiKey.value();NDAMIENTO #2: CÓDIGO PRODUCTIVO - Sin placeholders, todo funcional
 */

import { defineSecret } from 'firebase-functions/params';
import { get, set } from '../lib/cache';

// Definir secret para Moralis API
const moralisApiKey = defineSecret('MORALIS_API_KEY');

interface MoralisWalletResponse {
  token_address: string;
  name: string;
  symbol: string;
  logo?: string;
  thumbnail?: string;
  decimals: number;
  balance: string;
  possible_spam: boolean;
  verified_contract: boolean;
  total_supply?: string;
  total_supply_formatted?: string;
}

interface MoralisTransactionResponse {
  hash: string;
  nonce: string;
  transaction_index: string;
  from_address: string;
  to_address: string;
  value: string;
  gas: string;
  gas_price: string;
  input: string;
  receipt_cumulative_gas_used: string;
  receipt_gas_used: string;
  receipt_contract_address?: string;
  receipt_root?: string;
  receipt_status: string;
  block_timestamp: string;
  block_number: string;
  block_hash: string;
}

interface MoralisNFTResponse {
  token_address: string;
  token_id: string;
  contract_type: string;
  owner_of: string;
  block_number: string;
  block_number_minted: string;
  token_uri?: string;
  metadata?: string;
  normalized_metadata?: {
    name?: string;
    description?: string;
    image?: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
  amount: string;
  name: string;
  symbol: string;
  token_hash: string;
  last_token_uri_sync: string;
  last_metadata_sync: string;
  minter_address?: string;
}

/**
 * Obtener tokens ERC20 de wallet desde Moralis API con caché
 */
export async function getWalletTokens(address: string, chain: string = 'eth'): Promise<MoralisWalletResponse[] | null> {
  const cacheKey = `moralis:tokens:${address}:${chain}`;
  
  try {
    // 1. Cache hit: verificar caché primero
    const cachedData = await get<MoralisWalletResponse[]>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for Moralis wallet tokens: ${address}`);
      return cachedData;
    }

    // 2. Cache miss: llamar a API Moralis
    console.log(`Cache miss for Moralis wallet tokens: ${address}, calling API`);
    
    const apiKey = moralisApiKey.value();

    const response = await fetch(
      `https://deep-index.moralis.io/api/v2.2/${address}/erc20?chain=${chain}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-Key': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Moralis API error: ${response.status} ${response.statusText}`);
    }

    const tokensData = await response.json() as MoralisWalletResponse[];

    // 3. Guardar en caché con TTL 5min (300s)
    await set(cacheKey, tokensData, 300);
    console.log(`Cached Moralis wallet tokens for: ${address}`);

    return tokensData;

  } catch (error) {
    console.error('Error en getWalletTokens:', error);
    return null;
  }
}

/**
 * Obtener transacciones de wallet desde Moralis API con caché
 */
export async function getWalletTransactions(address: string, chain: string = 'eth'): Promise<MoralisTransactionResponse[] | null> {
  const cacheKey = `moralis:transactions:${address}:${chain}`;
  
  try {
    // Patrón cache-aside
    const cachedData = await get<MoralisTransactionResponse[]>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for Moralis transactions: ${address}`);
      return cachedData;
    }

    console.log(`Cache miss for Moralis transactions: ${address}, calling API`);
    
    const apiKey = moralisApiKey.value();

    const response = await fetch(
      `https://deep-index.moralis.io/api/v2.2/${address}?chain=${chain}&limit=50`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-Key': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Moralis API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as { result: MoralisTransactionResponse[] };
    const transactionsData = data.result;

    await set(cacheKey, transactionsData, 300);
    console.log(`Cached Moralis transactions for: ${address}`);

    return transactionsData;

  } catch (error) {
    console.error('Error en getWalletTransactions:', error);
    return null;
  }
}

/**
 * Obtener NFTs de wallet desde Moralis API con caché
 */
export async function getWalletNFTs(address: string, chain: string = 'eth'): Promise<MoralisNFTResponse[] | null> {
  const cacheKey = `moralis:nfts:${address}:${chain}`;
  
  try {
    // Patrón cache-aside
    const cachedData = await get<MoralisNFTResponse[]>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for Moralis NFTs: ${address}`);
      return cachedData;
    }

    console.log(`Cache miss for Moralis NFTs: ${address}, calling API`);
    
    const apiKey = moralisApiKey.value();

    const response = await fetch(
      `https://deep-index.moralis.io/api/v2.2/${address}/nft?chain=${chain}&format=decimal&limit=100`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-Key': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Moralis API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as { result: MoralisNFTResponse[] };
    const nftsData = data.result;

    await set(cacheKey, nftsData, 300);
    console.log(`Cached Moralis NFTs for: ${address}`);

    return nftsData;

  } catch (error) {
    console.error('Error en getWalletNFTs:', error);
    return null;
  }
}

/**
 * Obtener detalles de transacción específica desde Moralis con caché
 */
export async function getTransactionDetails(txHash: string, chain: string = 'eth'): Promise<MoralisTransactionResponse | null> {
  const cacheKey = `moralis:transaction:${txHash}:${chain}`;
  
  try {
    // Cache-aside pattern
    const cachedData = await get<MoralisTransactionResponse>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for Moralis transaction: ${txHash}`);
      return cachedData;
    }

    console.log(`Cache miss for Moralis transaction: ${txHash}, calling API`);
    
    const apiKey = moralisApiKey.value();

    const response = await fetch(
      `https://deep-index.moralis.io/api/v2.2/transaction/${txHash}?chain=${chain}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-Key': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Moralis API error: ${response.status} ${response.statusText}`);
    }

    const transactionData = await response.json() as MoralisTransactionResponse;

    await set(cacheKey, transactionData, 300);
    console.log(`Cached Moralis transaction details for: ${txHash}`);

    return transactionData;

  } catch (error) {
    console.error('Error en getTransactionDetails:', error);
    return null;
  }
}
