"use client";

import { UIMessage } from "@ai-sdk/react";
import { FlowerIcon, CircleUser, Loader2 } from "lucide-react"; // Added Loader2
import { Card } from "../ui/card";
import Image from "next/image";
import { sanitizeMessage } from "@/lib/utils";
import { getMessageFileParts } from "@/lib/types";

export type ChatMessagesProps = {
  messages: UIMessage[];
};

export function ChatMessages({ messages }: Readonly<ChatMessagesProps>) {
  const isPending = messages.length % 2 !== 0;

  return (
    <div className="flex flex-1 flex-col md:pr-20 md:pl-10 gap-y-5 w-full max-md:overflow-x-hidden overflow-y-auto mb-[10rem]">
      {messages.map((message) => (
        <div key={message.id}>
          <div
            className={`mb-4 flex items-start ${
              message.role === "assistant" ? "justify-start" : "justify-end"
            }`}
          >
            {message.role === "assistant" && (
              <FlowerIcon className="max-h-6 max-w-6 min-h-6 min-w-6 ml-[-2.1rem] text-pink-500 dark:text-purple-400" />
            )}

            <Card className="bg-gray-200 dark:bg-gray-700 px-6 py-3 text-[1.11rem]">
              {message.parts.map((part, i) =>
                part.type === "text" ? (
                  <div
                    className="prose dark:prose-invert"
                    key={i}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeMessage(part.text),
                    }}
                  />
                ) : null,
              )}
            </Card>

            {message.role === "user" && (
              <CircleUser className="max-h-6 max-w-6 min-h-6 min-w-6 text-pink-500 dark:text-purple-400" />
            )}
          </div>

          {/* Attached images */}
          <div className="flex justify-end mb-3 gap-3">
            {getMessageFileParts(message).map((filePart, i) => (
              <Image
                key={`${message.id}-${i}`}
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

      {/* --- Loader Section --- */}
      {isPending && (
        <div className="flex items-start justify-start mb-4">
          <FlowerIcon className="max-h-6 max-w-6 min-h-6 min-w-6 ml-[-2.1rem] text-pink-500 dark:text-purple-400" />
          <Card className="bg-gray-200 dark:bg-gray-700 px-6 py-3 flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-sm italic text-muted-foreground">
              Thinking...
            </span>
          </Card>
        </div>
      )}
    </div>
  );
}
