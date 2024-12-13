import dbConnect from "@/database/dbConnect";
import User, { IUser } from "@/database/models/user.model";
import ChatHistory, { IChatHistory } from "@/database/models/chatHistory.model";
import { chatType, userType } from "./types";

export const getChat = async (id: string) => {
  try {
    dbConnect();
    const chat = await ChatHistory.findOne<IChatHistory>({ chatId: id });

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
    const user = await User.findOne<IUser>({ email: userEmail });

    const parsedUser: userType = JSON.parse(JSON.stringify(user));

    return parsedUser;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
};
