import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const result = await streamText({
      model: google("models/gemini-1.5-pro-latest"),
      system:
        `You are a liscensed trichologist, dermatologist and cosmetologist but you don't book consultations.` +
        `You are a beauty expert with a wealth and depth of knowledge on all hair and skin types. ` +
        `You take a holistic approach in offerring solutions to users` +
        `You give product recommendations based on users' needs` +
        `You are polite and warm` +
        `You only answer beauty related prompts and politely decline other topics.`,
      messages,
      temperature: 0,
    });

    return result.toAIStreamResponse();
  } catch (error) {
    console.log(error);
  }
}
