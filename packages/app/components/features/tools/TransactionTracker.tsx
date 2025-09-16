'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/AuthProvider';

interface TransactionResult {
  hash: string;
  blockNumber?: number;
  from: string;
  to: string;
  value: string;
  gasUsed?: string;
  gasPrice?: string;
  status: 'success' | 'failed' | 'pending';
  timestamp?: number;
  confirmations?: number;
}

interface TransactionTrackerProps {
  maxRetries?: number;
  retryDelay?: number;
}

export function TransactionTracker({
  maxRetries = 3,
  retryDelay = 1000,
}: TransactionTrackerProps): JSX.Element {
  const t = useTranslations('tools.transactionTracker');
  const { user, userData } = useAuth();

  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<TransactionResult[]>([]);
  const [error, setError] = useState('');
  const [searchType, setSearchType] = useState<'hash' | 'address'>('hash');

  const isValidHash = (input: string): boolean => {
    return /^0x[a-fA-F0-9]{64}$/.test(input);
  };

  const isValidAddress = (input: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(input);
  };

  const handleRetryWithBackoff = async (
    operation: () => Promise<unknown>,
    retries: number = maxRetries,
  ): Promise<unknown> => {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * (maxRetries - retries + 1)),
        );
        return handleRetryWithBackoff(operation, retries - 1);
      }
      throw error;
    }
  };

  const searchTransaction = async (): Promise<void> => {
    if (!searchInput.trim()) {
      setError(t('errors.emptyInput'));
      return;
    }

    // Detectar tipo de búsqueda automáticamente
    const detectedType = isValidHash(searchInput)
      ? 'hash'
      : isValidAddress(searchInput)
        ? 'address'
        : null;

    if (!detectedType) {
      setError(t('errors.invalidFormat'));
      return;
    }

    setIsSearching(true);
    setError('');
    setSearchResults([]);

    try {
      const results = (await handleRetryWithBackoff(async () => {
        // Implementar llamadas reales a APIs externas
        if (detectedType === 'hash') {
          const response = await fetch(`/api/blockchain/transaction/${searchInput}`);
          if (!response.ok) {
            throw new Error('Error fetching transaction data');
          }
          const txData = await response.json();
          return [txData];
        } else {
          // Búsqueda por dirección - obtener transacciones de la API
          const response = await fetch(`/api/blockchain/address/${searchInput}`);
          if (!response.ok) {
            throw new Error('Error fetching address transactions');
          }
          const addressData = await response.json();
          return addressData.transactions || [];
        }
      })) as TransactionResult[];

      setSearchResults(results);
      setSearchType(detectedType);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.searchFailed'));
    } finally {
      setIsSearching(false);
    }
  };

  const formatTimestamp = (timestamp?: number): string => {
    if (!timestamp) {
      return t('unknown');
    }
    return new Date(timestamp).toLocaleString();
  };

  const formatValue = (value: string): string => {
    return value || t('unknown');
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>

        <p className="mb-8 text-gray-600 dark:text-gray-400">{t('description')}</p>

        {/* Formulario de búsqueda */}
        <div className="mb-8 space-y-4">
          <div>
            <label
              htmlFor="searchInput"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('searchLabel')}
            </label>
            <div className="flex gap-2">
              <input
                id="searchInput"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <Button
                onClick={() => void searchTransaction()}
                disabled={isSearching}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isSearching ? t('searching') : t('search')}
              </Button>
            </div>
          </div>

          {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
        </div>

        {/* Resultados de búsqueda */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {searchType === 'hash' ? t('transactionDetails') : t('transactionHistory')}
            </h2>

            {searchResults.map((result, index) => (
              <div key={index} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                      {t('transactionHash')}
                    </h3>
                    <p className="break-all font-mono text-sm text-gray-600 dark:text-gray-400">
                      {result.hash}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                      {t('status')}
                    </h3>
                    <p className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                      {t(`statuses.${result.status}`)}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium text-gray-900 dark:text-white">{t('from')}</h3>
                    <p className="break-all font-mono text-sm text-gray-600 dark:text-gray-400">
                      {result.from}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium text-gray-900 dark:text-white">{t('to')}</h3>
                    <p className="break-all font-mono text-sm text-gray-600 dark:text-gray-400">
                      {result.to}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium text-gray-900 dark:text-white">{t('value')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatValue(result.value)}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                      {t('timestamp')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatTimestamp(result.timestamp)}
                    </p>
                  </div>

                  {result.blockNumber && (
                    <div>
                      <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                        {t('blockNumber')}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {result.blockNumber.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {result.confirmations && (
                    <div>
                      <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                        {t('confirmations')}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {result.confirmations.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Información de uso para usuarios premium */}
        {user && userData?.isPremium && (
          <div className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-sm text-blue-700 dark:text-blue-300">{t('premiumFeature')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
