"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { FlowerIcon } from "lucide-react";
import { Card } from "../ui/card";
import { useRouter } from "next/navigation";
import { generateId } from "ai";
import useStore from "@/lib/store/useStore";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { PromptInput } from "./PromptInput";

export default function NewChat({ username }: Readonly<{ username: string }>) {
  const newChatId = generateId();
  const [input, setInput] = useState("");

  const { setNewPrompt, credits, menuOpen } = useStore();
  const router = useRouter();
  const { toast } = useToast();
  const { error } = useChat<UIMessage>();

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

    setNewPrompt(input);

    router.push(`/chat/${newChatId}`);
  };

  return (
    <div className="flex flex-col h-full pt-10">
      {/* greeting */}
      <div className="mb-4 flex items-start gap-2 md:pl-10">
        <FlowerIcon className="h-6 w-6 text-pink-500 dark:text-purple-400" />
        <Card className="bg-gray-200 dark:bg-gray-700 px-6 py-3 text-[1.11rem] font-medium">
          {`Hello ${username}, how may I assist you?`}
        </Card>
      </div>

      <PromptInput
        input={input}
        setInput={setInput}
        onSubmit={submit}
        menuOpen={menuOpen}
      />

      {error && (
        <p className="text-red-500 my-3">Uh oh. Something went wrong</p>
      )}
    </div>
  );
}
