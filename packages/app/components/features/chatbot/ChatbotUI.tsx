'use client';

import type { IChatConversation, IChatMessage } from '@brujula-cripto/types';

import { ChatbotHeader } from './ChatbotHeader';
import { ChatbotInputForm } from './ChatbotInputForm';
import { ChatbotMessageList } from './ChatbotMessageList';
import { ChatbotWelcomeScreen } from './ChatbotWelcomeScreen';
import { useChatInput } from './hooks/useChatInput';
import { useChatTranslations } from './hooks/useChatTranslations';

interface ChatbotUIProps {
  locale: 'es' | 'en';
  conversations?: IChatConversation[];
  isSubscribed?: boolean;
  onSendMessage?: (message: string) => Promise<void>;
  onStopGeneration?: () => void;
  className?: string;
}

/**
 * Renderiza el área de contenido principal del chatbot
 */
function ChatbotContentArea({
  currentMessages,
  isLoading,
  t,
  locale,
  suggestedQuestions,
  setInput,
  formatTimestamp,
  messagesEndRef,
}: {
  currentMessages: IChatMessage[];
  isLoading: boolean;
  t: (key: string) => string;
  locale: 'es' | 'en';
  suggestedQuestions: string[];
  setInput: (value: string) => void;
  formatTimestamp: (timestamp: Date, locale: 'es' | 'en') => string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}): JSX.Element {
  if (currentMessages.length === 0) {
    return (
      <ChatbotWelcomeScreen
        title={t('welcome.title') || '¡Hola! Soy Brújula'}
        description={
          t('welcome.description') ||
          'Tu asistente especializado en criptomonedas. Pregúntame lo que necesites saber.'
        }
        suggestedQuestions={suggestedQuestions}
        onQuestionClick={setInput}
      />
    );
  }

  return (
    <ChatbotMessageList
      messages={currentMessages}
      isLoading={isLoading}
      formatTimestamp={(timestamp) => formatTimestamp(timestamp, locale)}
      typingMessage={t('messages.typing') || 'Brújula está escribiendo...'}
      messagesEndRef={messagesEndRef}
      onMessageFeedback={async (messageId, rating) => {
        try {
          const response = await fetch('/api/chatbot/feedback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messageId,
              rating,
            }),
          });
          
          if (!response.ok) {
            throw new Error('Error enviando feedback');
          }
          
          console.log(`Feedback ${rating} enviado para mensaje ${messageId}`);
        } catch (error) {
          console.error('Error enviando feedback:', error);
        }
      }}
    />
  );
}

export function ChatbotUI({
  locale,
  conversations: _conversations = [],
  isSubscribed = false,
  onSendMessage,
  onStopGeneration,
  className = '',
}: ChatbotUIProps): JSX.Element {
  // Translations and text content
  const { t, tCommon, tMic, formatTimestamp, suggestedQuestions } = useChatTranslations();

  // Chat input and state management
  const {
    input,
    setInput,
    isLoading,
    isStreaming,
    currentMessages,
    inputRef,
    messagesEndRef,
    handleSubmit,
    handleStopGeneration,
    isListening,
    micSupported,
    transcript,
    micError,
    handleMicrophoneToggle,
  } = useChatInput({
    locale,
    onSendMessage,
    onStopGeneration,
  });

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <ChatbotHeader
          title="Brújula"
          subtitle={t('subtitle') || 'Tu asistente cripto especializado'}
        />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <ChatbotContentArea
            currentMessages={currentMessages}
            isLoading={isLoading}
            t={t}
            locale={locale}
            suggestedQuestions={suggestedQuestions}
            setInput={setInput}
            formatTimestamp={formatTimestamp}
            messagesEndRef={messagesEndRef}
          />
        </div>

        {/* Input Area */}
        <ChatbotInputForm
          isSubscribed={isSubscribed}
          freeLimit={
            t('freeLimit') ||
            'Modo gratuito: 10 mensajes por día. Suscríbete para acceso ilimitado.'
          }
          input={input}
          onInputChange={setInput}
          isListening={isListening}
          transcript={transcript}
          listeningPlaceholder={tMic('listening') || 'Escuchando...'}
          speechPlaceholder={tMic('speechPlaceholder') || 'Di algo...'}
          inputPlaceholder={t('input.placeholder') || 'Pregunta sobre criptomonedas...'}
          isLoading={isLoading}
          inputRef={inputRef}
          micSupported={micSupported}
          onMicrophoneToggle={handleMicrophoneToggle}
          micListeningTitle={tMic('stopListening') || 'Presiona para parar'}
          micStartTitle={tMic('startListening') || 'Presiona para hablar'}
          isStreaming={isStreaming}
          onStopGeneration={handleStopGeneration}
          onSubmit={handleSubmit}
          micError={micError}
          charactersText={tCommon('characters') || 'caracteres'}
          activateVoiceText={tMic('activateVoice') || 'Activa por voz'}
        />
      </div>
    </div>
  );
}
