'use client';

import { type UIMessage, useChat } from '@ai-sdk/react';
import { generateId } from 'ai';
import { FlowerIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';

import useStore from '@/lib/store/useStore';

import { Card } from '../ui/card';
import { PromptInput } from './PromptInput';

export default function NewChat({ username }: Readonly<{ username: string }>) {
  const [input, setInput] = useState('');

  const { setNewPrompt, credits, menuOpen } = useStore();
  const router = useRouter();
  const { error } = useChat<UIMessage>();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!credits || credits <= 0) {
      toast.error("Oops. You're out of credits!");
      return;
    }

    setNewPrompt(input);
    const newChatId = generateId();
    console.log({ newChatId });

    router.push(`/chat/${newChatId}`);
  };

  return (
    <div className='flex h-full flex-col pt-10'>
      {/* greeting */}
      <div className='mb-4 flex items-start gap-2 md:pl-10'>
        <FlowerIcon className='h-6 w-6 text-pink-500 dark:text-purple-400' />
        <Card className='bg-gray-200 px-6 py-3 text-[1.11rem] font-medium dark:bg-gray-700'>
          {`Hello ${username}, how may I assist you?`}
        </Card>
      </div>

      <PromptInput input={input} setInput={setInput} onSubmit={submit} menuOpen={menuOpen} />

      {error && <p className='my-3 text-red-500'>Uh oh. Something went wrong</p>}
    </div>
  );
}
