'use client';

import { type UIMessage, useChat } from '@ai-sdk/react';
import { generateId } from 'ai';
import { Flower } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComponentProps, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useUpload } from '@/hooks/useUpload';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import useStore from '@/lib/store/useStore';

import { PromptInput } from './PromptInput';

type PromptSubmitEvent = Parameters<NonNullable<ComponentProps<'form'>['onSubmit']>>[0];

export default function NewChat({
  username,
  userId,
}: Readonly<{ username: string; userId: string }>) {
  const [input, setInput] = useState('');

  const { setNewPrompt, setNewPromptAudio, credits, menuOpen } = useStore();
  const router = useRouter();
  const { error } = useChat<UIMessage>();
  const { uploadFile } = useUpload(userId);

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

  useEffect(() => {
    if (!voiceError) return;
    toast.error(voiceError || 'Voice recording failed');
  }, [voiceError]);

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
        const file = new File([blob], `voice-${Date.now()}.webm`, {
          type: blob.type || 'audio/webm',
        });
        const { url } = await uploadFile(file);
        setNewPrompt('');
        setNewPromptAudio(url);
        const newChatId = generateId();
        router.push(`/chat/${newChatId}`);
      } else if (!credits || credits <= 0) {
        toast.error("Oops. You're out of credits!");
      }
    } else {
      await start();
    }
  }, [isRecording, start, stop, credits, setNewPrompt, setNewPromptAudio, router, uploadFile]);

  return (
    <div className='flex h-full min-h-0 w-full flex-col items-center justify-center gap-6 px-4 pb-24 md:gap-7'>
      <Flower className='text-brand h-16 w-16 md:h-20 md:w-20' />
      <p className='text-text-main text-center text-xl font-semibold md:text-2xl'>
        {`Hello ${username}, how may I assist you?`}
      </p>

      <PromptInput
        input={input}
        setInput={setInput}
        onSubmit={submit}
        menuOpen={menuOpen}
        isRecording={isRecording}
        isVoiceSupported={isVoiceSupported}
        onToggleRecording={handleToggleRecording}
        centered
      />
    </div>
  );
}
