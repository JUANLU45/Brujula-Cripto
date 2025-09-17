'use client';

import { useEffect, useRef, useState } from 'react';

import type { IChatMessage } from '@brujula-cripto/types';

import { useSpeechToText } from '@/hooks/useSpeechToText';

interface UseChatInputProps {
  locale: 'es' | 'en';
  onSendMessage?: (message: string) => Promise<void>;
  onStopGeneration?: () => void;
}

interface UseChatInputReturn {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  isStreaming: boolean;
  currentMessages: IChatMessage[];
  setCurrentMessages: React.Dispatch<React.SetStateAction<IChatMessage[]>>;
  inputRef: React.RefObject<HTMLInputElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleStopGeneration: () => void;
  // Speech to text
  isListening: boolean;
  micSupported: boolean;
  transcript: string;
  micError: string | null;
  handleMicrophoneToggle: () => void;
}

export function useChatInput({
  locale,
  onSendMessage,
  onStopGeneration,
}: UseChatInputProps): UseChatInputReturn {
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
        alert('Tu navegador no soporta reconocimiento de voz');
        return;
      }
      startListening();
    }
  };

  return {
    input,
    setInput,
    isLoading,
    isStreaming,
    currentMessages,
    setCurrentMessages,
    inputRef,
    messagesEndRef,
    handleSubmit,
    handleStopGeneration,
    isListening,
    micSupported,
    transcript,
    micError,
    handleMicrophoneToggle,
  };
}
