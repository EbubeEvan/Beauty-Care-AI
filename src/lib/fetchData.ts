import dbConnect from "./database/dbConnect";
import User, { IUser } from "./database/models/user.model";
import ChatHistory, { IChatHistory } from "./database/models/chatHistory.model";
import Price, { IPrice } from "./database/models/price.model";
import { chatType, HistoryType, userType, priceType } from "./types";
import mongoose from "mongoose";

export const fetchHistory = async (id: string): Promise<HistoryType[]> => {
  try {
    await dbConnect();

    const newId = new mongoose.Types.ObjectId(id); // Create a new ObjectId instance

    const history = await ChatHistory.find<IChatHistory>({
      userId: newId,
    }).sort({ createdAt: -1 });

    if (!history || history.length === 0) {
      return [];
    }

    const parsedHistory: HistoryType[] = JSON.parse(JSON.stringify(history));

    return parsedHistory;
  } catch (error: any) {
    if (error.message.includes("timed out")) {
      console.error("Database operation timed out:", error);
      return [];
    } else {
      console.log("Database error:", error);
      throw error; // Re-throw the error for proper error handling
    }
  }
};

export const getChat = async (id: string) => {
  try {
    dbConnect();
    const chat: IChatHistory | null = await ChatHistory.findOne({ chatId: id });

    const parsedChat: chatType = JSON.parse(JSON.stringify(chat));

    return parsedChat;
  } catch (error) {
    console.error("Failed to fetch chat:", error);
    throw new Error("Failed to fetch chat.");
  }
};

export const getUser = async (userEmail: string): Promise<userType | null> => {
  try {
    dbConnect();
    const user: IUser | null = await User.findOne({ email: userEmail });

    const parsedUser: userType = JSON.parse(JSON.stringify(user));

    return parsedUser;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
};

export const getPrices = async () => {
  try {
    await dbConnect();
    const prices: IPrice[] | null = await Price.find();

    const parsedPrices: priceType[] = JSON.parse(JSON.stringify(prices));
    
    return parsedPrices;
  } catch (error) {
    console.error("Failed to fetch prices:", error); // Updated error message for clarity
    throw new Error("Failed to fetch prices.");
  }
};
