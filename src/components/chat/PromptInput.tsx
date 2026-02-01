"use client";

import { FormEvent, ChangeEvent, RefObject } from "react";
import { Input } from "../ui/input";
import { Send, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
  className,
}: Readonly<PromptInputProps>) {
  return (
    <div
      className={cn(
        "flex justify-center fixed bottom-0 md:ml-5 pb-8 transition-all duration-300",
        menuOpen ? "w-[85%] md:w-[70%]" : "w-[85%] md:w-[85%]",
        className,
      )}
    >
      <div className="flex flex-col w-full items-center py-2 px-8 md:px-10 rounded-full bg-gray-200 dark:bg-gray-700">
        {/* Image previews */}
        {previewUrls.length > 0 && (
          <div className="flex gap-3 mb-2">
            {previewUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt="uploaded image"
                width={50}
                height={50}
                className="rounded-md"
              />
            ))}
          </div>
        )}

        <form className="flex w-full items-center gap-4" onSubmit={onSubmit}>
          {showImageUpload && onImageChange && (
            <label htmlFor="image-upload" className="cursor-pointer">
              <ImageIcon className="h-6 w-6 text-pink-500 dark:text-purple-500" />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onImageChange}
                ref={fileInputRef}
              />
            </label>
          )}

          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-lg px-4 bg-gray-200 dark:bg-gray-700 text-[1.11rem] focus-visible:ring-transparent dark:focus-visible:ring-transparent"
          />

          {input && (
            <button type="submit">
              <Send className="text-pink-500 dark:text-purple-500" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
