'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Declaraciones de tipos para Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;

  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;

  start(): void;
  stop(): void;
  abort(): void;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

interface UseSpeechToTextReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

export function useSpeechToText(locale: 'es' | 'en' = 'es'): UseSpeechToTextReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Verificar soporte del navegador para Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
      } else {
        setIsSupported(false);
        setError('El navegador no soporta reconocimiento de voz');
      }
    }
  }, []);

  // Configurar reconocimiento de voz
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    // Configuración del reconocimiento
    recognition.continuous = false; // Parar automáticamente
    recognition.interimResults = true; // Mostrar resultados parciales
    recognition.maxAlternatives = 1;
    recognition.lang = locale === 'es' ? 'es-ES' : 'en-US';

    // Eventos del reconocimiento
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);

      let errorMessage = 'Error en el reconocimiento de voz';
      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          errorMessage = 'Permisos de micrófono denegados';
          break;
        case 'no-speech':
          errorMessage = 'No se detectó voz';
          break;
        case 'audio-capture':
          errorMessage = 'Error al capturar audio';
          break;
        case 'network':
          errorMessage = 'Error de conexión para reconocimiento';
          break;
        default:
          errorMessage = `Error: ${event.error}`;
      }

      setError(errorMessage);
    };

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [locale]);

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || isListening) return;

    setError(null);
    setTranscript('');

    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setError('Error al iniciar el reconocimiento de voz');
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || !isListening) return;

    try {
      recognition.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error,
  };
}
