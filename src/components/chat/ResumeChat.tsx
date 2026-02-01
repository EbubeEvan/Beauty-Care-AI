"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import useStore from "@/lib/store/useStore";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ChatMessages } from "./ChatMessages";
import { PromptInput } from "./PromptInput";

type ResumeChatProps = {
  email: string;
  id: string;
  chat: { messages: UIMessage[] } | null;
  userId?: string;
};

export default function ResumeChat({
  email,
  id,
  chat,
  userId,
}: Readonly<ResumeChatProps>) {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>();
  const [urls, setUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { newPrompt, credits, menuOpen } = useStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { messages, sendMessage, setMessages, error } = useChat<UIMessage>();

  /* ---------------- initial messages ---------------- */
  useEffect(() => {
    if (chat?.messages?.length) {
      setMessages(chat.messages);
    } else if (messages.length === 0 && newPrompt) {
      sendMessage(
        {
          role: "user",
          parts: [{ type: "text", text: newPrompt }],
        },
        { body: { email, id } }
      );
    }
  }, []);

  /* ---------------- cache invalidation ---------------- */
  useEffect(() => {
    if (messages.length === 2) {
      queryClient.invalidateQueries({ queryKey: ["history", userId] });
    }
    if (messages.length % 2 === 0) {
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    }
  }, [messages, queryClient, userId]);

  /* ---------------- handlers ---------------- */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setFiles(e.target.files);
    setUrls(Array.from(e.target.files).map((f) => URL.createObjectURL(f)));
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      return;
    }

    sendMessage(
      {
        role: "user",
        parts: [{ type: "text", text: input }],
      },
      { body: { email, id, files } }
    );

    setInput("");
    setFiles(undefined);
    setUrls([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col h-full pt-10">
      {/* Messages */}
      <ChatMessages messages={messages} />

      {/* Input */}
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

      {error && <p className="text-red-500 my-3">Uh oh. Something went wrong</p>}
    </div>
  );
}
