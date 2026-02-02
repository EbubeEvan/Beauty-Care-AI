import { streamText, generateId, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import dbConnect from "@/database/dbConnect";
import User, { IUser } from "@/database/models/user.model";
import ChatHistory from "@/database/models/chatHistory.model";
import type { UIMessage } from "@ai-sdk/react";
import { beautyProfileType } from "@/lib/types";
import { creditsUpdate } from "@/lib/utils";
import { auth } from "@/auth";

export const maxDuration = 60;

export async function POST(req: Request) {
  const body = await req.json();
  const { messages: uiMessages, id }: { messages: UIMessage[]; id: string } =
    body;

  const session = await auth();
  const email = session?.user?.email;

  console.log({ email, id });

  try {
    await dbConnect();

    // Convert UIMessages to model messages for the AI
    const messages = await convertToModelMessages(uiMessages);

    console.log({ messages });

    const user = await User.findOne<IUser>({ email: email });

    console.log({ user });

    const profile = user?.beautyProfile;

    if (!profile) {
      return new Response("User profile not found", { status: 404 });
    }

    const parsedProfile: beautyProfileType = profile;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system:
        `You are a licensed trichologist, dermatologist, and cosmetologist but you don't book consultations.` +
        `You are a beauty specialist with a wealth and depth of knowledge on all hair and skin types. ` +
        `You take a holistic approach in offering solutions to users and give product recommendations.` +
        `You are polite and warm.` +
        `Never answer prompts using tables` +
        `You only answer beauty-related prompts and politely decline other topics.` +
        `You give personalized advice to your clients based on their unique beauty profile.` +
        `The profile of this particular client is as follows: Hair color = ${parsedProfile.hairColor}, Hair Type = ${parsedProfile.hairType}, Strand Thickness = ${parsedProfile.strandThickness}, Chemical Treatment = ${parsedProfile.chemicalTreatment}, Hair Volume = ${parsedProfile.hairVolume}, Skin Color = ${parsedProfile.skinColor}, Skin Type = ${parsedProfile.skinType}, Sensitivity = ${parsedProfile.sensitivity}, Albino = ${parsedProfile.albino}. Use this information while responding to prompts.`,
      messages,
      temperature: 0,
      onFinish: async ({ usage, text }) => {
        console.log({ usage, text });

        // Create new assistant response in UIMessage format
        const newResponse: UIMessage = {
          id,
          role: "assistant",
          parts: [{ type: "text", text }],
        };

        // Extract title from first UI message (not the converted one)
        const firstMessage = uiMessages[0];
        const firstTextPart = firstMessage?.parts.find(
          (p) => p.type === "text",
        );
        const title =
          firstTextPart?.type === "text" ? firstTextPart.text : "New chat";

        const existingChat = await ChatHistory.findByChatId(id);

        if (!existingChat) {
          // Create new chat - use UIMessages, not converted messages
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
            await newChat.save();
            console.log("Chat saved!");
            creditsUpdate(email as string);
          } catch (err) {
            console.error("Error saving new chat:", err);
          }
        } else {
          // Update existing chat - use UIMessages, not converted messages
          try {
            const messagesToSave = [...uiMessages, newResponse];

            const updatedChat = await ChatHistory.findOneAndUpdate(
              { chatId: id },
              { messages: messagesToSave },
              { new: true },
            );

            if (!updatedChat) {
              console.error("Chat not found for update.");
            } else {
              console.log("Chat updated!");
              creditsUpdate(email as string);
            }
          } catch (err) {
            console.error("Error updating chat:", err);
          }
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
