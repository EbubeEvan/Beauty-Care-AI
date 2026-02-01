"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { Input } from "../ui/input";
import { FlowerIcon, Send } from "lucide-react";
import { Card } from "../ui/card";
import { useRouter } from "next/navigation";
import { generateId } from "ai";
import useStore from "@/lib/store/useStore";
import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function NewChat({
  username,
}: Readonly<{
  username: string;
}>) {
  const newChatId = generateId();

  // v6: local input state (same pattern as ResumeChat)
  const [input, setInput] = useState("");

  const { setNewPrompt, credits, menuOpen } = useStore();
  const router = useRouter();
  const { toast } = useToast();

  // v6 useChat
  const { sendMessage, error } = useChat<UIMessage>();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
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
      return;
    }

    // Save prompt globally (same behavior you had)
    setNewPrompt(input);

    // v6 message shape
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: input }],
    });

    // Navigate to the new chat
    router.push(`/chat/${newChatId}`);
  };

  return (
    <div className="flex flex-col h-full pt-10">
      <div className="h-full flex flex-col gap-10">
        <div className="flex h-full flex-col md:pr-20 md:pl-10 gap-y-5 w-full max-md:overflow-x-hidden">
          <div className="mb-4 flex items-start gap-2">
            <FlowerIcon className="h-6 w-6 text-pink-500 dark:text-purple-400" />
            <Card className="bg-gray-200 dark:bg-gray-700 px-6 py-3 text-[1.11rem] font-medium">
              {`Hello ${username}, how may I assist you?`}
            </Card>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex justify-center fixed bottom-0 md:ml-5 pb-8 transition-all duration-300",
          menuOpen ? "w-[85%] md:w-[70%]" : "w-[85%] md:w-[85%]"
        )}
      >
        <div className="flex flex-col w-full items-center py-2 px-8 md:px-10 rounded-full bg-gray-200 dark:bg-gray-700">
          <form className="flex w-full items-center gap-4" onSubmit={submit}>
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-lg px-4 bg-gray-200 dark:bg-gray-700 text-[1.11rem]"
            />
            {input && (
              <button type="submit">
                <Send className="text-pink-500 dark:text-purple-500" />
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
