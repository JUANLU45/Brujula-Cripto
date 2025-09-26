// Abstracción vendor-agnostic para blockchains múltiples
// Permite cambiar proveedores sin afectar la lógica de negocio

// Extending Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface BlockchainProvider {
  /** Nombre del proveedor */
  name: string;
  /** Redes soportadas */
  supportedNetworks: string[];
  /** Si está disponible */
  isAvailable: boolean;
}

export interface BlockchainNetwork {
  /** ID de la red */
  id: string;
  /** Nombre legible */
  name: string;
  /** Símbolo de la moneda nativa */
  nativeCurrency: string;
  /** URLs de RPC */
  rpcUrls: string[];
  /** URLs de exploradores */
  blockExplorers: string[];
  /** Si es testnet */
  isTestnet: boolean;
}

export interface TokenInfo {
  /** Dirección del contrato */
  address: string;
  /** Símbolo del token */
  symbol: string;
  /** Nombre del token */
  name: string;
  /** Decimales */
  decimals: number;
  /** Logo URL */
  logoUrl?: string;
}

export interface WalletConnection {
  /** Dirección de la wallet */
  address: string;
  /** Red actual */
  network: BlockchainNetwork;
  /** Balance nativo */
  nativeBalance: string;
  /** Proveedor conectado */
  provider: BlockchainProvider;
}

export interface TransactionRequest {
  /** Dirección destino */
  to: string;
  /** Cantidad a enviar (en wei/unidades mínimas) */
  value: string;
  /** Data del contrato (opcional) */
  data?: string;
  /** Gas limit (opcional) */
  gasLimit?: string;
  /** Gas price (opcional) */
  gasPrice?: string;
}

export interface TransactionResult {
  /** Hash de la transacción */
  hash: string;
  /** Estado */
  status: 'pending' | 'confirmed' | 'failed';
  /** Número de bloque (si está confirmada) */
  blockNumber?: number;
  /** Gas usado */
  gasUsed?: string;
}

/**
 * Interfaz principal del proveedor blockchain
 */
export abstract class BlockchainAdapter {
  protected provider: BlockchainProvider;
  protected network: BlockchainNetwork;

  constructor(provider: BlockchainProvider, network: BlockchainNetwork) {
    this.provider = provider;
    this.network = network;
  }

  // Métodos abstractos que deben implementar los proveedores específicos
  abstract connect(): Promise<WalletConnection>;
  abstract disconnect(): Promise<void>;
  abstract getBalance(address: string, tokenAddress?: string): Promise<string>;
  abstract getTokenInfo(tokenAddress: string): Promise<TokenInfo>;
  abstract sendTransaction(request: TransactionRequest): Promise<TransactionResult>;
  abstract getTransactionStatus(hash: string): Promise<TransactionResult>;
  abstract switchNetwork(network: BlockchainNetwork): Promise<void>;
  abstract addToken(token: TokenInfo): Promise<void>;
  abstract signMessage(message: string): Promise<string>;

  // Métodos comunes
  getProvider(): BlockchainProvider {
    return this.provider;
  }

  getNetwork(): BlockchainNetwork {
    return this.network;
  }

  isConnected(): boolean {
    return this.provider.isAvailable;
  }
}

/**
 * Implementación para MetaMask/Ethereum
 */
export class EthereumAdapter extends BlockchainAdapter {
  private ethereum: any;

  constructor(network: BlockchainNetwork) {
    super(
      {
        name: 'MetaMask',
        supportedNetworks: ['ethereum', 'polygon', 'bsc', 'arbitrum'],
        isAvailable: typeof window !== 'undefined' && !!window.ethereum,
      },
      network,
    );
    this.ethereum = typeof window !== 'undefined' ? window.ethereum : null;
  }

  async connect(): Promise<WalletConnection> {
    if (!this.ethereum) {
      throw new Error('MetaMask no está instalado');
    }

    try {
      const accounts = await this.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No se encontraron cuentas');
      }

      const address = accounts[0];
      const balance = await this.getBalance(address);

      return {
        address,
        network: this.network,
        nativeBalance: balance,
        provider: this.provider,
      };
    } catch (error) {
      throw new Error(`Error conectando a MetaMask: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    // MetaMask no tiene método de desconexión programática
    // El usuario debe desconectar manualmente desde la extensión
  }

  async getBalance(address: string, tokenAddress?: string): Promise<string> {
    if (!this.ethereum) {
      throw new Error('Proveedor no disponible');
    }

    try {
      if (tokenAddress) {
        // Balance de token ERC-20
        const data = `0x70a08231000000000000000000000000${address.slice(2)}`;
        const result = await this.ethereum.request({
          method: 'eth_call',
          params: [
            {
              to: tokenAddress,
              data,
            },
            'latest',
          ],
        });
        return result;
      } else {
        // Balance nativo (ETH)
        const result = await this.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });
        return result;
      }
    } catch (error) {
      throw new Error(`Error obteniendo balance: ${error}`);
    }
  }

  async getTokenInfo(tokenAddress: string): Promise<TokenInfo> {
    if (!this.ethereum) {
      throw new Error('Proveedor no disponible');
    }

    try {
      // Obtener información del token usando llamadas estáticas
      const [name, symbol, decimals] = await Promise.all([
        this.ethereum.request({
          method: 'eth_call',
          params: [{ to: tokenAddress, data: '0x06fdde03' }, 'latest'],
        }),
        this.ethereum.request({
          method: 'eth_call',
          params: [{ to: tokenAddress, data: '0x95d89b41' }, 'latest'],
        }),
        this.ethereum.request({
          method: 'eth_call',
          params: [{ to: tokenAddress, data: '0x313ce567' }, 'latest'],
        }),
      ]);

      return {
        address: tokenAddress,
        name: this.hexToString(name),
        symbol: this.hexToString(symbol),
        decimals: parseInt(decimals, 16),
      };
    } catch (error) {
      throw new Error(`Error obteniendo información del token: ${error}`);
    }
  }

  async sendTransaction(request: TransactionRequest): Promise<TransactionResult> {
    if (!this.ethereum) {
      throw new Error('Proveedor no disponible');
    }

    try {
      const txParams = {
        to: request.to,
        value: request.value,
        data: request.data || '0x',
        gas: request.gasLimit,
        gasPrice: request.gasPrice,
      };

      const hash = await this.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });

      return {
        hash,
        status: 'pending',
      };
    } catch (error) {
      throw new Error(`Error enviando transacción: ${error}`);
    }
  }

  async getTransactionStatus(hash: string): Promise<TransactionResult> {
    if (!this.ethereum) {
      throw new Error('Proveedor no disponible');
    }

    try {
      const receipt = await this.ethereum.request({
        method: 'eth_getTransactionReceipt',
        params: [hash],
      });

      if (!receipt) {
        return { hash, status: 'pending' };
      }

      return {
        hash,
        status: receipt.status === '0x1' ? 'confirmed' : 'failed',
        blockNumber: parseInt(receipt.blockNumber, 16),
        gasUsed: receipt.gasUsed,
      };
    } catch (error) {
      throw new Error(`Error obteniendo estado de transacción: ${error}`);
    }
  }

  async switchNetwork(network: BlockchainNetwork): Promise<void> {
    if (!this.ethereum) {
      throw new Error('Proveedor no disponible');
    }

    try {
      await this.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.id }],
      });
      this.network = network;
    } catch (error: any) {
      // Si la red no está agregada, intentar agregarla
      if (error.code === 4902) {
        await this.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: network.id,
              chainName: network.name,
              nativeCurrency: {
                name: network.nativeCurrency,
                symbol: network.nativeCurrency,
                decimals: 18,
              },
              rpcUrls: network.rpcUrls,
              blockExplorerUrls: network.blockExplorers,
            },
          ],
        });
        this.network = network;
      } else {
        throw new Error(`Error cambiando red: ${error.message}`);
      }
    }
  }

  async addToken(token: TokenInfo): Promise<void> {
    if (!this.ethereum) {
      throw new Error('Proveedor no disponible');
    }

    try {
      await this.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals,
            image: token.logoUrl,
          },
        },
      });
    } catch (error) {
      throw new Error(`Error agregando token: ${error}`);
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.ethereum) {
      throw new Error('Proveedor no disponible');
    }

    try {
      const accounts = await this.ethereum.request({
        method: 'eth_accounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No hay cuentas conectadas');
      }

      const signature = await this.ethereum.request({
        method: 'personal_sign',
        params: [message, accounts[0]],
      });

      return signature;
    } catch (error) {
      throw new Error(`Error firmando mensaje: ${error}`);
    }
  }

  private hexToString(hex: string): string {
    let str = '';
    for (let i = 2; i < hex.length; i += 2) {
      const charCode = parseInt(hex.substr(i, 2), 16);
      if (charCode !== 0) {
        str += String.fromCharCode(charCode);
      }
    }
    return str;
  }
}

/**
 * Factory para crear adaptadores blockchain
 */
export class BlockchainFactory {
  private static adapters = new Map<string, BlockchainAdapter>();

  static createAdapter(
    providerName: string,
    network: BlockchainNetwork,
  ): BlockchainAdapter {
    const key = `${providerName}-${network.id}`;

    if (!this.adapters.has(key)) {
      let adapter: BlockchainAdapter;

      switch (providerName.toLowerCase()) {
        case 'metamask':
        case 'ethereum':
          adapter = new EthereumAdapter(network);
          break;
        default:
          throw new Error(`Proveedor no soportado: ${providerName}`);
      }

      this.adapters.set(key, adapter);
    }

    return this.adapters.get(key)!;
  }

  static getSupportedProviders(): BlockchainProvider[] {
    return [
      {
        name: 'MetaMask',
        supportedNetworks: ['ethereum', 'polygon', 'bsc', 'arbitrum'],
        isAvailable: typeof window !== 'undefined' && !!window.ethereum,
      },
    ];
  }

  static getNetworkConfigs(): Record<string, BlockchainNetwork> {
    return {
      ethereum: {
        id: '0x1',
        name: 'Ethereum Mainnet',
        nativeCurrency: 'ETH',
        rpcUrls: ['https://mainnet.infura.io/v3/YOUR_PROJECT_ID'],
        blockExplorers: ['https://etherscan.io'],
        isTestnet: false,
      },
      polygon: {
        id: '0x89',
        name: 'Polygon',
        nativeCurrency: 'MATIC',
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorers: ['https://polygonscan.com'],
        isTestnet: false,
      },
      bsc: {
        id: '0x38',
        name: 'Binance Smart Chain',
        nativeCurrency: 'BNB',
        rpcUrls: ['https://bsc-dataseed.binance.org'],
        blockExplorers: ['https://bscscan.com'],
        isTestnet: false,
      },
    };
  }
}