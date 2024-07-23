"use client";

import { useChat } from "ai/react";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { FlowerIcon, ImageIcon, CircleUser } from "lucide-react";
import { Card } from "../ui/card";
import { sanitizeMessage } from "@/lib/utils";

export default function NewChat() {
  const { messages, input, handleInputChange, handleSubmit, error } = useChat();

  return (
    <div className="flex flex-col h-screen pt-10">
      {/* New container */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col gap-10">
        {/* Message container */}
        <div className="flex flex-1 h-full flex-col md:pr-20 md:pl-10 gap-y-5 w-full">
          <div className="mb-4 flex items-start gap-2">
            <FlowerIcon className="h-6 w-6 text-pink-500 dark:text-purple-400" />
            <Card className="bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors focus:outline-none dark:bg-purple-500 border-none">
              Hello beautiful, how may I assist you?
            </Card>
          </div>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex items-start ${
                message.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              {message.role === "assistant" && (
                <FlowerIcon className="h-6 w-6 ml-[-2.1rem] text-pink-500 dark:text-purple-400 min-w-24" />
              )}
              <Card
                className={`bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors focus:outline-none dark:bg-purple-500 border-none ${
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
          ))}
        </div>
      </div>
      {/* Form positioned at the bottom */}
      <div className="flex justify-center">
        <form
          className="flex w-[90%] items-center gap-4 mb-[5rem] md:px-10 rounded-full bg-gray-200 dark:bg-gray-700 max-md:w-[20rem]"
          onSubmit={handleSubmit}
        >
          <label htmlFor="image-upload" className="cursor-pointer">
            <ImageIcon className="h-6 w-6 text-pink-500 dark:text-purple-500 overflow" />
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>
          <Input
            placeholder="Type your message..."
            className="flex-1 rounded-lg px-4 py-10 bg-gray-200 dark:bg-gray-700 max-md:w-[80%] focus-visible:ring-transparent dark:focus-visible:ring-transparent"
            value={input}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            className="bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:bg-purple-500 dark:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-500"
          >
            Send
          </Button>
        </form>
      </div>
      {error && <p className="text-red-500 my-3">{error.message}</p>}
    </div>
  );
}
