"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { Input } from "../ui/input";
import { FlowerIcon, ImageIcon, CircleUser, Send } from "lucide-react";
import { Card } from "../ui/card";
import { cn, sanitizeMessage } from "@/lib/utils";
import useStore from "@/lib/store/useStore";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { getMessageFileParts } from "@/lib/types";
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
  chat: { messages: any[] } | null;
  userId?: string;
}>) {
  // Use local state for text input
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [urls, setUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { newPrompt, credits, menuOpen } = useStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // useChat hook returns UIMessage[] and helpers
  const { messages, sendMessage, setMessages, error } = useChat<UIMessage>();

  console.log({messages});
  

  // On mount: populate initial messages (if any)
  useEffect(() => {
    if (chat?.messages?.length) {
      setMessages(chat.messages as UIMessage[]);
    } else if (messages.length === 0 && newPrompt) {
      // If no previous messages, start with a default prompt
      sendMessage(
        {
          role: "user",
          parts: [{ type: "text", text: newPrompt }],
        },
        {
          body: { email, id },
        }
      );
    }
  }, []);

  // Invalidate queries when messages change
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
      setUrls(Array.from(event.target.files).map((file) => URL.createObjectURL(file)));
    }
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
              <Link href="/buy-credits" className="text-pink-500 dark:text-purple-500">
                here
              </Link>{" "}
              to get more credits.
            </p>
          </div>
        ),
      });
      return;
    }

    // Send a new message with files + text
    sendMessage(
      {
        role: "user",
        parts: [{ type: "text", text: input }],
      },
      {
        body: { email, id, files },
      }
    );

    // Reset input and file UI
    setInput("");
    setUrls([]);
    setFiles(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  console.log({messages});
  

  return (
    <div className="flex flex-col h-full pt-10">
      <div className="h-full flex flex-col gap-10">
        <div className="flex h-full flex-col md:pr-20 md:pl-10 gap-y-5 w-full max-md:overflow-x-hidden overflow-y-auto mb-[10rem]">
          {messages.map((message, index) => (
            <div key={message.id ?? `message-${index}`}>
              <div
                className={`mb-4 flex items-start ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                {message.role === "assistant" && (
                  <FlowerIcon className="h-6 w-6 ml-[-2.1rem] text-pink-500 dark:text-purple-400" />
                )}
                <Card className="bg-gray-200 dark:bg-gray-700 px-6 py-3 text-[1.11rem]">
                  {message.parts.map((part, i) =>
                    part.type === "text" ? (
                      <div
                        key={i}
                        dangerouslySetInnerHTML={{
                          __html: sanitizeMessage(part.text),
                        }}
                      />
                    ) : null
                  )}
                </Card>
                {message.role === "user" && (
                  <CircleUser className="h-6 w-6 mr-[-2.1rem] text-pink-500 dark:text-purple-400" />
                )}
              </div>
              <div className="flex justify-end mb-3 gap-3">
                {getMessageFileParts(message).map((filePart, index) => (
                  <Image
                    key={`${message.id}-${index}`}
                    src={filePart.url}
                    width={200}
                    height={200}
                    alt={filePart.filename ?? filePart.mediaType ?? "uploaded file"}
                    className="rounded-lg"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "flex justify-center fixed bottom-0 -mb-20 md:ml-5 pb-8 transition-all duration-300",
          menuOpen ? "w-[85%] md:w-[70%]" : "w-[85%] md:w-[85%]"
        )}
      >
        <div className="flex flex-col w-full items-center py-2 mb-[5rem] px-8 md:px-10 rounded-full bg-gray-200 dark:bg-gray-700">
          <div className="flex gap-3 -mb-1">
            {urls.map((url, index) => (
              <Image key={index} src={url} alt="uploaded image" width={50} height={50} />
            ))}
          </div>

          <form className="flex w-full items-center gap-4" onSubmit={submit}>
            <label htmlFor="image-upload" className="cursor-pointer">
              <ImageIcon className="h-6 w-6 text-pink-500 dark:text-purple-500" />
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-lg px-4 bg-gray-200 dark:bg-gray-700"
            />

            {input && (
              <button type="submit">
                <Send className="text-pink-500 dark:text-purple-500" />
              </button>
            )}
          </form>
        </div>
      </div>

      {error && <p className="text-red-500 my-3">Uh oh. Something went wrong</p>}
    </div>
  );
}
