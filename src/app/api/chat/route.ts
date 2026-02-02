import { streamText, generateId, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import dbConnect from "@/database/dbConnect";
import User, { IUser } from "@/database/models/user.model";
import ChatHistory from "@/database/models/chatHistory.model";
import type { UIMessage } from "@ai-sdk/react";
import { beautyProfileType } from "@/lib/types";
import { creditsUpdate } from "@/lib/utils";

export const maxDuration = 60;

export async function POST(req: Request) {
  const body = await req.json();
  const {
    messages: uiMessages,
    id,
    email,
  }: { messages: UIMessage[]; id: string; email: string } = body;

  console.log("=== API RECEIVED ===");
  console.log("Chat ID:", id);
  console.log("Email:", email);
  console.log("Message count:", uiMessages.length);
  console.log("First message:", uiMessages[0]);

  try {
    await dbConnect();

    const messages = await convertToModelMessages(uiMessages);
    const user = await User.findOne<IUser>({ email: email });

    if (!user) {
      console.error("User not found for email:", email);
      return new Response("User not found", { status: 404 });
    }

    const profile = user?.beautyProfile;

    if (!profile) {
      return new Response("User profile not found", { status: 404 });
    }

    const parsedProfile: beautyProfileType = profile;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: `...`, // your system prompt
      messages,
      temperature: 0,
      onFinish: async ({ usage, text }) => {
        console.log("=== ONFINISH CALLBACK ===");
        console.log("Saving chat with ID:", id);
        console.log("Response text length:", text.length);

        const newResponse: UIMessage = {
          id: generateId(),
          role: "assistant",
          parts: [{ type: "text", text }],
        };

        const firstMessage = uiMessages[0];
        const firstTextPart = firstMessage?.parts.find(
          (p) => p.type === "text",
        );
        const title =
          firstTextPart?.type === "text" 
            ? firstTextPart.text.slice(0, 50) 
            : "New chat";

        console.log("Chat title:", title);

        const existingChat = await ChatHistory.findByChatId(id);
        console.log("Existing chat found:", !!existingChat);

        if (!existingChat) {
          const initialMessages = firstMessage
            ? [firstMessage, newResponse]
            : [newResponse];

          const newChat = new ChatHistory({
            userId: user._id,
            createdAt: new Date(),
            chatId: id,
            title,
            messages: initialMessages,
          });

          try {
            const savedChat = await newChat.save();
            console.log("✅ NEW CHAT SAVED");
            console.log("Saved chat ID:", savedChat.chatId);
            console.log("Saved messages count:", savedChat.messages.length);
            creditsUpdate(email as string);
          } catch (err) {
            console.error("❌ Error saving new chat:", err);
          }
        } else {
          try {
            const messagesToSave = [...uiMessages, newResponse];

            const updatedChat = await ChatHistory.findOneAndUpdate(
              { chatId: id },
              { messages: messagesToSave },
              { new: true },
            );

            if (!updatedChat) {
              console.error("❌ Chat not found for update with ID:", id);
            } else {
              console.log("✅ CHAT UPDATED");
              console.log("Updated messages count:", updatedChat.messages.length);
              creditsUpdate(email as string);
            }
          } catch (err) {
            console.error("❌ Error updating chat:", err);
          }
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("❌ API ERROR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
