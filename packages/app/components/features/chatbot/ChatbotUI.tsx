'use client';

import { useEffect, useRef, useState } from 'react';

import type { IChatConversation, IChatMessage } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSpeechToText } from '@/hooks/useSpeechToText';

// Iconos SVG inline para evitar dependencias externas - CUMPLE DOCUMENTACIÓN NAVBAR.TSX
const SendIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

const BrujulaIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 5-5v10zm2-10l5 5-5 5V7z" />
  </svg>
);

const StopIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
  </svg>
);

const MicrophoneIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
    />
  </svg>
);

const MicrophoneOffIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5.586 5.586l12.828 12.828M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l-10 10" />
  </svg>
);

interface ChatbotUIProps {
  locale: 'es' | 'en';
  conversations?: IChatConversation[];
  isSubscribed?: boolean;
  onSendMessage?: (message: string) => Promise<void>;
  onStopGeneration?: () => void;
  className?: string;
}

export function ChatbotUI({
  locale,
  conversations = [],
  isSubscribed = false,
  onSendMessage,
  onStopGeneration,
  className = '',
}: ChatbotUIProps): JSX.Element {
  const t = useTranslations('chatbot');
  const tCommon = useTranslations('common');
  const tMic = useTranslations('chatbot.microphone');

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentMessages, setCurrentMessages] = useState<IChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hook del micrófono
  const {
    isListening,
    isSupported: micSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error: micError,
  } = useSpeechToText(locale);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Manejar transcript del micrófono
  useEffect(() => {
    if (transcript && !isListening) {
      setInput(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, resetTranscript]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!input.trim() || isLoading || !onSendMessage) {
      return;
    }

    const message = input.trim();
    setInput('');
    setIsLoading(true);
    setIsStreaming(true);

    try {
      // Add user message immediately
      setCurrentMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'user',
          content: message,
          timestamp: new Date(),
        },
      ]);

      await onSendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleStopGeneration = (): void => {
    setIsStreaming(false);
    setIsLoading(false);
    onStopGeneration?.();
  };

  // Manejar micrófono
  const handleMicrophoneToggle = (): void => {
    if (isListening) {
      stopListening();
    } else {
      if (!micSupported) {
        alert(tMic('notSupported') || 'Tu navegador no soporta reconocimiento de voz');
        return;
      }
      startListening();
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  };

  const suggestedQuestions = [
    t('suggested.questions.0') || '¿Cómo funciona el análisis técnico en criptomonedas?',
    t('suggested.questions.1') || '¿Cuáles son las mejores prácticas de seguridad?',
    t('suggested.questions.2') || '¿Qué es DeFi y cómo empezar?',
    t('suggested.questions.3') || '¿Cómo interpretar gráficos de trading?',
  ];

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
              <BrujulaIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Brújula</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('subtitle') || 'Tu asistente cripto especializado'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentMessages.length === 0 ? (
            /* Welcome Screen */
            <div className="flex h-full flex-col items-center justify-center">
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600">
                <BrujulaIcon className="h-10 w-10 text-white" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                {t('welcome.title') || '¡Hola! Soy Brújula'}
              </h2>
              <p className="mb-8 max-w-md text-center text-gray-600 dark:text-gray-300">
                {t('welcome.description') ||
                  'Tu asistente especializado en criptomonedas. Pregúntame lo que necesites saber.'}
              </p>

              {/* Suggested Questions */}
              <div className="grid gap-3 md:grid-cols-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(question)}
                    className="max-w-xs text-left"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages List */
            <div className="space-y-6">
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex max-w-3xl gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        message.role === 'user'
                          ? 'bg-blue-600'
                          : 'bg-gradient-to-br from-blue-600 to-purple-600'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <span className="text-sm font-medium text-white">U</span>
                      ) : (
                        <BrujulaIcon className="h-5 w-5 text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <Card
                      className={`p-4 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800'
                      }`}
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {message.role === 'user' ? (
                          <p className="text-white">{message.content}</p>
                        ) : (
                          <div className="text-gray-900 dark:text-white">
                            <p>{message.content}</p>
                          </div>
                        )}
                      </div>
                      <div
                        className={`mt-2 text-xs ${
                          message.role === 'user'
                            ? 'text-blue-100'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </Card>
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex max-w-3xl gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                      <BrujulaIcon className="h-5 w-5 text-white" />
                    </div>
                    <Card className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600"></div>
                        <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600 delay-200"></div>
                        <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600 delay-500"></div>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          {t('messages.typing') || 'Brújula está escribiendo...'}
                        </span>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          {/* Subscription Notice */}
          {!isSubscribed && (
            <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm dark:bg-amber-900/20">
              <p className="text-amber-700 dark:text-amber-300">
                {t('freeLimit') ||
                  'Modo gratuito: 10 mensajes por día. Suscríbete para acceso ilimitado.'}
              </p>
            </div>
          )}

          <form onSubmit={(e) => void handleSubmit(e)} className="flex gap-3">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={isListening ? transcript || tMic('listening') || 'Escuchando...' : input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isListening
                    ? tMic('speechPlaceholder') || 'Di algo...'
                    : t('input.placeholder') || 'Pregunta sobre criptomonedas...'
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                disabled={isLoading}
                maxLength={500}
              />
            </div>

            {/* Botón de Micrófono */}
            {micSupported && (
              <Button
                type="button"
                onClick={handleMicrophoneToggle}
                variant={isListening ? 'default' : 'outline'}
                size="lg"
                className={`px-4 ${
                  isListening
                    ? 'animate-pulse bg-red-600 text-white hover:bg-red-700'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                disabled={isLoading}
                title={
                  isListening
                    ? tMic('stopListening') || 'Presiona para parar'
                    : tMic('startListening') || 'Presiona para hablar'
                }
              >
                {isListening ? (
                  <MicrophoneOffIcon className="h-5 w-5" />
                ) : (
                  <MicrophoneIcon className="h-5 w-5" />
                )}
              </Button>
            )}

            {isStreaming ? (
              <Button
                type="button"
                onClick={handleStopGeneration}
                variant="outline"
                size="lg"
                className="px-6"
              >
                <StopIcon className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                size="lg"
                className="px-6"
              >
                <SendIcon className="h-5 w-5" />
              </Button>
            )}
          </form>

          {/* Error del micrófono */}
          {micError && (
            <div className="mt-2 text-xs text-red-600 dark:text-red-400">{micError}</div>
          )}

          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {input.length}/500 {tCommon('characters') || 'caracteres'}
            {micSupported && !isListening && (
              <span className="ml-4">{tMic('activateVoice') || 'Activa por voz'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
