'use client';

import { ImageIcon, Send, X } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, FormEvent, RefObject } from 'react';

import { cn } from '@/lib/utils';

import { Input } from '../ui/input';

type PromptInputProps = {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  menuOpen: boolean;

  onImageChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  fileInputRef?: RefObject<HTMLInputElement | null>;
  previewUrls?: string[];
  showImageUpload?: boolean;

  className?: string;
  onRemoveFile?: (index: number) => void;
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
}: Readonly<PromptInputProps>) {
  return (
    <div
      className={cn(
        'fixed bottom-0 flex justify-center pb-8 transition-all duration-300 md:ml-5',
        menuOpen ? 'w-[85%] md:w-[70%]' : 'w-[85%] md:w-[85%]',
        className,
      )}
    >
      <div className='flex w-full flex-col items-center rounded-full bg-gray-200 px-8 py-2 pt-5 md:px-10 dark:bg-gray-700'>
        {/* Image previews */}
        {previewUrls.length > 0 && (
          <div className='mb-2 flex gap-3'>
            {previewUrls.map((url, index) => (
              <div className='flex gap-3' key={index}>
                <button
                  onClick={() => onRemoveFile?.(index)}
                  className='absolute top-2 z-10 cursor-pointer rounded-full bg-black/70 p-1 transition hover:bg-black/90'
                >
                  <X className='h-4 w-4 text-white' />
                </button>
                <Image
                  key={index}
                  src={url}
                  alt='uploaded image'
                  width={60}
                  height={60}
                  className='relative rounded-md'
                />
              </div>
            ))}
          </div>
        )}

        <form className='flex w-full items-center gap-4' onSubmit={onSubmit}>
          {showImageUpload && onImageChange && (
            <label htmlFor='image-upload' className='cursor-pointer'>
              <ImageIcon className='h-6 w-6 text-pink-500 dark:text-purple-500' />
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

          <Input
            placeholder='Type your message...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='flex-1 rounded-lg bg-gray-200 px-4 text-[1.11rem] focus-visible:ring-transparent dark:bg-gray-700 dark:focus-visible:ring-transparent'
          />

          {input && (
            <button type='submit'>
              <Send className='text-pink-500 dark:text-purple-500' />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
