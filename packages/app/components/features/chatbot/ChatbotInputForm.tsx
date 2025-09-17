'use client';

import { Button } from '@/components/ui/Button';

import { MicrophoneIcon, MicrophoneOffIcon, SendIcon, StopIcon } from './ChatbotIcons';

interface ChatbotInputFormProps {
  isSubscribed: boolean;
  freeLimit: string;
  input: string;
  onInputChange: (value: string) => void;
  isListening: boolean;
  transcript: string;
  listeningPlaceholder: string;
  speechPlaceholder: string;
  inputPlaceholder: string;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  micSupported: boolean;
  onMicrophoneToggle: () => void;
  micListeningTitle: string;
  micStartTitle: string;
  isStreaming: boolean;
  onStopGeneration: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  micError: string | null;
  charactersText: string;
  activateVoiceText: string;
}

function SubscriptionNotice({
  isSubscribed,
  freeLimit,
}: {
  isSubscribed: boolean;
  freeLimit: string;
}): JSX.Element | null {
  if (isSubscribed) {
    return null;
  }

  return (
    <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm dark:bg-amber-900/20">
      <p className="text-amber-700 dark:text-amber-300">{freeLimit}</p>
    </div>
  );
}

function MicrophoneButton({
  micSupported,
  isListening,
  onMicrophoneToggle,
  micListeningTitle,
  micStartTitle,
  isLoading,
}: {
  micSupported: boolean;
  isListening: boolean;
  onMicrophoneToggle: () => void;
  micListeningTitle: string;
  micStartTitle: string;
  isLoading: boolean;
}): JSX.Element | null {
  if (!micSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      onClick={onMicrophoneToggle}
      variant={isListening ? 'default' : 'outline'}
      size="lg"
      className={`px-4 ${
        isListening
          ? 'animate-pulse bg-red-600 text-white hover:bg-red-700'
          : 'border-gray-300 dark:border-gray-600'
      }`}
      disabled={isLoading}
      title={isListening ? micListeningTitle : micStartTitle}
    >
      {isListening ? (
        <MicrophoneOffIcon className="h-5 w-5" />
      ) : (
        <MicrophoneIcon className="h-5 w-5" />
      )}
    </Button>
  );
}

function ActionButton({
  isStreaming,
  onStopGeneration,
  input,
  isLoading,
}: {
  isStreaming: boolean;
  onStopGeneration: () => void;
  input: string;
  isLoading: boolean;
}): JSX.Element {
  if (isStreaming) {
    return (
      <Button type="button" onClick={onStopGeneration} variant="outline" size="lg" className="px-6">
        <StopIcon className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button type="submit" disabled={!input.trim() || isLoading} size="lg" className="px-6">
      <SendIcon className="h-5 w-5" />
    </Button>
  );
}

function InputFormFooter({
  micError,
  input,
  charactersText,
  micSupported,
  isListening,
  activateVoiceText,
}: {
  micError: string | null;
  input: string;
  charactersText: string;
  micSupported: boolean;
  isListening: boolean;
  activateVoiceText: string;
}): JSX.Element {
  return (
    <>
      {micError && <div className="mt-2 text-xs text-red-600 dark:text-red-400">{micError}</div>}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {input.length}/500 {charactersText}
        {micSupported && !isListening && <span className="ml-4">{activateVoiceText}</span>}
      </div>
    </>
  );
}

export function ChatbotInputForm({
  isSubscribed,
  freeLimit,
  input,
  onInputChange,
  isListening,
  transcript,
  listeningPlaceholder,
  speechPlaceholder,
  inputPlaceholder,
  isLoading,
  inputRef,
  micSupported,
  onMicrophoneToggle,
  micListeningTitle,
  micStartTitle,
  isStreaming,
  onStopGeneration,
  onSubmit,
  micError,
  charactersText,
  activateVoiceText,
}: ChatbotInputFormProps): JSX.Element {
  return (
    <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <SubscriptionNotice isSubscribed={isSubscribed} freeLimit={freeLimit} />

      <form onSubmit={(e) => void onSubmit(e)} className="flex gap-3">
        <div className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={isListening ? transcript || listeningPlaceholder : input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={isListening ? speechPlaceholder : inputPlaceholder}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            disabled={isLoading}
            maxLength={500}
          />
        </div>

        <MicrophoneButton
          micSupported={micSupported}
          isListening={isListening}
          onMicrophoneToggle={onMicrophoneToggle}
          micListeningTitle={micListeningTitle}
          micStartTitle={micStartTitle}
          isLoading={isLoading}
        />

        <ActionButton
          isStreaming={isStreaming}
          onStopGeneration={onStopGeneration}
          input={input}
          isLoading={isLoading}
        />
      </form>

      <InputFormFooter
        micError={micError}
        input={input}
        charactersText={charactersText}
        micSupported={micSupported}
        isListening={isListening}
        activateVoiceText={activateVoiceText}
      />
    </div>
  );
}
