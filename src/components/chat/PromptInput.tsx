'use client';

import { ImageIcon, Mic, Send, Square, X } from 'lucide-react';
import Image from 'next/image';
import {
  ChangeEvent,
  ComponentProps,
  KeyboardEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import { cn } from '@/lib/utils';

import { Textarea } from '../ui/textarea';

type PromptInputProps = {
  input: string;
  setInput: (value: string) => void;
  onSubmit: NonNullable<ComponentProps<'form'>['onSubmit']>;
  menuOpen: boolean;

  onImageChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  fileInputRef?: RefObject<HTMLInputElement | null>;
  previewUrls?: string[];
  showImageUpload?: boolean;

  className?: string;
  onRemoveFile?: (index: number) => void;

  isRecording?: boolean;
  isVoiceSupported?: boolean;
  onToggleRecording?: () => void;
};

export function PromptInput({
  input,
  setInput,
  onSubmit,
  menuOpen,
  onImageChange,
  fileInputRef,
  previewUrls = [],
  showImageUpload = false,
  onRemoveFile,
  className,
  isRecording = false,
  isVoiceSupported = false,
  onToggleRecording,
}: Readonly<PromptInputProps>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = '0px';
    const nextHeight = Math.min(textarea.scrollHeight, 160);
    textarea.style.height = `${nextHeight}px`;
    setIsExpanded(nextHeight > 80);
  }, [input]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === 'Enter' && !event.shiftKey && input.trim()) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-8 transition-all duration-300 sm:px-6',
        menuOpen && 'md:inset-x-auto md:left-[32%] md:w-[68%] md:px-6 lg:left-[20%] lg:w-[80%]',
        className,
      )}
    >
      <div
        className={cn(
          'bg-brand-muted text-text-main flex w-full max-w-4xl flex-col justify-center rounded-4xl px-5 py-3 shadow-sm transition-[min-height] duration-200 md:px-6',
          isExpanded ? 'min-h-40' : 'min-h-20',
        )}
      >
        {/* Image previews */}
        {previewUrls.length > 0 && (
          <div className='mb-3 flex gap-3 self-start'>
            {previewUrls.map((url, index) => (
              <div className='relative flex gap-3' key={url}>
                <button
                  type='button'
                  onClick={() => onRemoveFile?.(index)}
                  className='absolute top-2 right-2 z-10 cursor-pointer rounded-full bg-black/70 p-1 transition hover:bg-black/90'
                >
                  <X className='h-4 w-4 text-white' />
                </button>
                <Image
                  src={url}
                  alt='uploaded image'
                  width={120}
                  height={120}
                  unoptimized
                  className='rounded-xl object-cover'
                />
              </div>
            ))}
          </div>
        )}

        <form className='flex w-full flex-nowrap items-end gap-4' onSubmit={onSubmit}>
          {showImageUpload && onImageChange && (
            <label htmlFor='image-upload' className='mb-2 shrink-0 cursor-pointer'>
              <ImageIcon className='text-text-main h-6 w-6' />
              <input
                id='image-upload'
                type='file'
                accept='image/*'
                multiple
                className='hidden'
                onChange={onImageChange}
                ref={fileInputRef}
              />
            </label>
          )}

          <Textarea
            placeholder={isRecording ? 'Listening...' : 'Type your message...'}
            ref={textareaRef}
            value={isRecording ? input || (typeof window !== 'undefined' ? '' : '') : input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isRecording}
            className='text-text-main placeholder:text-text-main/70 max-h-40 min-h-11 flex-1 resize-none overflow-y-auto rounded-3xl border-none bg-transparent px-1 py-2 text-[1.05rem] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-60 dark:bg-transparent'
          />

          {/* Voice recording button */}
          {mounted && isVoiceSupported && (
            <button
              type='button'
              onClick={onToggleRecording}
              className={`mb-2 shrink-0 rounded-full p-1.5 transition-colors ${
                isRecording
                  ? 'bg-brand animate-[pulse-mic_1.5s_ease-in-out_infinite] text-white'
                  : 'text-text-muted hover:text-text-main hover:bg-surface-muted'
              }`}
              title={isRecording ? 'Stop recording' : 'Voice input'}
            >
              {isRecording ? <Square className='h-5 w-5' /> : <Mic className='h-5 w-5' />}
            </button>
          )}

          {input && (
            <button type='submit' className='mb-2 shrink-0'>
              <Send className='text-text-main' />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
