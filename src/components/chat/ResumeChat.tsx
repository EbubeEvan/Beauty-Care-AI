"use client";

import { useChat } from "ai/react";
import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { Input } from "../ui/input";
import { FlowerIcon, ImageIcon, CircleUser, Send } from "lucide-react";
import { Card } from "../ui/card";
import { cn, sanitizeMessage } from "@/lib/utils";
import useStore from "@/lib/store/useStore";
import { useQueryClient } from "@tanstack/react-query";
import { generateId, Message } from "ai";
import Image from "next/image";
import { chatType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function ResumeChat({
  email,
  id,
  chat,
  userId,
}: Readonly<{
  email: string;
  id: string;
  chat: chatType;
  userId?: string;
}>) {
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    append,
    handleSubmit,
    error,
  } = useChat({
    body: { email, id },
  });

  const { newPrompt, credits, menuOpen } = useStore();
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [urls, setUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialMessageAppended = useRef(false); // Prevent appending the message multiple times
  const { toast } = useToast();

  const newMessage: Message = {
    content: newPrompt!,
    createdAt: new Date(),
    id: generateId(7),
    role: "user",
  };

  // Use effect to handle chat initialization logic
  useEffect(() => {
    if (chat) {
      setMessages(chat?.messages);
    } else if (messages.length === 0 && !initialMessageAppended.current) {
      append(newMessage);
      initialMessageAppended.current = true; // Set the ref to true after first append
    }
  }, []);

  // Invalidate the query when there are exactly 2 messages
  useEffect(() => {
    if (messages.length === 2) {
      queryClient.invalidateQueries({ queryKey: ["history", userId] });
    }
    if (messages.length % 2 === 0) {
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    }
  }, [messages, queryClient, userId]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files);
    }

    const urlList = Array.from(event.target.files!).map((file) =>
      URL.createObjectURL(file)
    );
    setUrls(urlList);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!credits || credits <= 0) {
      toast({
        variant: "destructive",
        description: (
          <div>
            <h1 className="mb-3 text-xl">Oops. You&apos;re out of credits!</h1>
            <p>
              Click{" "}
              <Link
                href="/buy-credits"
                className="text-pink-500 dark:text-purple-500"
              >
                here
              </Link>{" "}
              to get more credits.
            </p>
          </div>
        ),
      });
      return; // Stop execution here
    }

    handleSubmit(event, {
      experimental_attachments: files,
    });

    setFiles(undefined);
    setUrls([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full pt-10">
      {/* New container */}
      <div className="h-full flex flex-col gap-10">
        {/* Message container */}
        <div className="flex h-full flex-col md:pr-20 md:pl-10 gap-y-5 w-full max-md:overflow-x-hidden overflow-y-auto mb-[10rem]">
          {messages.map((message) => (
            <>
              <div
                key={message.id}
                className={`mb-4 flex items-start  ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                {message.role === "assistant" && (
                  <FlowerIcon className="h-6 w-6 ml-[-2.1rem] text-pink-500 dark:text-purple-400 min-w-24" />
                )}
                <Card
                  className={`bg-gray-200 dark:bg-gray-700  px-6 py-3 text-[1.11rem] leading-8 font-medium shadow-sm transition-colors focus:outline-none border-none ${
                    message.role === "user" ? "mr-[-1.8rem]" : "ml-[-1.8rem]"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizeMessage(message.content),
                      }}
                    />
                  ) : (
                    message.content
                  )}
                </Card>
                {message.role === "user" && (
                  <CircleUser className="h-6 w-6 mr-[-2.1rem] text-pink-500 dark:text-purple-400 min-w-24" />
                )}
              </div>
              <div className="flex justify-end mb-3 gap-3">
                {message?.experimental_attachments?.map((attachment, index) => (
                  <Image
                    key={`${message.id}-${index}`}
                    src={attachment.url}
                    width={200}
                    height={200}
                    alt={attachment?.name || "uploaded image"}
                    priority={true}
                    className="rounded-lg"
                  />
                ))}
              </div>
            </>
          ))}
        </div>
      </div>
 
      {/* Form positioned at the bottom */}
      <div
        className={cn(
          "flex justify-center fixed bottom-0 -mb-20 md:ml-5 pb-8 transition-all duration-300",
          menuOpen ? "w-[85%] md:w-[70%]" : "w-[85%] md:w-[85%]"
        )}
      >
        <div className="flex flex-col w-full items-center py-2 mb-[5rem] px-8 md:px-10 rounded-full bg-gray-200 dark:bg-gray-700">
          {/* Selected Images */}
          <div className="flex gap-3 -mb-1">
            {urls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt="uploaded image"
                width={50}
                height={50}
              />
            ))}
          </div>
          {/* Form */}
          <form className="flex w-full items-center gap-4" onSubmit={submit}>
            <label htmlFor="image-upload" className="cursor-pointer">
              <ImageIcon className="h-6 w-6 text-pink-500 dark:text-purple-500 overflow" />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                multiple
                ref={fileInputRef}
              />
            </label>
            <Input
              placeholder="Type your message..."
              className="flex-1 rounded-lg px-4 bg-gray-200 dark:bg-gray-700 max-md:w-[80%] focus-visible:ring-transparent dark:focus-visible:ring-transparent text-[1.11rem]"
              value={input}
              onChange={handleInputChange}
            />
            {input && (
              <button type="submit">
                <Send className=" text-pink-500 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:text-purple-500 dark:hover:text-purple-500 dark:focus:ring-purple-500" />
              </button>
            )}
          </form>
        </div>
      </div>
      {error && (
        <p className="text-red-500 my-3">Uh oh. Something went wrong</p>
      )}
    </div>
  );
}
