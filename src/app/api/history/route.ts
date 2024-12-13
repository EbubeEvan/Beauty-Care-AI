import dbConnect from "@/database/dbConnect";
import ChatHistory, {
  IChatHistory,
} from "@/database/models/chatHistory.model";
import { HistoryType } from "@/lib/types";
import mongoose from "mongoose";

export async function GET(req: Request) {
  // Get the query parameters from the URL
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await dbConnect();

    const newId = new mongoose.Types.ObjectId(id); // Create a new ObjectId instance

    const history = await ChatHistory.find<IChatHistory>({
      userId: newId,
    }).sort({ createdAt: -1 });

    if (!history || history.length === 0) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const parsedHistory: HistoryType[] = JSON.parse(JSON.stringify(history));

    return new Response(JSON.stringify(parsedHistory), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (error.message.includes("timed out")) {
      console.error("Database operation timed out:", error);

      return new Response(
        JSON.stringify({ error: "Database operation timed out" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      console.error("Database error:", error);

      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}
