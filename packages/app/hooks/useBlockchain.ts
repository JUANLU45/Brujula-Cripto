'use client';

import { useState, useEffect } from 'react';

import type { 
  BlockchainAdapter, 
  BlockchainNetwork, 
  WalletConnection, 
  TransactionRequest,
  TransactionResult,
  TokenInfo 
} from '@/lib/blockchain/BlockchainAdapter';
import { BlockchainFactory } from '@/lib/blockchain/BlockchainAdapter';

interface UseBlockchainReturn {
  /** Adaptador blockchain actual */
  adapter: BlockchainAdapter | null;
  
  /** Conexión de wallet actual */
  connection: WalletConnection | null;
  
  /** Si está conectado */
  isConnected: boolean;
  
  /** Si está cargando */
  isLoading: boolean;
  
  /** Error si lo hay */
  error: string | null;
  
  /** Conectar wallet */
  connect: (providerName: string, network: BlockchainNetwork) => Promise<void>;
  
  /** Desconectar wallet */
  disconnect: () => Promise<void>;
  
  /** Cambiar red */
  switchNetwork: (network: BlockchainNetwork) => Promise<void>;
  
  /** Obtener balance */
  getBalance: (address?: string, tokenAddress?: string) => Promise<string>;
  
  /** Obtener información de token */
  getTokenInfo: (tokenAddress: string) => Promise<TokenInfo>;
  
  /** Enviar transacción */
  sendTransaction: (request: TransactionRequest) => Promise<TransactionResult>;
  
  /** Agregar token a wallet */
  addToken: (token: TokenInfo) => Promise<void>;
  
  /** Firmar mensaje */
  signMessage: (message: string) => Promise<string>;
  
  /** Proveedores disponibles */
  availableProviders: ReturnType<typeof BlockchainFactory.getSupportedProviders>;
  
  /** Configuraciones de red */
  networkConfigs: ReturnType<typeof BlockchainFactory.getNetworkConfigs>;
}

/**
 * Hook para interactuar con múltiples blockchains
 */
export function useBlockchain(): UseBlockchainReturn {
  const [adapter, setAdapter] = useState<BlockchainAdapter | null>(null);
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableProviders = BlockchainFactory.getSupportedProviders();
  const networkConfigs = BlockchainFactory.getNetworkConfigs();

  // Verificar conexión existente al cargar
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          
          if (accounts && accounts.length > 0) {
            // Recrear conexión con red Ethereum por defecto
            const ethereumNetwork = networkConfigs.ethereum;
            const ethereumAdapter = BlockchainFactory.createAdapter('ethereum', ethereumNetwork);
            
            const existingConnection = await ethereumAdapter.connect();
            setAdapter(ethereumAdapter);
            setConnection(existingConnection);
          }
        } catch (err) {
          console.log('No hay conexión existente');
        }
      }
    };

    void checkExistingConnection();
  }, []);

  const connect = async (providerName: string, network: BlockchainNetwork): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const newAdapter = BlockchainFactory.createAdapter(providerName, network);
      const newConnection = await newAdapter.connect();
      
      setAdapter(newAdapter);
      setConnection(newConnection);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error conectando wallet');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (adapter) {
        await adapter.disconnect();
      }
      
      setAdapter(null);
      setConnection(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconectando wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const switchNetwork = async (network: BlockchainNetwork): Promise<void> => {
    if (!adapter) {
      throw new Error('No hay adaptador conectado');
    }

    setIsLoading(true);
    setError(null);

    try {
      await adapter.switchNetwork(network);
      
      // Actualizar conexión con nueva red
      const updatedConnection = await adapter.connect();
      setConnection(updatedConnection);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cambiando red');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getBalance = async (address?: string, tokenAddress?: string): Promise<string> => {
    if (!adapter) {
      throw new Error('No hay adaptador conectado');
    }

    const targetAddress = address || connection?.address;
    if (!targetAddress) {
      throw new Error('No hay dirección disponible');
    }

    try {
      return await adapter.getBalance(targetAddress, tokenAddress);
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error obteniendo balance';
      setError(error);
      throw new Error(error);
    }
  };

  const getTokenInfo = async (tokenAddress: string): Promise<TokenInfo> => {
    if (!adapter) {
      throw new Error('No hay adaptador conectado');
    }

    try {
      return await adapter.getTokenInfo(tokenAddress);
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error obteniendo información del token';
      setError(error);
      throw new Error(error);
    }
  };

  const sendTransaction = async (request: TransactionRequest): Promise<TransactionResult> => {
    if (!adapter) {
      throw new Error('No hay adaptador conectado');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await adapter.sendTransaction(request);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error enviando transacción';
      setError(error);
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToken = async (token: TokenInfo): Promise<void> => {
    if (!adapter) {
      throw new Error('No hay adaptador conectado');
    }

    try {
      await adapter.addToken(token);
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error agregando token';
      setError(error);
      throw new Error(error);
    }
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!adapter) {
      throw new Error('No hay adaptador conectado');
    }

    try {
      return await adapter.signMessage(message);
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error firmando mensaje';
      setError(error);
      throw new Error(error);
    }
  };

  return {
    adapter,
    connection,
    isConnected: !!connection,
    isLoading,
    error,
    connect,
    disconnect,
    switchNetwork,
    getBalance,
    getTokenInfo,
    sendTransaction,
    addToken,
    signMessage,
    availableProviders,
    networkConfigs,
  };
}