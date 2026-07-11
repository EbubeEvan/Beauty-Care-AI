'use client';

import { type UIMessage, useChat } from '@ai-sdk/react';
import { generateId } from 'ai';
import { useRouter } from 'next/navigation';
import { ComponentProps, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import useStore from '@/lib/store/useStore';

import { Card } from '../ui/card';
import { PromptInput } from './PromptInput';

type PromptSubmitEvent = Parameters<NonNullable<ComponentProps<'form'>['onSubmit']>>[0];

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

export default function NewChat({ username }: Readonly<{ username: string }>) {
  const [input, setInput] = useState('');

  const { setNewPrompt, setNewPromptAudio, credits, menuOpen } = useStore();
  const router = useRouter();
  const { error } = useChat<UIMessage>();

  const {
    isRecording,
    start,
    stop,
    error: voiceError,
    isSupported: isVoiceSupported,
  } = useVoiceRecorder();

  useEffect(() => {
    if (!error) {
      return;
    }

    toast.error(error.message || 'Uh oh. Something went wrong');
  }, [error]);

  const submit = (e: PromptSubmitEvent) => {
    e.preventDefault();

    if (!credits || credits <= 0) {
      toast.error("Oops. You're out of credits!");
      return;
    }

    setNewPrompt(input);
    setNewPromptAudio(null);
    const newChatId = generateId();
    console.log({ newChatId });

    router.push(`/chat/${newChatId}`);
  };

  const handleToggleRecording = useCallback(async () => {
    if (isRecording) {
      const blob = await stop();
      if (blob && credits > 0) {
        const dataUrl = await blobToDataUrl(blob);
        setNewPrompt('');
        setNewPromptAudio(dataUrl);
        const newChatId = generateId();
        router.push(`/chat/${newChatId}`);
      } else if (!credits || credits <= 0) {
        toast.error("Oops. You're out of credits!");
      }
    } else {
      await start();
    }
  }, [isRecording, start, stop, credits, setNewPrompt, setNewPromptAudio, router]);

  return (
    <div className='flex h-full min-h-0 w-full flex-col overflow-hidden pt-6'>
      {/* greeting */}
      <div className='mx-auto mb-4 flex w-full max-w-4xl items-start gap-2 px-2 md:px-6'>
        <Card className='bg-surface-muted px-6 py-3 text-[1.11rem] font-medium'>
          {`Hello ${username}, how may I assist you?`}
        </Card>
      </div>

      <PromptInput
        input={input}
        setInput={setInput}
        onSubmit={submit}
        menuOpen={menuOpen}
        isRecording={isRecording}
        isVoiceSupported={isVoiceSupported}
        onToggleRecording={handleToggleRecording}
        voiceError={voiceError}
      />
    </div>
  );
}
