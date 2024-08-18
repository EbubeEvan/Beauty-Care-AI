import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import dbConnect from "@/lib/database/dbConnect";
import User from "@/lib/database/models/user.model";
import { beautyProfileType } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, email } = await req.json();

  try {
    await dbConnect();

    const profile = await User.findOne({ email: email }).select("beautyProfile");

    // Handle the case where no profile is found
    if (!profile || !profile.beautyProfile) {
      return new Response("User profile not found", { status: 404 });
    } else {
      console.log(profile);    
    }

    const parsedProfile: beautyProfileType = profile.beautyProfile;

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
    });

    return result.toAIStreamResponse();
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
