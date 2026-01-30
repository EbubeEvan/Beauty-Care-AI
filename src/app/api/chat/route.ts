import { streamText, generateId, Message } from "ai";
import { google } from "@ai-sdk/google";
import dbConnect from "@/database/dbConnect";
import User, { IUser } from "@/database/models/user.model";
import ChatHistory, { IChatHistory } from "@/database/models/chatHistory.model";
import { beautyProfileType } from "@/lib/types";
import { Schema } from "mongoose";
import { creditsUpdate } from "@/lib/utils";
import { Types } from "mongoose";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, email, id } = await req.json();

  try {
    await dbConnect();

    console.log({ messages });

    const user = await User.findOne<IUser>({ email: email });

    const profile = user?.beautyProfile;

    if (!profile) {
      return new Response("User profile not found", { status: 404 });
    }

    const parsedProfile: beautyProfileType = profile;

    const result = streamText({
      model: google("models/gemini-1.5-flash"),
      system: `You are a licensed trichologist, dermatologist, and cosmetologist but you don't book consultations.` +
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

        const newResponse: Message = {
          content: text,
          createdAt: new Date(),
          id: generateId(7),
          role: "assistant",
        };

        // Check if there's an existing chat document for this ID
        const existingChat = await ChatHistory.findOne<IChatHistory>({
          chatId: id,
        });

        if (!existingChat) {
          // No existing chat, create a new one
          const newChat: IChatHistory = new ChatHistory({
            userId: user._id as Types.ObjectId,
            createdAt: new Date(),
            chatId: id,
            title: messages[0].content,
            messages: [
              {
                ...messages[0],
                id: generateId(7),
                createdAt: new Date(),
                content: messages[0].content,
              },
              { ...newResponse },
            ],
          });

          try {
            await newChat.save();
            console.log("Chat saved!");
            creditsUpdate(email);
          } catch (err) {
            console.error("Error saving new chat:", err);
          }
        } else {
          // Existing chat found, update it
          try {
            const updatedChat = await ChatHistory.findOneAndUpdate(
              { chatId: id },
              { messages: [...messages, newResponse] },
              { new: true }
            );

            if (!updatedChat) {
              console.error("Chat not found for update.");
            } else {
              console.log("Chat updated!");
              creditsUpdate(email);
            }
          } catch (err) {
            console.error("Error updating chat:", err);
          }
        }
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
