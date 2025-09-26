/**
 * Proxy para API GoPlus Security con caché Redis (TTL 5min) via cache.ts
 * Implementa patrón cache-aside según PROYEC_PARTE1.MD línea 239
 * MANDAMIENTO #2: CÓDIGO PRODUCTIVO - Sin placeholders, todo funcional
 */

import { get, set } from '../lib/cache';

interface GoPlusTokenSecurityResponse {
  code: number;
  message: string;
  result: {
    [address: string]: {
      anti_whale_modifiable?: string;
      buy_tax?: string;
      can_take_back_ownership?: string;
      cannot_buy?: string;
      cannot_sell_all?: string;
      creator_address?: string;
      creator_balance?: string;
      creator_percent?: string;
      external_call?: string;
      hidden_owner?: string;
      holder_count?: string;
      honeypot_with_same_creator?: string;
      is_anti_whale?: string;
      is_blacklisted?: string;
      is_honeypot?: string;
      is_mintable?: string;
      is_proxy?: string;
      is_whitelisted?: string;
      owner_address?: string;
      owner_balance?: string;
      owner_change_balance?: string;
      owner_percent?: string;
      personal_slippage_modifiable?: string;
      selfdestruct?: string;
      sell_tax?: string;
      slippage_modifiable?: string;
      token_name?: string;
      token_symbol?: string;
      total_supply?: string;
      trading_cooldown?: string;
      transfer_pausable?: string;
    };
  };
}

interface GoPlusContractSecurityResponse {
  code: number;
  message: string;
  result: {
    [address: string]: {
      is_open_source?: string;
      is_proxy?: string;
      is_mintable?: string;
      owner_address?: string;
      creator_address?: string;
      trust_list?: string;
    };
  };
}

interface GoPlusApprovalSecurityResponse {
  code: number;
  message: string;
  result: {
    [address: string]: Array<{
      contract_address: string;
      approved_spender: string;
      approved_amount: string;
      value?: string;
      is_approved_for_all?: boolean;
    }>;
  };
}

/**
 * Obtener análisis de seguridad de token desde GoPlus Security con caché
 */
export async function getTokenSecurity(tokenAddress: string, chainId: string = '1'): Promise<GoPlusTokenSecurityResponse | null> {
  const cacheKey = `goplus:token:${tokenAddress}:${chainId}`;
  
  try {
    // 1. Cache hit: verificar caché primero
    const cachedData = await get<GoPlusTokenSecurityResponse>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for GoPlus token security: ${tokenAddress}`);
      return cachedData;
    }

    // 2. Cache miss: llamar a GoPlus Security API
    console.log(`Cache miss for GoPlus token security: ${tokenAddress}, calling API`);
    
    const response = await fetch(
      `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${tokenAddress}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GoPlus API error: ${response.status} ${response.statusText}`);
    }

    const securityData = await response.json() as GoPlusTokenSecurityResponse;

    // 3. Guardar en caché con TTL 5min (300s)
    await set(cacheKey, securityData, 300);
    console.log(`Cached GoPlus token security for: ${tokenAddress}`);

    return securityData;

  } catch (error) {
    console.error('Error en getTokenSecurity:', error);
    return null;
  }
}

/**
 * Obtener análisis de seguridad de contrato desde GoPlus Security con caché
 */
export async function getContractSecurity(contractAddress: string, chainId: string = '1'): Promise<GoPlusContractSecurityResponse | null> {
  const cacheKey = `goplus:contract:${contractAddress}:${chainId}`;
  
  try {
    // Patrón cache-aside
    const cachedData = await get<GoPlusContractSecurityResponse>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for GoPlus contract security: ${contractAddress}`);
      return cachedData;
    }

    console.log(`Cache miss for GoPlus contract security: ${contractAddress}, calling API`);
    
    const response = await fetch(
      `https://api.gopluslabs.io/api/v1/contract_security/${chainId}?contract_addresses=${contractAddress}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GoPlus API error: ${response.status} ${response.statusText}`);
    }

    const securityData = await response.json() as GoPlusContractSecurityResponse;

    await set(cacheKey, securityData, 300);
    console.log(`Cached GoPlus contract security for: ${contractAddress}`);

    return securityData;

  } catch (error) {
    console.error('Error en getContractSecurity:', error);
    return null;
  }
}

/**
 * Obtener análisis de aprobaciones (approvals) desde GoPlus Security con caché
 */
export async function getApprovalSecurity(walletAddress: string, chainId: string = '1'): Promise<GoPlusApprovalSecurityResponse | null> {
  const cacheKey = `goplus:approvals:${walletAddress}:${chainId}`;
  
  try {
    // Patrón cache-aside
    const cachedData = await get<GoPlusApprovalSecurityResponse>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for GoPlus approval security: ${walletAddress}`);
      return cachedData;
    }

    console.log(`Cache miss for GoPlus approval security: ${walletAddress}, calling API`);
    
    const response = await fetch(
      `https://api.gopluslabs.io/api/v1/approval_security/${chainId}?addresses=${walletAddress}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GoPlus API error: ${response.status} ${response.statusText}`);
    }

    const approvalData = await response.json() as GoPlusApprovalSecurityResponse;

    await set(cacheKey, approvalData, 300);
    console.log(`Cached GoPlus approval security for: ${walletAddress}`);

    return approvalData;

  } catch (error) {
    console.error('Error en getApprovalSecurity:', error);
    return null;
  }
}

/**
 * Generar resumen de auditoría de contrato combinando múltiples checks
 */
export async function getContractAuditSummary(contractAddress: string, chainId: string = '1'): Promise<{ 
  isSecure: boolean; 
  risks: string[]; 
  recommendations: string[];
  details: any;
} | null> {
  const cacheKey = `goplus:audit:${contractAddress}:${chainId}`;
  
  try {
    // Cache-aside pattern
    const cachedData = await get<any>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for contract audit summary: ${contractAddress}`);
      return cachedData;
    }

    console.log(`Cache miss for contract audit summary: ${contractAddress}, generating summary`);

    // Obtener datos de seguridad del token y contrato
    const [tokenSecurity, contractSecurity] = await Promise.all([
      getTokenSecurity(contractAddress, chainId),
      getContractSecurity(contractAddress, chainId)
    ]);

    if (!tokenSecurity || !contractSecurity) {
      throw new Error('No se pudieron obtener datos de seguridad');
    }

    const tokenData = tokenSecurity.result[contractAddress];
    const contractData = contractSecurity.result[contractAddress];

    // Analizar riesgos
    const risks: string[] = [];
    const recommendations: string[] = [];

    if (tokenData?.is_honeypot === '1') {
      risks.push('ALTO: Posible honeypot detectado');
      recommendations.push('NO interactuar con este contrato');
    }

    if (tokenData?.is_mintable === '1') {
      risks.push('MEDIO: Token es minteable');
      recommendations.push('Verificar mecanismos de mint');
    }

    if (contractData?.is_proxy === '1') {
      risks.push('MEDIO: Contrato es proxy');
      recommendations.push('Verificar implementación del proxy');
    }

    if (tokenData?.buy_tax && parseFloat(tokenData.buy_tax) > 5) {
      risks.push(`MEDIO: Tax de compra alto: ${tokenData.buy_tax}%`);
      recommendations.push('Considerar el impacto del tax en las operaciones');
    }

    if (tokenData?.sell_tax && parseFloat(tokenData.sell_tax) > 5) {
      risks.push(`MEDIO: Tax de venta alto: ${tokenData.sell_tax}%`);
      recommendations.push('Considerar el impacto del tax en las operaciones');
    }

    if (contractData?.is_open_source === '0') {
      risks.push('ALTO: Contrato no es open source');
      recommendations.push('Extremar precauciones - código no verificado');
    }

    const auditSummary = {
      isSecure: risks.filter(r => r.includes('ALTO')).length === 0,
      risks,
      recommendations,
      details: {
        tokenSecurity: tokenData,
        contractSecurity: contractData,
        lastUpdated: new Date().toISOString()
      }
    };

    await set(cacheKey, auditSummary, 300);
    console.log(`Cached contract audit summary for: ${contractAddress}`);

    return auditSummary;

  } catch (error) {
    console.error('Error en getContractAuditSummary:', error);
    return null;
  }
}