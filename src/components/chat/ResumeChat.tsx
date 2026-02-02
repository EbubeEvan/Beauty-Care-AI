'use client';

import { type UIMessage, useChat } from '@ai-sdk/react';
import { useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import useStore from '@/lib/store/useStore';

import { ChatMessages } from './ChatMessages';
import { PromptInput } from './PromptInput';

type ResumeChatProps = {
  email: string;
  id: string;
  chat: { messages: UIMessage[] } | null;
  userId?: string;
};

export default function ResumeChat({ email, id, chat, userId }: Readonly<ResumeChatProps>) {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<FileList | undefined>();
  const [urls, setUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { newPrompt, credits, menuOpen, setNewPrompt } = useStore();
  const queryClient = useQueryClient();

  const { messages, sendMessage, setMessages, error } = useChat<UIMessage>({
    id,
  });

  /* ---------------- initial messages ---------------- */
  const didInitRef = useRef(false);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    if (chat?.messages?.length) {
      setMessages(chat.messages);
      return;
    }

    if (newPrompt) {
      const promptToSend = newPrompt;
      setNewPrompt('');

      console.log({ chatId: id });

      sendMessage(
        {
          role: 'user',
          parts: [{ type: 'text', text: promptToSend }],
        },
        { body: { email } },
      );
    }
  }, [chat?.messages, email, id, newPrompt, sendMessage, setMessages, setNewPrompt]);

  /* ---------------- cache invalidation ---------------- */
  useEffect(() => {
    if (messages.length === 2) {
      queryClient.invalidateQueries({ queryKey: ['history', userId] });
    }
    if (messages.length % 2 === 0) {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    }
  }, [messages, queryClient, userId]);

  /* ---------------- handlers ---------------- */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setFiles(e.target.files);
    setUrls(Array.from(e.target.files).map((f) => URL.createObjectURL(f)));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!credits || credits <= 0) {
      toast.error("Oops. You're out of credits!");
      return;
    }

    // Build message parts
    const parts: Array<
      | { type: 'text'; text: string }
      | { type: 'file'; mediaType: string; filename?: string; url: string }
    > = [{ type: 'text', text: input }];

    // Convert files to file parts using Data URLs
    if (files && files.length > 0) {
      const fileParts = await Promise.all(
        Array.from(files).map(async (file) => {
          // Convert file to Data URL
          const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });

          return {
            type: 'file' as const,
            mediaType: file.type,
            filename: file.name,
            url: dataUrl,
          };
        }),
      );

      parts.push(...fileParts);
    }

    sendMessage(
      {
        role: 'user',
        parts,
      },
      { body: { id, email } },
    );

    setInput('');
    setFiles(undefined);
    setUrls([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className='flex h-full flex-col pt-10'>
      {/* Messages */}
      <ChatMessages messages={messages} />

      <section className='flex justify-center'>
        <PromptInput
          input={input}
          setInput={setInput}
          onSubmit={submit}
          menuOpen={menuOpen}
          showImageUpload
          onImageChange={handleImageChange}
          fileInputRef={fileInputRef}
          previewUrls={urls}
        />
      </section>

      {/* Input */}

      {error && <p className='my-3 text-red-500'>Uh oh. Something went wrong</p>}
    </div>
  );
}
