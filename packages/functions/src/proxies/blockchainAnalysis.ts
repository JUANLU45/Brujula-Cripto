/**
 * Funciones blockchain centralizadas usando proxies con caché
 * Implementa getWalletAnalysis, getTransactionStatus, getContractAuditSummary
 * Según PROYEC_PARTE1.MD línea 302 y PROYEC_PARTE7.MD línea 24-26
 * MANDAMIENTO #4: CENTRALIZACIÓN ABSOLUTA - Imports centralizados
 * 
 * NOTA: Estas son funciones UTILITY/TOOLS para Genkit chatbot, NO Cloud Functions
 */

import { getWalletAnalysis as covalentGetWallet, getTransactionStatus as covalentGetTransaction } from './covalentProxy';
import { getWalletTokens, getWalletNFTs, getTransactionDetails as moralisGetTransaction } from './moralisProxy';
import { getContractAuditSummary as goPlusGetAudit, getApprovalSecurity } from './goPlusProxy';

/**
 * Análisis completo de wallet combinando Covalent + Moralis + GoPlus
 * PROYEC_PARTE7.MD línea 24: "getWalletAnalysis(address, chain): Devuelve el balance, tokens, NFTs y un análisis de riesgos"
 */
export async function getWalletAnalysis(address: string, chain: string = 'eth'): Promise<{
  success: boolean;
  data?: {
    address: string;
    chain: string;
    balance: any;
    tokens: any[];
    nfts: any[];
    riskAnalysis: {
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
      risks: string[];
      recommendations: string[];
    };
    lastUpdated: string;
  };
  error?: string;
}> {
  try {
    console.log(`Starting wallet analysis for ${address} on chain ${chain}`);
    
    // Mapear chain names para diferentes APIs
    const chainId = getChainId(chain);
    const moralisChain = getMoralisChain(chain);
    
    // Obtener datos de múltiples fuentes en paralelo
    const [covalentData, moralisTokens, moralisNFTs] = await Promise.all([
      covalentGetWallet(address, chainId),
      getWalletTokens(address, moralisChain),
      getWalletNFTs(address, moralisChain)
    ]);

    // Analizar riesgos basado en tokens y aprobaciones
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    const risks: string[] = [];
    const recommendations: string[] = [];

    // Verificar aprobaciones peligrosas
    const approvalData = await getApprovalSecurity(address, chainId.toString());
    if (approvalData && approvalData.result[address]) {
      const approvals = approvalData.result[address];
      if (approvals.length > 10) {
        riskLevel = 'MEDIUM';
        risks.push('Múltiples aprobaciones activas detectadas');
        recommendations.push('Revisar y revocar aprobaciones innecesarias');
      }
    }

    // Verificar tokens de riesgo
    if (moralisTokens) {
      const suspiciousTokens = moralisTokens.filter(token => token.possible_spam || !token.verified_contract);
      if (suspiciousTokens.length > 0) {
        riskLevel = suspiciousTokens.length > 5 ? 'HIGH' : 'MEDIUM';
        risks.push(`${suspiciousTokens.length} tokens sospechosos detectados`);
        recommendations.push('Verificar tokens antes de interactuar');
      }
    }

    return {
      success: true,
      data: {
        address,
        chain,
        balance: covalentData,
        tokens: moralisTokens || [],
        nfts: moralisNFTs || [],
        riskAnalysis: {
          riskLevel,
          risks,
          recommendations
        },
        lastUpdated: new Date().toISOString()
      }
    };

  } catch (error) {
    console.error('Error en getWalletAnalysis:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido en análisis de wallet'
    };
  }
}

/**
 * Verificación de estado de transacción usando múltiples proveedores
 * PROYEC_PARTE7.MD línea 25: "getTransactionStatus(txHash, chain): Verifica el estado de una transacción"
 */
export async function getTransactionStatus(txHash: string, chain: string = 'eth'): Promise<{
  success: boolean;
  data?: {
    hash: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    blockNumber?: number;
    timestamp?: string;
    from?: string;
    to?: string;
    value?: string;
    gasUsed?: number;
    gasPrice?: number;
    confirmations?: number;
    details: any;
  };
  error?: string;
}> {
  try {
    console.log(`Checking transaction status for ${txHash} on chain ${chain}`);
    
    const chainId = getChainId(chain);
    const moralisChain = getMoralisChain(chain);
    
    // Intentar obtener datos de ambas fuentes
    const [covalentData, moralisData] = await Promise.all([
      covalentGetTransaction(txHash, chainId),
      moralisGetTransaction(txHash, moralisChain)
    ]);

    // Priorizar datos más completos
    const primaryData = moralisData || covalentData;
    
    if (!primaryData) {
      return {
        success: false,
        error: 'Transacción no encontrada en ningún proveedor'
      };
    }

    // Determinar status
    let status: 'SUCCESS' | 'FAILED' | 'PENDING' = 'PENDING';
    
    if (moralisData) {
      status = moralisData.receipt_status === '1' ? 'SUCCESS' : 'FAILED';
    } else if (covalentData) {
      status = covalentData.successful ? 'SUCCESS' : 'FAILED';
    }

    return {
      success: true,
      data: {
        hash: txHash,
        status,
        blockNumber: moralisData ? parseInt(moralisData.block_number) : covalentData?.block_height,
        timestamp: moralisData?.block_timestamp || covalentData?.block_signed_at,
        from: moralisData?.from_address || covalentData?.from_address,
        to: moralisData?.to_address || covalentData?.to_address,
        value: moralisData?.value || covalentData?.value,
        gasUsed: moralisData ? parseInt(moralisData.receipt_gas_used) : covalentData?.gas_spent,
        gasPrice: moralisData ? parseInt(moralisData.gas_price) : covalentData?.gas_price,
        details: {
          covalent: covalentData,
          moralis: moralisData
        }
      }
    };

  } catch (error) {
    console.error('Error en getTransactionStatus:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido en verificación de transacción'
    };
  }
}

/**
 * Resumen de auditoría de contrato usando GoPlus Security
 * PROYEC_PARTE7.MD línea 26: "getContractAuditSummary(contractAddress, chain): Obtiene un resumen de la seguridad de un contrato"
 */
export async function getContractAuditSummary(contractAddress: string, chain: string = 'eth'): Promise<{
  success: boolean;
  data?: {
    contractAddress: string;
    chain: string;
    isSecure: boolean;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    risks: string[];
    recommendations: string[];
    securityScore: number;
    details: any;
    lastAudited: string;
  };
  error?: string;
}> {
  try {
    console.log(`Auditing contract ${contractAddress} on chain ${chain}`);
    
    const chainId = getChainId(chain).toString();
    
    // Obtener resumen completo de GoPlus
    const auditData = await goPlusGetAudit(contractAddress, chainId);
    
    if (!auditData) {
      return {
        success: false,
        error: 'No se pudo obtener información de seguridad del contrato'
      };
    }

    // Calcular score de seguridad (0-100)
    let securityScore = 100;
    
    auditData.risks.forEach(risk => {
      if (risk.includes('ALTO')) securityScore -= 30;
      else if (risk.includes('MEDIO')) securityScore -= 15;
      else securityScore -= 5;
    });
    
    securityScore = Math.max(0, securityScore);
    
    // Determinar nivel de riesgo
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    if (securityScore >= 80) riskLevel = 'LOW';
    else if (securityScore >= 50) riskLevel = 'MEDIUM';
    else riskLevel = 'HIGH';

    return {
      success: true,
      data: {
        contractAddress,
        chain,
        isSecure: auditData.isSecure,
        riskLevel,
        risks: auditData.risks,
        recommendations: auditData.recommendations,
        securityScore,
        details: auditData.details,
        lastAudited: new Date().toISOString()
      }
    };

  } catch (error) {
    console.error('Error en getContractAuditSummary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido en auditoría de contrato'
    };
  }
}

/**
 * Función helper para mapear nombres de chain a IDs
 */
function getChainId(chain: string): number {
  const chainMap: Record<string, number> = {
    'eth': 1,
    'ethereum': 1,
    'bsc': 56,
    'binance': 56,
    'polygon': 137,
    'matic': 137,
    'avalanche': 43114,
    'avax': 43114,
    'fantom': 250,
    'ftm': 250,
    'arbitrum': 42161,
    'optimism': 10
  };
  
  return chainMap[chain.toLowerCase()] || 1;
}

/**
 * Función helper para mapear chain a formato Moralis
 */
function getMoralisChain(chain: string): string {
  const moralisMap: Record<string, string> = {
    'eth': 'eth',
    'ethereum': 'eth',
    'bsc': 'bsc',
    'binance': 'bsc',
    'polygon': 'polygon',
    'matic': 'polygon',
    'avalanche': 'avalanche',
    'avax': 'avalanche',
    'fantom': 'fantom',
    'ftm': 'fantom',
    'arbitrum': 'arbitrum',
    'optimism': 'optimism'
  };
  
  return moralisMap[chain.toLowerCase()] || 'eth';
}
