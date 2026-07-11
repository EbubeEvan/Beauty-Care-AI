'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { stripMarkdownForTts } from '@/lib/tts';

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
  const browserUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== 'undefined';

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
      }
      browserUtteranceRef.current = null;
    };
  }, []);

  const speakWithBrowser = useCallback(
    (text: string) => {
      const synth = window.speechSynthesis;
      if (!synth) return;

      // Cancel any ongoing speech
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Pick a female English voice if available
      const voices = synth.getVoices();
      const englishVoices = voices.filter((v) => v.lang.startsWith('en'));
      const femaleVoice = englishVoices.find((v) =>
        /samantha|karen|victoria|alice|zira|hazel|female|susan|moira|tessa|google.*female|fiona|kate|allison/i.test(
          v.name,
        ),
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      } else if (englishVoices.length > 0) {
        utterance.voice = englishVoices[0];
      }

      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsLoading(false);
        options?.onStart?.();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsLoading(false);
        browserUtteranceRef.current = null;
        options?.onEnd?.();
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsLoading(false);
        browserUtteranceRef.current = null;
        options?.onEnd?.();
      };

      browserUtteranceRef.current = utterance;
      synth.speak(utterance);
    },
    [options],
  );

  const speak = useCallback(
    async (text: string) => {
      if (!isSupported) return;

      // Stop any current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
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
          console.warn('TTS.ai failed, falling back to Web Speech API');
          speakWithBrowser(cleanText);
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
        console.error('TTS error, falling back to Web Speech API:', error);
        speakWithBrowser(cleanText);
      }
    },
    [isSupported, options, speakWithBrowser],
  );

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
      browserUtteranceRef.current = null;
    }
    setIsSpeaking(false);
    setIsLoading(false);
    options?.onEnd?.();
  }, [options]);

  return { speak, stop, isSpeaking, isLoading, isSupported };
}
