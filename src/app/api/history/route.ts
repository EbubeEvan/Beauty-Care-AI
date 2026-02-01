import dbConnect from "@/database/dbConnect";
import ChatHistory from "@/database/models/chatHistory.model";
import { HistoryType, toUIMessage, type StoredMessage } from "@/lib/types";
import mongoose from "mongoose";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(
      JSON.stringify({ error: "User ID is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ error: "Invalid user ID" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(id);

    const historyDocs = await ChatHistory.find({
      userId: userObjectId,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!historyDocs?.length) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log({historyDocs});
    

    // Convert ObjectId fields to strings and normalize messages
    const parsedHistory: HistoryType[] = historyDocs.map((doc) => ({
      userId: String(doc.userId),
      chatId: String(doc.chatId),
      title: doc.title,
      // Ensure messages array exists and normalize each message to UIMessage format
      messages: (doc.messages || []).map((msg: any) => {
        // Cast to StoredMessage and normalize to UIMessage
        const storedMsg = msg as StoredMessage;
        return toUIMessage(storedMsg);
      }),
    }));

    console.log({parsedHistory});
    

    return new Response(JSON.stringify(parsedHistory), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Database error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}