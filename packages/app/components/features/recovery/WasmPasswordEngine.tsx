'use client';

import { useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import type { IUser } from '@brujula-cripto/types';

import UpgradeButton from '@/components/features/payments/UpgradeButton';
import { Button } from '@/components/ui/Button';
import { trackUsage } from '@/lib/api';
import { useAuth } from '@/lib/auth/AuthProvider';

interface PasswordRecoveryState {
  stage: 'setup' | 'processing' | 'results' | 'error';
  progress: number;
  currentOperation: string;
  results: string[];
  timeElapsed: number;
  estimatedTimeRemaining: number;
  creditsUsed: number;
}

interface WasmPasswordEngineProps {
  maxFreeAttempts?: number;
  freeCreditsSeconds?: number;
}

function WasmPasswordEngine({
  maxFreeAttempts = 100,
  freeCreditsSeconds = 900,
}: WasmPasswordEngineProps): JSX.Element {
  const t = useTranslations('recovery.passwordEngine');
  const { user: _user, userData } = useAuth();
  const workerRef = useRef<Worker | null>(null);
  const trackingRef = useRef<string | null>(null);

  const [recoveryState, setRecoveryState] = useState<PasswordRecoveryState>({
    stage: 'setup',
    progress: 0,
    currentOperation: '',
    results: [],
    timeElapsed: 0,
    estimatedTimeRemaining: 0,
    creditsUsed: 0,
  });

  const [formData, setFormData] = useState({
    partialPassword: '',
    knownParts: '',
    passwordLength: '',
    includeNumbers: true,
    includeSymbols: false,
    includeLowercase: true,
    includeUppercase: true,
    customDictionary: '',
    walletType: 'generic',
  });

  const [files, setFiles] = useState<{
    dictionary?: File;
    walletFile?: File;
  }>({});

  const userCredits = userData?.usageCreditsInSeconds || 0;
  const hasCredits = userCredits > 30;
  const _hasFreeCredits = userCredits >= freeCreditsSeconds;

  const handleFileUpload = (type: 'dictionary' | 'walletFile', file: File | null): void => {
    if (file) {
      setFiles((prev) => ({ ...prev, [type]: file }));
    }
  };

  // Inicializar Web Worker REAL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Crear Web Worker para procesamiento WebAssembly
      workerRef.current = new Worker('/workers/wasmPasswordWorker.js');
      workerRef.current.onmessage = handleWorkerMessage;
    }

    return (): void => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const generatePasswordCombinations = async (): Promise<void> => {
    if (!hasCredits) {
      return;
    }

    try {
      // Iniciar seguimiento de uso REAL
      const sessionResponse = await trackUsage({
        service: 'password-recovery',
        action: 'start',
        estimatedDuration: 1800, // 30 minutos estimados
      });

      trackingRef.current = sessionResponse.sessionId;

      setRecoveryState((prev) => ({
        ...prev,
        stage: 'processing',
        progress: 0,
        timeElapsed: 0,
        creditsUsed: 0,
        currentOperation: t('operations.initializing'),
      }));

      // Enviar configuración REAL al Web Worker
      if (workerRef.current) {
        const config = {
          partialPassword: formData.partialPassword,
          knownParts: formData.knownParts,
          passwordLength: parseInt(formData.passwordLength) || 12,
          characterSets: {
            numbers: formData.includeNumbers,
            symbols: formData.includeSymbols,
            lowercase: formData.includeLowercase,
            uppercase: formData.includeUppercase,
          },
          walletType: formData.walletType,
          maxCreditsSeconds: userCredits,
          sessionId: trackingRef.current,
        };

        // Procesar archivos si existen
        const walletBuffer = files.walletFile ? await files.walletFile.arrayBuffer() : null;
        const dictionaryBuffer = files.dictionary ? await files.dictionary.arrayBuffer() : null;

        workerRef.current.postMessage({
          type: 'start',
          config,
          walletBuffer,
          dictionaryBuffer,
        });
      }
    } catch {
      setRecoveryState((prev) => ({
        ...prev,
        stage: 'error',
        currentOperation: 'Error al iniciar sesión de recuperación',
      }));
    }
  };

  const resetEngine = async (): Promise<void> => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'stop' });
    }

    if (trackingRef.current) {
      await trackUsage({
        service: 'password-recovery',
        sessionId: trackingRef.current,
        action: 'stop',
      }).catch(console.error);
    }
    setRecoveryState({
      stage: 'setup',
      progress: 0,
      currentOperation: '',
      results: [],
      timeElapsed: 0,
      estimatedTimeRemaining: 0,
      creditsUsed: 0,
    });
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadResults = (): void => {
    const results = recoveryState.results.join('\n');
    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'password-candidates.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleWorkerMessage = (event: MessageEvent): void => {
    const { type, data } = event.data as { type: string; data: unknown };

    switch (type) {
      case 'progress': {
        const progress = (data as { progress: number }).progress;
        const operation = (data as { operation: string }).operation;
        const timeElapsed = (data as { timeElapsed: number }).timeElapsed;
        const estimatedRemaining = (data as { estimatedRemaining: number }).estimatedRemaining;
        const creditsUsed = (data as { creditsUsed: number }).creditsUsed;
        setRecoveryState((prev) => ({
          ...prev,
          progress,
          currentOperation: operation,
          timeElapsed,
          estimatedTimeRemaining: estimatedRemaining,
          creditsUsed,
        }));
        break;
      }

      case 'result': {
        const password = (data as { password: string }).password;
        setRecoveryState((prev) => ({
          ...prev,
          results: [...prev.results, password],
        }));
        break;
      }

      case 'complete':
        setRecoveryState((prev) => ({
          ...prev,
          stage: 'results',
          progress: 100,
        }));
        if (trackingRef.current) {
          trackUsage({
            service: 'password-recovery',
            sessionId: trackingRef.current,
            action: 'complete',
          }).catch((error: unknown) => {
            console.error('Tracking error:', error);
          });
        }
        break;

      case 'error': {
        const errorMessage = (data as { error: string }).error;
        setRecoveryState((prev) => ({
          ...prev,
          stage: 'error',
          currentOperation: errorMessage,
        }));
        break;
      }
    }
  };

  const renderSetupForm = (): JSX.Element => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Información conocida */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.partialPassword')}
          </label>
          <input
            type="text"
            value={formData.partialPassword}
            onChange={(e) => setFormData((prev) => ({ ...prev, partialPassword: e.target.value }))}
            placeholder={t('form.partialPasswordPlaceholder')}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.passwordLength')}
          </label>
          <input
            type="number"
            value={formData.passwordLength}
            onChange={(e) => setFormData((prev) => ({ ...prev, passwordLength: e.target.value }))}
            placeholder={t('form.passwordLengthPlaceholder')}
            min="1"
            max="50"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Opciones de caracteres */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {t('form.characterTypes')}
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { key: 'includeLowercase', label: t('form.lowercase') },
            { key: 'includeUppercase', label: t('form.uppercase') },
            { key: 'includeNumbers', label: t('form.numbers') },
            { key: 'includeSymbols', label: t('form.symbols') },
          ].map(({ key, label }) => (
            <label key={key} className="flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                checked={formData[key as keyof typeof formData] as boolean}
                onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Carga de archivos */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.dictionaryFile')}
          </label>
          <input
            type="file"
            accept=".txt,.dic"
            onChange={(e) => handleFileUpload('dictionary', e.target.files?.[0] || null)}
            title={t('form.dictionaryFile')}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-2 file:py-1 file:text-sm file:text-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.walletFile')}
          </label>
          <input
            type="file"
            accept=".dat,.wallet,.json"
            onChange={(e) => handleFileUpload('walletFile', e.target.files?.[0] || null)}
            title={t('form.walletFile')}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-2 file:py-1 file:text-sm file:text-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <Button
        onClick={() => void generatePasswordCombinations()}
        disabled={!formData.partialPassword.trim()}
        className="w-full bg-blue-600 py-3 text-lg font-semibold text-white hover:bg-blue-700"
      >
        {t('form.startRecovery')}
      </Button>
    </div>
  );

  const renderProcessingState = (): JSX.Element => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          {t('processing.title')}
        </h3>

        <div className="relative pt-1">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <span className="inline-block rounded-full bg-blue-200 px-2 py-1 text-xs font-semibold uppercase text-blue-600">
                {t('processing.progress')}
              </span>
            </div>
            <div className="text-right">
              <span className="inline-block text-xs font-semibold text-blue-600">
                {recoveryState.progress.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="mb-4 flex h-2 overflow-hidden rounded bg-blue-200 text-xs">
            <div
              className={`flex flex-col justify-center whitespace-nowrap bg-blue-500 text-center text-white shadow-none transition-all duration-300`}
              data-width={`${recoveryState.progress}%`}
            />
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>{recoveryState.currentOperation}</p>
          <p>
            {t('processing.timeElapsed')}: {formatTime(recoveryState.timeElapsed)}
          </p>
          {recoveryState.estimatedTimeRemaining > 0 && (
            <p>
              {t('processing.timeRemaining')}:{' '}
              {formatTime(Math.floor(recoveryState.estimatedTimeRemaining))}
            </p>
          )}
        </div>
      </div>

      <Button onClick={() => void resetEngine()} variant="outline" className="w-full">
        {t('processing.cancel')}
      </Button>
    </div>
  );

  const renderResults = (): JSX.Element => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          {recoveryState.results.length > 0
            ? t('results.successTitle')
            : t('results.noResultsTitle')}
        </h3>
      </div>

      {recoveryState.results.length > 0 ? (
        <div className="space-y-4">
          <p className="text-center text-green-600 dark:text-green-400">
            {t('results.foundPasswords', { count: recoveryState.results.length })}
          </p>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
              {t('results.candidatesTitle')}
            </h4>
            <ul className="space-y-2">
              {recoveryState.results.map((password, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded border bg-white p-3 dark:bg-gray-800"
                >
                  <code className="font-mono text-sm text-gray-900 dark:text-white">
                    {password}
                  </code>
                  <Button
                    size="sm"
                    onClick={() => void navigator.clipboard.writeText(password)}
                    className="text-xs"
                  >
                    {t('results.copy')}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">{t('results.noResultsDescription')}</p>

          {!hasCredits && (
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="mb-4 text-blue-700 dark:text-blue-300">{t('results.upgradePrompt')}</p>
              <UpgradeButton size="sm" />
            </div>
          )}
        </div>
      )}

      <div className="flex space-x-4">
        <Button onClick={() => void resetEngine()} className="flex-1">
          {t('results.newAttempt')}
        </Button>
        {recoveryState.results.length > 0 && (
          <Button onClick={downloadResults} variant="outline" className="flex-1">
            {t('results.download')}
          </Button>
        )}
      </div>
    </div>
  );

  const renderError = (): JSX.Element => (
    <div className="space-y-6 text-center">
      <div className="text-red-600 dark:text-red-400">
        <h3 className="mb-2 text-xl font-semibold">{t('error.title')}</h3>
        <p>{recoveryState.currentOperation}</p>
      </div>

      <Button onClick={() => void resetEngine()} className="w-full">
        {t('error.tryAgain')}
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">{t('description')}</p>
        </div>

        {/* Limitaciones para usuarios sin créditos */}
        {!hasCredits && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <h3 className="mb-2 text-lg font-semibold text-yellow-800 dark:text-yellow-200">
              {t('freeVersion.title')}
            </h3>
            <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
              <li>• {t('freeVersion.maxAttempts', { max: maxFreeAttempts.toLocaleString() })}</li>
              <li>
                • {t('freeVersion.timeLimit', { minutes: Math.floor(freeCreditsSeconds / 60) })}
              </li>
              <li>• {t('freeVersion.basicDictionary')}</li>
            </ul>

            <div className="mt-4">
              <UpgradeButton
                size="sm"
                fullWidth={false}
                customText={t('freeVersion.upgradeButton')}
                showConsentCheckbox={false}
              />
            </div>
          </div>
        )}

        {/* Formulario de configuración */}
        {recoveryState.stage === 'setup' && renderSetupForm()}

        {/* Estado de procesamiento */}
        {recoveryState.stage === 'processing' && renderProcessingState()}

        {/* Resultados */}
        {recoveryState.stage === 'results' && renderResults()}

        {/* Error */}
        {recoveryState.stage === 'error' && renderError()}

        {/* Disclaimer */}
        <div className="mt-8 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <p className="text-center text-xs text-gray-600 dark:text-gray-400">
            {t('disclaimer.text')}{' '}
            <a
              href="/legal/descargo-responsabilidad"
              className="text-blue-600 hover:underline dark:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('disclaimer.link')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export { WasmPasswordEngine as default };
