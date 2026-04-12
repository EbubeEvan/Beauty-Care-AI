'use client';

import { UIMessage } from '@ai-sdk/react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

import { getMessageFileParts } from '@/lib/types';
import { sanitizeMessage } from '@/lib/utils';

import { Card } from '../ui/card';

export type ChatMessagesProps = {
  messages: UIMessage[];
};

export function ChatMessages({ messages }: Readonly<ChatMessagesProps>) {
  const isPending = messages.length % 2 !== 0;

  return (
    <div className='mx-auto mb-30 flex w-full max-w-4xl flex-1 flex-col gap-y-5 overflow-x-hidden overflow-y-auto px-2 md:px-6'>
      {messages.map((message) => (
        <div key={message.id}>
          <div
            className={`mb-4 flex items-start gap-2 ${
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
              {message.parts.map((part) =>
                part.type === 'text' ? (
                  <div
                    className='prose text-text-main dark:prose-invert max-w-none'
                    key={`${message.id}-${part.type}-${part.text.slice(0, 24)}`}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeMessage(part.text),
                    }}
                  />
                ) : null,
              )}
            </Card>
          </div>

          {/* Attached images */}
          <div className='mb-3 flex justify-end gap-3'>
            {getMessageFileParts(message).map((filePart, i) => (
              <Image
                key={`${message.id}-${i}`}
                src={filePart.url}
                width={400}
                height={400}
                alt={filePart.filename ?? filePart.mediaType ?? 'uploaded file'}
                className='rounded-lg'
              />
            ))}
          </div>
        </div>
      ))}

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
