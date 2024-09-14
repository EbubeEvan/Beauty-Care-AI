import { streamText, generateId } from "ai";
import { google } from "@ai-sdk/google";
import dbConnect from "@/lib/database/dbConnect";
import User, { IUser } from "@/lib/database/models/user.model";
import ChatHistory, {
  IChatHistory,
} from "@/lib/database/models/chatHistory.model";
import { beautyProfileType } from "@/lib/types";
import { Schema } from "mongoose";
import { revalidatePath } from "next/cache";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, email, id, newChatId } = await req.json();

  console.log({messages});
  

  try {
    await dbConnect();

    const user: IUser | null = await User.findOne({ email: email });

    const profile = user?.beautyProfile;

    if (!profile) {
      return new Response("User profile not found", { status: 404 });
    }

    const parsedProfile: beautyProfileType = profile;

    if (messages.length === 1) {
      const newChat: IChatHistory = new ChatHistory({
        userId: user._id as Schema.Types.ObjectId,
        createdAt: new Date(),
        chatId: newChatId,
        title: messages[0].content,
        messages: [{ ...messages[0], id: generateId(7), createdAt: new Date() }],
      });

      try {
        const savedChat = await newChat.save();
        if (savedChat) console.log("Chat saved!");

        // revalidatePath(`/chat/${newChatId}`);
      } catch (err) {
        console.error("Error saving new chat:", err);
      }
    }

    const result = await streamText({
      model: google("models/gemini-1.5-pro-latest"),
      system:
        `You are a licensed trichologist, dermatologist, and cosmetologist but you don't book consultations.` +
        `You are a beauty specialist with a wealth and depth of knowledge on all hair and skin types. ` +
        `You take a holistic approach in offering solutions to users and give product recommendations.` +
        `You are polite and warm.` +
        `You only answer beauty-related prompts and politely decline other topics.` +
        `You give personalized advice to your clients based on their unique beauty profile.` +
        `The profile of this particular client is as follows: Hair color = ${parsedProfile.hairColor}, Hair Type = ${parsedProfile.hairType}, Strand Thickness = ${parsedProfile.strandThickness}, Chemical Treatment = ${parsedProfile.chemicalTreatment}, Hair Volume = ${parsedProfile.hairVolume}, Skin Color = ${parsedProfile.skinColor}, Skin Type = ${parsedProfile.skinType}, Sensitivity = ${parsedProfile.sensitivity}, Albino = ${parsedProfile.albino}. Use this information while responding to prompts.`,
      messages,
      temperature: 0,
      onFinish: async ({ usage, text }) => {
        console.log(usage);

        const newResponse = {
          content: text,
          createdAt: new Date(),
          id: generateId(7),
          role: "assistant",
        };

        try {
          const updateChat = await ChatHistory.findOneAndUpdate(
            { chatId: id },
            { messages: [...messages, newResponse] },
            { new: true }
          );

          if (!updateChat) {
            console.error("Chat not found for update.");
            throw new Error("Chat not found");
          } else {
            console.log("Chat updated!");
            // revalidatePath(`/chat/${newChatId}`);
          }
        } catch (err) {
          console.error("Error updating chat:", err);
        }
      },
    });

    return result.toAIStreamResponse();
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
