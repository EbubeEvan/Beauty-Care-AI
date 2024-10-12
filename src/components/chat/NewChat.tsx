"use client";

import { useChat } from "ai/react";
import { Input } from "../ui/input";
import { FlowerIcon, Send } from "lucide-react";
import { Card } from "../ui/card";
import { useRouter } from "next/navigation";
import { generateId } from "ai";
import useStore from "@/lib/store/useStore";
import { FormEvent } from "react";

export default function NewChat({
  email,
  username,
}: {
  email: string;
  username: string;
}) {
  const newChatId = generateId(7);

  const { input, handleInputChange, error } = useChat({});
  const { setNewPrompt } = useStore();

  const router = useRouter();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewPrompt(input);
    
    router.push(`/chat/${newChatId}`);
  };

  return (
    <div className="flex flex-col h-screen pt-10">
      {/* New container */}

      <div className="flex-1 h-full overflow-y-auto flex flex-col gap-10">
        {/* Message container */}
        <div className="flex flex-1 h-full flex-col md:pr-20 md:pl-10 gap-y-5 w-full max-md:overflow-x-hidden">
          <div className="mb-4 flex items-start gap-2">
            <FlowerIcon className="h-6 w-6 text-pink-500 dark:text-purple-400" />
            <Card className="bg-gray-200 dark:bg-gray-700  px-6 py-3 text-[1.11rem] font-medium shadow-sm transition-colors focus:outline-none">
              {`Hello ${username}, how may I assist you?`}
            </Card>
          </div>
        </div>
      </div>

      {/* Form positioned at the bottom */}
      <div className="flex justify-center pt-5">
        <div className="flex flex-col w-[90%] items-center py-2 mb-[5rem] px-8 md:px-10 rounded-full bg-gray-200 dark:bg-gray-700 max-md:w-full">
          {/* Form */}
          <form className="flex w-full items-center gap-4" onSubmit={submit}>
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
      {error && <p className="text-red-500 my-3">{error.message}</p>}
    </div>
  );
}
