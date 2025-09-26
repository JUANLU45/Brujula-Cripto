'use client';

import Image from 'next/image';

import type { IChatMessage } from '@brujula-cripto/types';

import { Card } from '@/components/ui/Card';

interface ChatbotMessageListProps {
  messages: IChatMessage[];
  isLoading: boolean;
  formatTimestamp: (timestamp: Date) => string;
  typingMessage: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onMessageFeedback?: (messageId: string, rating: 'positive' | 'negative') => Promise<void>;
}

export function ChatbotMessageList({
  messages,
  isLoading,
  formatTimestamp,
  typingMessage,
  messagesEndRef,
  onMessageFeedback,
}: ChatbotMessageListProps): JSX.Element {

  const handleFeedback = async (messageId: string, rating: 'positive' | 'negative'): Promise<void> => {
    if (!onMessageFeedback) return;
    
    try {
      await onMessageFeedback(messageId, rating);
    } catch (error) {
      console.error('Error enviando feedback:', error);
    }
  };
  return (
    <div className="space-y-6">
      {messages.map((message) => (
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
                <Image
                  src="/images/chatbot/chatbot-logo.svg"
                  alt="Brújula"
                  width={76}
                  height={76}
                  className="h-20 w-20"
                />
              )}
            </div>

            {/* Message Content */}
            <Card
              className={`p-4 ${
                message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800'
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
              
              {/* Footer con timestamp y feedback para mensajes de IA */}
              <div className={`mt-2 flex items-center justify-between text-xs ${
                message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
              }`}>
                <div>
                  {formatTimestamp(message.timestamp)}
                </div>
                
                {/* Botones de feedback solo para mensajes de IA */}
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs">¿Útil?</span>
                    <button
                      onClick={() => handleFeedback(message.id, 'positive')}
                      className={`rounded-full p-1 transition-colors hover:bg-green-100 dark:hover:bg-green-900 ${
                        message.metadata?.feedback?.rating === 'positive' 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                          : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                      }`}
                      title="Respuesta útil"
                    >
                      👍
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, 'negative')}
                      className={`rounded-full p-1 transition-colors hover:bg-red-100 dark:hover:bg-red-900 ${
                        message.metadata?.feedback?.rating === 'negative'
                          ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                          : 'text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                      }`}
                      title="Respuesta no útil"
                    >
                      👎
                    </button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      ))}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex max-w-3xl gap-3">
            <Image
              src="/images/chatbot/chatbot-logo.svg"
              alt="Brújula"
              width={76}
              height={76}
              className="h-20 w-20"
            />
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600"></div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600 delay-200"></div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600 delay-500"></div>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {typingMessage}
                </span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* AI Disclaimer Footer */}
      <div className="mt-8 border-t border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">IA</span>
          </div>
          <p>
            <span className="font-medium">Aviso:</span> Las respuestas son generadas por IA y pueden contener errores. 
            Siempre verifica información importante de fuentes oficiales antes de tomar decisiones financieras.
          </p>
        </div>
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
}
