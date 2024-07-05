'use client'

import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { Card } from "../ui/card";

export default function NewChat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", content: "Hello beautiful, how may I assist you?" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-screen pt-10 md:px-10"> {/* New container */}
      <div className="flex-1 h-full overflow-y-auto">
        {/* Message container */}
        <div className="flex flex-1 h-full flex-col overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex items-start ${
                message.sender === "bot" ? "justify-start" : "justify-end"
              }`}
            >
              <Card
                className="bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors focus:outline-none dark:bg-purple-500 border-none"
              >
                {message.content}
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Form positioned at the bottom */}
      <form className="flex items-center gap-4 mb-[5rem]">
        <Textarea
          placeholder="Type your message..."
          className="flex-1 rounded-lg px-4 py-2 bg-gray-200 focus:bg-white dark:bg-gray-700 dark:focus:bg-gray-600 max-md:w-[80%]"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <ImageIcon className="h-6 w-6 text-pink-500 dark:text-purple-500 overflow" />
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
        <Button
          type="submit"
          className="bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:bg-purple-500 dark:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-500"
        >
          Send
        </Button>
      </form>
    </div>
  );
}
