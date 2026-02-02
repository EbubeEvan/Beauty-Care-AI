"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import useStore from "@/lib/store/useStore";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ChatMessages } from "./ChatMessages";
import { PromptInput } from "./PromptInput";
import { useParams } from "next/navigation";

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

  const { newPrompt, credits, menuOpen , setNewPrompt} = useStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const params = useParams<{ id: string }>();

  const { messages, sendMessage, setMessages, error } = useChat<UIMessage>();

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
    setNewPrompt("");

    sendMessage(
      {
        role: "user",
        parts: [{ type: "text", text: promptToSend }],
      },
      { body: { id: params.id, email } }
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

  const submit = async (e: FormEvent<HTMLFormElement>) => {
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

    // Build message parts
    const parts: Array<{ type: "text"; text: string } | { type: "file"; mediaType: string; filename?: string; url: string }> = [
      { type: "text", text: input }
    ];

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
            type: "file" as const,
            mediaType: file.type,
            filename: file.name,
            url: dataUrl,
          };
        })
      );

      parts.push(...fileParts);
    }

    sendMessage(
      {
        role: "user",
        parts,
      },
      { body: { id , email} }
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