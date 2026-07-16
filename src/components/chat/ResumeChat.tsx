'use client';

import { type UIMessage, useChat } from '@ai-sdk/react';
import { useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, ComponentProps, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useUpload } from '@/hooks/useUpload';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import useStore from '@/lib/store/useStore';

import { ChatMessages } from './ChatMessages';
import { PromptInput } from './PromptInput';

type PromptSubmitEvent = Parameters<NonNullable<ComponentProps<'form'>['onSubmit']>>[0];

type ResumeChatProps = {
  email: string;
  id: string;
  chat: { messages: UIMessage[] } | null;
  userId?: string;
};

export default function ResumeChat({ email, id, chat, userId }: Readonly<ResumeChatProps>) {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [speakingLoadingId, setSpeakingLoadingId] = useState<string | null>(null);
  const lastInputWasVoiceRef = useRef(false);
  const pendingSpeakingMsgIdRef = useRef<string | null>(null);

  const { newPrompt, newPromptAudio, credits, menuOpen, setNewPrompt, setNewPromptAudio } =
    useStore();
  const queryClient = useQueryClient();
  const { uploadFile } = useUpload(userId ?? '');

  const { messages, sendMessage, setMessages, error } = useChat<UIMessage>({
    id,
  });

  const {
    isRecording,
    start,
    stop,
    error: voiceError,
    isSupported: isVoiceSupported,
  } = useVoiceRecorder();

  useEffect(() => {
    if (!error) return;
    toast.error(error.message || 'Uh oh. Something went wrong');
  }, [error]);

  useEffect(() => {
    if (!voiceError) return;
    toast.error(voiceError || 'Voice recording failed');
  }, [voiceError]);

  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    isLoading: _isTtsLoading,
    isSupported: isTtsSupported,
  } = useSpeechSynthesis({
    onStart: () => {
      if (pendingSpeakingMsgIdRef.current) {
        setSpeakingMessageId(pendingSpeakingMsgIdRef.current);
        setSpeakingLoadingId(null);
        pendingSpeakingMsgIdRef.current = null;
      }
    },
    onEnd: () => {
      setSpeakingMessageId(null);
      setSpeakingLoadingId(null);
    },
  });

  /* ---------------- voice toggle for messages ---------------- */
  const handleToggleVoice = useCallback(
    (messageId: string, text: string) => {
      if (isSpeaking && speakingMessageId === messageId) {
        stopSpeaking();
        setSpeakingMessageId(null);
        setSpeakingLoadingId(null);
      } else {
        pendingSpeakingMsgIdRef.current = messageId;
        setSpeakingLoadingId(messageId);
        speak(text);
      }
    },
    [isSpeaking, speakingMessageId, speak, stopSpeaking],
  );

  /* ---------------- initial messages ---------------- */
  const didInitRef = useRef(false);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    if (chat?.messages?.length) {
      setMessages(chat.messages);
      return;
    }

    if (newPrompt !== null || newPromptAudio !== null) {
      const promptToSend = newPrompt ?? '';
      const audioToSend = newPromptAudio;
      setNewPrompt('');
      setNewPromptAudio('');

      console.log({ chatId: id });

      const parts: Array<
        | { type: 'text'; text: string }
        | { type: 'file'; mediaType: string; filename?: string; url: string }
      > = [{ type: 'text', text: promptToSend }];

      if (audioToSend) {
        parts.push({
          type: 'file',
          mediaType: 'audio/webm',
          url: audioToSend,
        });
        lastInputWasVoiceRef.current = true;
      }

      sendMessage({ role: 'user', parts }, { body: { email } });
    }
  }, [
    chat?.messages,
    email,
    id,
    newPrompt,
    newPromptAudio,
    sendMessage,
    setMessages,
    setNewPrompt,
    setNewPromptAudio,
  ]);

  /* ---------------- auto-play AI response after voice input ---------------- */
  const lastPlayedMsgIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!lastInputWasVoiceRef.current) return;

    const lastMsg = messages.at(-1);
    if (lastMsg?.role !== 'assistant') return;
    if (lastPlayedMsgIdRef.current === lastMsg.id) return;

    const text = lastMsg.parts
      .filter((p) => p.type === 'text')
      .map((p) => p.text)
      .join(' ');

    if (!text || !isTtsSupported) return;

    // Debounce: reset on each message change, fire 800ms after last chunk
    const timer = setTimeout(() => {
      lastPlayedMsgIdRef.current = lastMsg.id;
      lastInputWasVoiceRef.current = false;
      pendingSpeakingMsgIdRef.current = lastMsg.id;
      setSpeakingLoadingId(lastMsg.id);
      speak(text);
    }, 800);

    return () => clearTimeout(timer);
  }, [messages, speak, isTtsSupported]);

  /* ---------------- cache invalidation ---------------- */
  useEffect(() => {
    if (messages.length === 2) {
      queryClient.invalidateQueries({ queryKey: ['history', userId] });
    }
    if (messages.length % 2 === 0) {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    }
  }, [messages, queryClient, userId]);

  /* ---------------- voice recording toggle ---------------- */
  const handleToggleRecording = useCallback(async () => {
    if (isRecording) {
      const blob = await stop();
      if (blob && credits > 0) {
        const file = new File([blob], `voice-${Date.now()}.webm`, {
          type: blob.type || 'audio/webm',
        });
        const { url } = await uploadFile(file);
        lastInputWasVoiceRef.current = true;
        sendMessage(
          {
            role: 'user',
            parts: [
              { type: 'text', text: '' },
              { type: 'file', mediaType: blob.type || 'audio/webm', url },
            ],
          },
          { body: { id, email } },
        );
      } else if (!credits || credits <= 0) {
        toast.error("Oops. You're out of credits!");
      }
    } else {
      await start();
    }
  }, [isRecording, start, stop, sendMessage, id, email, credits, uploadFile]);

  /* ---------------- handlers ---------------- */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    setFiles(filesArray);
    setUrls(filesArray.map((f) => URL.createObjectURL(f)));
  };

  const submit = async (e: PromptSubmitEvent) => {
    e.preventDefault();

    if (!credits || credits <= 0) {
      toast.error("Oops. You're out of credits!");
      return;
    }

    const parts: Array<
      | { type: 'text'; text: string }
      | { type: 'file'; mediaType: string; filename?: string; url: string }
    > = [{ type: 'text', text: input }];

    if (files.length > 0) {
      const fileParts = await Promise.all(
        files.map(async (file) => {
          const { url } = await uploadFile(file);
          return {
            type: 'file' as const,
            mediaType: file.type,
            filename: file.name,
            url,
          };
        }),
      );
      parts.push(...fileParts);
    }

    sendMessage({ role: 'user', parts }, { body: { id, email } });

    setInput('');
    setFiles([]);
    setUrls([]);
    lastInputWasVoiceRef.current = false;
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setUrls(urls.filter((_, i) => i !== index));
  };

  return (
    <div className='flex h-full min-h-0 w-full flex-col overflow-hidden pt-6'>
      <ChatMessages
        messages={messages}
        speakingMessageId={speakingMessageId}
        speakingLoadingId={speakingLoadingId}
        onToggleVoice={handleToggleVoice}
      />

      <section className='flex shrink-0 justify-center'>
        <PromptInput
          input={input}
          setInput={setInput}
          onSubmit={submit}
          menuOpen={menuOpen}
          showImageUpload
          onImageChange={handleImageChange}
          fileInputRef={fileInputRef}
          previewUrls={urls}
          onRemoveFile={handleRemoveFile}
          isRecording={isRecording}
          isVoiceSupported={isVoiceSupported}
          onToggleRecording={handleToggleRecording}
        />
      </section>
    </div>
  );
}
