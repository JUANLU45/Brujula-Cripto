'use client';

import type { IChatMessage } from '@brujula-cripto/types';

import { Card } from '@/components/ui/Card';

import { BrujulaIcon } from './ChatbotIcons';

interface ChatbotMessageListProps {
  messages: IChatMessage[];
  isLoading: boolean;
  formatTimestamp: (timestamp: Date) => string;
  typingMessage: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ChatbotMessageList({
  messages,
  isLoading,
  formatTimestamp,
  typingMessage,
  messagesEndRef,
}: ChatbotMessageListProps): JSX.Element {
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
                <BrujulaIcon className="h-5 w-5 text-white" />
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
              <div
                className={`mt-2 text-xs ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
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
                  {typingMessage}
                </span>
              </div>
            </Card>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
