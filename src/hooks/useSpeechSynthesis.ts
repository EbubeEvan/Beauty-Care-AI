'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { stripMarkdownForTts } from '@/lib/tts';

interface TtsErrorResponse {
  error?: string;
  retryAfter?: number;
}

interface UseSpeechSynthesisOptions {
  onStart?: () => void;
  onEnd?: () => void;
}

interface UseSpeechSynthesisReturn {
  speak: (text: string) => Promise<void>;
  stop: () => void;
  isSpeaking: boolean;
  isLoading: boolean;
  isSupported: boolean;
}

export function useSpeechSynthesis(options?: UseSpeechSynthesisOptions): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isSupported = typeof window !== 'undefined';

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const getErrorMessage = useCallback(async (response: Response): Promise<string> => {
    let errorData: TtsErrorResponse | null = null;

    try {
      errorData = (await response.json()) as TtsErrorResponse;
    } catch {
      errorData = null;
    }

    if (response.status === 429) {
      return errorData?.retryAfter
        ? `Voice playback is busy right now. Please try again in ${errorData.retryAfter} seconds.`
        : 'Voice playback is busy right now. Please try again later.';
    }

    if (response.status === 504) {
      return 'Voice playback took too long. Please try a shorter message.';
    }

    return errorData?.error || 'Could not play this message aloud. Please try again.';
  }, []);

  const speak = useCallback(
    async (text: string) => {
      if (!isSupported) return;

      // Stop any current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const cleanText = stripMarkdownForTts(text);
      if (!cleanText.trim()) return;

      setIsLoading(true);

      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleanText }),
        });

        if (!response.ok) {
          const message = await getErrorMessage(response);
          toast.error(message);
          console.error('TTS fetch failed:', response.status, message);
          return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          setIsLoading(false);
          URL.revokeObjectURL(url);
          audioRef.current = null;
          options?.onEnd?.();
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          setIsLoading(false);
          URL.revokeObjectURL(url);
          audioRef.current = null;
          toast.error('Could not play this audio. Please try again.');
          options?.onEnd?.();
        };

        await audio.play();

        // Only set speaking state after play() succeeds
        setIsSpeaking(true);
        setIsLoading(false);
        options?.onStart?.();
      } catch (error) {
        console.error('TTS error:', error);
        toast.error('Could not start voice playback. Please try again.');
        setIsSpeaking(false);
        setIsLoading(false);
      }
    },
    [getErrorMessage, isSupported, options],
  );

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
    setIsLoading(false);
    options?.onEnd?.();
  }, [options]);

  return { speak, stop, isSpeaking, isLoading, isSupported };
}
