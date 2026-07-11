'use client';

import { Check, Copy, Loader2, Volume2, VolumeX } from 'lucide-react';
import { useCallback, useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

interface MessageActionsProps {
  text: string;
  role: 'user' | 'assistant';
  isSpeaking?: boolean;
  isLoading?: boolean;
  onToggleVoice?: () => void;
}

export function MessageActions({
  text,
  role,
  isSpeaking = false,
  isLoading = false,
  onToggleVoice,
}: Readonly<MessageActionsProps>) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <div
      className={cn(
        'mt-1 flex items-center gap-1',
        role === 'user' ? 'justify-end' : 'justify-start',
      )}
    >
      {text.trim().length > 0 && (
        <Button
          variant='ghost'
          size='icon'
          onClick={handleCopy}
          className='text-text-muted hover:text-text-main h-7 w-7'
          title={copied ? 'Copied!' : 'Copy message'}
        >
          {copied ? <Check className='h-3.5 w-3.5' /> : <Copy className='h-3.5 w-3.5' />}
        </Button>
      )}

      {role === 'assistant' && onToggleVoice && (
        <Button
          variant='ghost'
          size='icon'
          onClick={onToggleVoice}
          disabled={isLoading}
          className={cn(
            'h-7 w-7',
            isSpeaking
              ? 'text-brand hover:text-brand-hover'
              : 'text-text-muted hover:text-text-main',
          )}
          title={isLoading ? 'Loading audio...' : isSpeaking ? 'Stop speaking' : 'Read aloud'}
        >
          {isLoading ? (
            <Loader2 className='h-3.5 w-3.5 animate-spin' />
          ) : isSpeaking ? (
            <VolumeX className='h-3.5 w-3.5' />
          ) : (
            <Volume2 className='h-3.5 w-3.5' />
          )}
        </Button>
      )}
    </div>
  );
}
