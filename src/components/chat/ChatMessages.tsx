'use client';

import { UIMessage } from '@ai-sdk/react';
import { CircleUser, FlowerIcon, Loader2 } from 'lucide-react';
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
    <div className='mb-[10rem] flex w-full flex-1 flex-col gap-y-5 overflow-y-auto max-md:overflow-x-hidden md:pr-20 md:pl-10'>
      {messages.map((message) => (
        <div key={message.id}>
          <div
            className={`mb-4 flex items-start gap-2 ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            {message.role === 'assistant' && (
              <FlowerIcon className='ml-[-2.1rem] max-h-6 min-h-6 max-w-6 min-w-6 text-pink-500 dark:text-purple-400' />
            )}

            <Card className='bg-gray-200 px-6 py-3 text-[1.11rem] dark:bg-gray-700'>
              {message.parts.map((part, i) =>
                part.type === 'text' ? (
                  <div
                    className='prose dark:prose-invert'
                    key={i}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeMessage(part.text),
                    }}
                  />
                ) : null,
              )}
            </Card>

            {message.role === 'user' && (
              <CircleUser className='max-h-6 min-h-6 max-w-6 min-w-6 text-pink-500 dark:text-purple-400' />
            )}
          </div>

          {/* Attached images */}
          <div className='mb-3 flex justify-end gap-3'>
            {getMessageFileParts(message).map((filePart, i) => (
              <Image
                key={`${message.id}-${i}`}
                src={filePart.url}
                width={200}
                height={200}
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
          <FlowerIcon className='ml-[-2.1rem] max-h-6 min-h-6 max-w-6 min-w-6 text-pink-500 dark:text-purple-400' />
          <Card className='flex items-center gap-2 bg-gray-200 px-6 py-3 dark:bg-gray-700'>
            <Loader2 className='text-muted-foreground h-5 w-5 animate-spin' />
            <span className='text-muted-foreground text-sm italic'>Thinking...</span>
          </Card>
        </div>
      )}
    </div>
  );
}
