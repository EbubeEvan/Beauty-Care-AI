'use client';

import { UIMessage } from '@ai-sdk/react';
import { Loader2, Mic } from 'lucide-react';
import Image from 'next/image';
import { useCallback } from 'react';

import { getMessageDisplayText, getMessageFileParts } from '@/lib/types';
import { cn, sanitizeMessage } from '@/lib/utils';

import { Card } from '../ui/card';
import { MessageActions } from './MessageActions';

export type ChatMessagesProps = {
  messages: UIMessage[];
  speakingMessageId?: string | null;
  speakingLoadingId?: string | null;
  onToggleVoice?: (messageId: string, text: string) => void;
};

export function ChatMessages({
  messages,
  speakingMessageId,
  speakingLoadingId,
  onToggleVoice,
}: Readonly<ChatMessagesProps>) {
  const isPending = messages.length % 2 !== 0;

  const handleToggleVoice = useCallback(
    (messageId: string, text: string) => {
      onToggleVoice?.(messageId, text);
    },
    [onToggleVoice],
  );

  return (
    <div className='mx-auto mb-30 flex w-full max-w-4xl flex-1 flex-col gap-y-5 overflow-x-hidden overflow-y-auto px-2 md:px-6'>
      {messages.map((message) => {
        const fileParts = getMessageFileParts(message);
        const audioParts = fileParts.filter((p) => p.mediaType.startsWith('audio/'));
        const imageParts = fileParts.filter((p) => p.mediaType.startsWith('image/'));

        const textParts = message.parts.filter(
          (part): part is { type: 'text'; text: string } =>
            part.type === 'text' && part.text.trim().length > 0,
        );

        return (
          <div key={message.id}>
            {textParts.length > 0 && (
              <div
                className={`mb-1 flex items-start gap-2 ${
                  message.role === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
              >
                <Card
                  className={`px-6 py-3 text-[1.11rem] ${
                    message.role === 'user'
                      ? 'bg-brand-muted text-text-main'
                      : 'bg-surface-muted text-text-main'
                  }`}
                >
                  {textParts.map((part) => (
                    <div
                      className='prose text-text-main dark:prose-invert max-w-none'
                      key={`${message.id}-${part.type}-${part.text.slice(0, 24)}`}
                      dangerouslySetInnerHTML={{
                        __html: sanitizeMessage(part.text),
                      }}
                    />
                  ))}
                </Card>
              </div>
            )}

            <MessageActions
              text={getMessageDisplayText(message)}
              role={message.role as 'user' | 'assistant'}
              isSpeaking={message.role === 'assistant' && speakingMessageId === message.id}
              isLoading={message.role === 'assistant' && speakingLoadingId === message.id}
              onToggleVoice={
                message.role === 'assistant' && onToggleVoice
                  ? () => handleToggleVoice(message.id, getMessageDisplayText(message))
                  : undefined
              }
            />

            {/* Voice message bubbles */}
            {audioParts.length > 0 && (
              <div
                className={cn(
                  'mb-2 flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start',
                )}
              >
                {audioParts.map((filePart, i) => (
                  <div
                    key={`${message.id}-audio-${i}`}
                    className={cn(
                      'flex items-center gap-2 rounded-2xl px-4 py-2',
                      message.role === 'user'
                        ? 'bg-brand/20 text-text-main'
                        : 'bg-surface-muted text-text-main',
                    )}
                  >
                    <Mic className='text-brand h-4 w-4 shrink-0' />
                    <audio controls src={filePart.url} className='h-8 w-48'>
                      <track kind='captions' />
                    </audio>
                  </div>
                ))}
              </div>
            )}

            {/* Attached images */}
            {imageParts.length > 0 && (
              <div className='mb-3 flex justify-end gap-3'>
                {imageParts.map((filePart, i) => (
                  <Image
                    key={`${message.id}-img-${i}`}
                    src={filePart.url}
                    width={400}
                    height={400}
                    alt={filePart.filename ?? filePart.mediaType ?? 'uploaded file'}
                    className='rounded-lg'
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* --- Loader Section --- */}
      {isPending && (
        <div className='mb-4 flex items-start justify-start gap-2'>
          <Card className='bg-surface-muted flex items-center gap-2 px-6 py-3'>
            <Loader2 className='text-text-muted h-5 w-5 animate-spin' />
            <span className='text-text-muted text-sm italic'>Thinking...</span>
          </Card>
        </div>
      )}
    </div>
  );
}
