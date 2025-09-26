'use client';

import { useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import UpgradeButton from '@/components/features/payments/UpgradeButton';
import { Button } from '@/components/ui/Button';
import { trackUsage, analyzeFileRecovery } from '@/lib/api';
import { useAuth } from '@/lib/auth/AuthProvider';

import { 
  RecoveryStatus,
  WalletFileType, 
  OperatingSystem, 
  TimeRange 
} from '@brujula-cripto/types';
import type { 
  DiagnosisData, 
  AnalysisResult
} from '@brujula-cripto/types';

interface RecoveryState {
  stage: 'setup' | 'analyzing' | 'results' | 'error';
  status: RecoveryStatus;
  analysisResult: AnalysisResult | null;
  timeElapsed: number;
  creditsUsed: number;
  sessionId: string | null;
}

interface DeletedFilesRecoveryProps {
  freeCreditsSeconds?: number;
}

function DeletedFilesRecovery({
  freeCreditsSeconds = 900,
}: DeletedFilesRecoveryProps): JSX.Element {
  const t = useTranslations('recovery.deletedFiles');
  const { user: _user, userData } = useAuth();
  const trackingRef = useRef<string | null>(null);

  const [recoveryState, setRecoveryState] = useState<RecoveryState>({
    stage: 'setup',
    status: RecoveryStatus.READY,
    analysisResult: null,
    timeElapsed: 0,
    creditsUsed: 0,
    sessionId: null,
  });

  const [formData, setFormData] = useState<DiagnosisData>({
    fileType: WalletFileType.BITCOIN_CORE,
    operatingSystem: OperatingSystem.WINDOWS,
    timeElapsed: TimeRange.UNDER_24H,
    estimatedValue: undefined,
  });

  const userCredits = userData?.usageCreditsInSeconds || 0;
  const hasCredits = userCredits > 30;

  // Timer para seguimiento del tiempo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (recoveryState.stage === 'analyzing') {
      interval = setInterval(() => {
        setRecoveryState(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1,
        }));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [recoveryState.stage]);

  const startAnalysis = async (): Promise<void> => {
    if (!hasCredits) {
      return;
    }

    try {
      // Iniciar seguimiento de uso REAL
      const sessionResponse = await trackUsage({
        service: 'deleted-files-recovery',
        action: 'start',
        estimatedDuration: 900, // 15 minutos estimados
      });

      trackingRef.current = sessionResponse.sessionId;

      setRecoveryState(prev => ({
        ...prev,
        stage: 'analyzing',
        status: RecoveryStatus.ANALYZING,
        sessionId: sessionResponse.sessionId,
        timeElapsed: 0,
        creditsUsed: 0,
      }));

      // Llamada REAL a Cloud Function
      const analysisResponse = await analyzeFileRecovery({
        sessionId: sessionResponse.sessionId,
        diagnosis: formData,
      });

      // RecoverySessionResponse siempre es exitoso si llega aquí
      setRecoveryState(prev => ({
        ...prev,
        stage: 'results',
        status: RecoveryStatus.SUCCESS,
        analysisResult: analysisResponse.analysis,
      }));

      // Finalizar seguimiento
      await trackUsage({
        service: 'deleted-files-recovery',
        sessionId: trackingRef.current!,
        action: 'complete',
      });
    } catch (error) {
      console.error('Error en análisis:', error);
      setRecoveryState(prev => ({
        ...prev,
        stage: 'error',
        status: RecoveryStatus.FAILED,
      }));

      if (trackingRef.current) {
        await trackUsage({
          service: 'deleted-files-recovery',
          sessionId: trackingRef.current,
          action: 'error',
        }).catch(console.error);
      }
    }
  };

  const resetAnalysis = async (): Promise<void> => {
    if (trackingRef.current) {
      await trackUsage({
        service: 'deleted-files-recovery',
        sessionId: trackingRef.current,
        action: 'stop',
      }).catch(console.error);
    }

    setRecoveryState({
      stage: 'setup',
      status: RecoveryStatus.READY,
      analysisResult: null,
      timeElapsed: 0,
      creditsUsed: 0,
      sessionId: null,
    });
    trackingRef.current = null;
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadGuide = (): void => {
    if (!recoveryState.analysisResult) return;

    const guideContent = `
GUÍA DE RECUPERACIÓN DE ARCHIVOS ELIMINADOS
==========================================

Tipo de Archivo: ${formData.fileType}
Sistema Operativo: ${formData.operatingSystem}
Tiempo Transcurrido: ${formData.timeElapsed}
Probabilidad de Recuperación: ${recoveryState.analysisResult.recoveryProbability}%

HERRAMIENTAS RECOMENDADAS:
${recoveryState.analysisResult.recommendedTools.map((tool, index) => `
${index + 1}. ${tool.name}
   - Tipo: ${tool.type}
   - Dificultad: ${tool.difficulty}
   - Tiempo estimado: ${tool.estimatedTime} minutos
   - Tasa de éxito: ${tool.successRate}%
   ${tool.downloadUrl ? `- Descarga: ${tool.downloadUrl}` : ''}
   
   INSTRUCCIONES:
   ${tool.instructions.map((step, stepIndex) => `
   Paso ${step.stepNumber}: ${step.title}
   ${step.description}
   ${step.commands ? `Comandos: ${step.commands.join(', ')}` : ''}
   ${step.warningLevel === 'critical' ? '⚠️ CRÍTICO' : step.warningLevel === 'warning' ? '⚠️ ADVERTENCIA' : 'ℹ️ INFO'}
   `).join('\n')}
`).join('\n')}

DESCARGO DE RESPONSABILIDAD:
Esta guía es solo informativa. El usuario es responsable de su uso.
No garantizamos la recuperación exitosa de archivos.
`;

    const blob = new Blob([guideContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recovery-guide-${formData.fileType}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderSetupForm = (): JSX.Element => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Tipo de archivo de wallet */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.walletType')}
          </label>
          <select
            value={formData.fileType}
            onChange={(e) => setFormData(prev => ({ ...prev, fileType: e.target.value as WalletFileType }))}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value={WalletFileType.BITCOIN_CORE}>{t('walletTypes.bitcoinCore')}</option>
            <option value={WalletFileType.ETHEREUM_KEYSTORE}>{t('walletTypes.ethereumKeystore')}</option>
            <option value={WalletFileType.ELECTRUM}>{t('walletTypes.electrum')}</option>
            <option value={WalletFileType.METAMASK}>{t('walletTypes.metamask')}</option>
            <option value={WalletFileType.EXODUS}>{t('walletTypes.exodus')}</option>
            <option value={WalletFileType.LEDGER_LIVE}>{t('walletTypes.ledgerLive')}</option>
            <option value={WalletFileType.TREZOR}>{t('walletTypes.trezor')}</option>
            <option value={WalletFileType.MYETHERWALLET}>{t('walletTypes.myetherwallet')}</option>
            <option value={WalletFileType.OTHER}>{t('walletTypes.other')}</option>
          </select>
        </div>

        {/* Sistema operativo */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.operatingSystem')}
          </label>
          <select
            value={formData.operatingSystem}
            onChange={(e) => setFormData(prev => ({ ...prev, operatingSystem: e.target.value as OperatingSystem }))}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value={OperatingSystem.WINDOWS}>{t('operatingSystems.windows')}</option>
            <option value={OperatingSystem.MACOS}>{t('operatingSystems.macos')}</option>
            <option value={OperatingSystem.LINUX}>{t('operatingSystems.linux')}</option>
            <option value={OperatingSystem.ANDROID}>{t('operatingSystems.android')}</option>
            <option value={OperatingSystem.IOS}>{t('operatingSystems.ios')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Tiempo transcurrido */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.timeElapsed')}
          </label>
          <select
            value={formData.timeElapsed}
            onChange={(e) => setFormData(prev => ({ ...prev, timeElapsed: e.target.value as TimeRange }))}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value={TimeRange.UNDER_24H}>{t('timeRanges.under24h')}</option>
            <option value={TimeRange.UNDER_7D}>{t('timeRanges.under7d')}</option>
            <option value={TimeRange.UNDER_30D}>{t('timeRanges.under30d')}</option>
            <option value={TimeRange.OVER_30D}>{t('timeRanges.over30d')}</option>
          </select>
        </div>

        {/* Valor estimado (opcional) */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.estimatedValue')}
          </label>
          <input
            type="number"
            value={formData.estimatedValue || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              estimatedValue: e.target.value ? parseFloat(e.target.value) : undefined 
            }))}
            placeholder={t('form.estimatedValuePlaceholder')}
            min="0"
            step="0.01"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <Button
        onClick={() => void startAnalysis()}
        disabled={!hasCredits}
        className="w-full bg-blue-600 py-3 text-lg font-semibold text-white hover:bg-blue-700"
      >
        {t('form.analyzeButton')}
      </Button>
    </div>
  );

  const renderAnalyzing = (): JSX.Element => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        {t('analyzing.title')}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400">
        {t('analyzing.description')}
      </p>
      
      <div className="text-sm text-gray-500 dark:text-gray-500">
        {t('analyzing.timeElapsed')}: {formatTime(recoveryState.timeElapsed)}
      </div>

      <Button onClick={() => void resetAnalysis()} variant="outline">
        {t('analyzing.cancel')}
      </Button>
    </div>
  );

  const renderResults = (): JSX.Element => {
    if (!recoveryState.analysisResult) return <div>Error: No hay resultados</div>;

    const { recoveryProbability, recommendedTools, estimatedDifficulty, urgencyLevel } = recoveryState.analysisResult;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            {t('results.title')}
          </h3>
        </div>

        {/* Probabilidad y estadísticas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {recoveryProbability}%
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              {t('results.recoveryProbability')}
            </div>
          </div>

          <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {t(`difficulty.${estimatedDifficulty}`)}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              {t('results.difficulty')}
            </div>
          </div>

          <div className="rounded-lg bg-orange-50 p-4 text-center dark:bg-orange-900/20">
            <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">
              {t(`urgency.${urgencyLevel}`)}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300">
              {t('results.urgency')}
            </div>
          </div>
        </div>

        {/* Herramientas recomendadas */}
        <div>
          <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {t('results.recommendedTools')}
          </h4>

          <div className="space-y-4">
            {recommendedTools.map((tool, index) => (
              <div key={index} className="rounded-lg border bg-white p-4 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {tool.name}
                  </h5>
                  <span className={`rounded px-2 py-1 text-xs font-medium ${
                    tool.type === 'free' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : tool.type === 'paid'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                  }`}>
                    {t(`toolTypes.${tool.type}`)}
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 md:grid-cols-4">
                  <div>
                    <span className="font-medium">{t('results.successRate')}:</span> {tool.successRate}%
                  </div>
                  <div>
                    <span className="font-medium">{t('results.difficulty')}:</span> {t(`difficulty.${tool.difficulty}`)}
                  </div>
                  <div>
                    <span className="font-medium">{t('results.estimatedTime')}:</span> {tool.estimatedTime}m
                  </div>
                  {tool.cost && (
                    <div>
                      <span className="font-medium">{t('results.cost')}:</span> €{tool.cost}
                    </div>
                  )}
                </div>

                {tool.downloadUrl && (
                  <div className="mt-3">
                    <a
                      href={tool.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      {t('results.downloadTool')} →
                    </a>
                  </div>
                )}

                {/* Instrucciones resumidas */}
                <div className="mt-3">
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                      {t('results.showInstructions')}
                    </summary>
                    <div className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {tool.instructions.slice(0, 3).map((step, stepIndex) => (
                        <div key={stepIndex} className="border-l-2 border-gray-200 pl-3 dark:border-gray-600">
                          <div className="font-medium">
                            {step.stepNumber}. {step.title}
                          </div>
                          <div className="text-xs">{step.description}</div>
                        </div>
                      ))}
                      {tool.instructions.length > 3 && (
                        <div className="text-xs italic text-gray-500">
                          +{tool.instructions.length - 3} {t('results.moreSteps')}
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          <Button onClick={() => void resetAnalysis()} className="flex-1">
            {t('results.newAnalysis')}
          </Button>
          <Button onClick={downloadGuide} variant="outline" className="flex-1">
            {t('results.downloadGuide')}
          </Button>
        </div>
      </div>
    );
  };

  const renderError = (): JSX.Element => (
    <div className="space-y-6 text-center">
      <div className="text-red-600 dark:text-red-400">
        <h3 className="mb-2 text-xl font-semibold">{t('error.title')}</h3>
        <p>{t('error.description')}</p>
      </div>

      <Button onClick={() => void resetAnalysis()} className="w-full">
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
              <li>• {t('freeVersion.limitedAnalysis')}</li>
              <li>• {t('freeVersion.basicTools')}</li>
              <li>• {t('freeVersion.timeLimit', { minutes: Math.floor(freeCreditsSeconds / 60) })}</li>
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

        {/* Estados del componente */}
        {recoveryState.stage === 'setup' && renderSetupForm()}
        {recoveryState.stage === 'analyzing' && renderAnalyzing()}
        {recoveryState.stage === 'results' && renderResults()}
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

export { DeletedFilesRecovery as default };