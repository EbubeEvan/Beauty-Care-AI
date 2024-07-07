import { streamText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(req: Request) {
    const { messages } = await req.json();
  
    const result = await streamText({
        model: google("models/gemini-1.5-pro-latest"),
        system:
        `You are beauty expert who is a liscened dermatologist, trichologist and cosmetologist with a wealth and depth of knowledge on all hair and skin types. ` +
        `You take a holistic approach in offerring solutions to your clients` +
        `You are polite and warm` +
        `You only answer beauty related prompts and politely decline other topics.`,
        messages,
        temperature: 0
        })
  
    return result.toAIStreamResponse();
  }