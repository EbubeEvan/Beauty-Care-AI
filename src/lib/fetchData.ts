import dbConnect from "@/database/dbConnect";
import User, { IUser } from "@/database/models/user.model";
import ChatHistory, { IChatHistory } from "@/database/models/chatHistory.model";
import { chatType, toUIMessage, userType } from "@/lib/types";

/**
 * Fetch a chat by ID and convert stored messages
 * (including legacy with attachments) to UIMessage[].
 */
export const getChat = async (id: string): Promise<chatType | null> => {
  try {
    await dbConnect();

    const chat = await ChatHistory.findOne<IChatHistory>({ chatId: id });
    if (!chat) return null;

    // Convert Mongoose doc → plain object
    const raw = JSON.parse(JSON.stringify(chat)) as Omit<chatType, "messages"> & {
      messages: any[];
    };

    const parsedChat: chatType = {
      ...raw,
      messages: raw.messages.map((msg) => toUIMessage(msg)),
    };

    return parsedChat;
  } catch (error) {
    console.error("Failed to fetch chat:", error);
    throw new Error("Failed to fetch chat.");
  }
};

/**
 * Fetch a user by email from the database
 * and return a plain userType object.
 */
export const getUser = async (userEmail: string): Promise<userType | null> => {
  try {
    console.log("Attempting to fetch user:", userEmail);
    
    await dbConnect();

    const user = await User.findOne<IUser>({ email: userEmail });
    
    if (!user) {
      console.log("User not found");
      return null;
    }

    console.log("User found successfully");
    
    // Convert to plain object
    const plainUser = JSON.parse(JSON.stringify(user));
    
    // Add the id field (which is the same as _id)
    const parsedUser: userType = {
      ...plainUser,
      id: plainUser._id,
    };

    return parsedUser;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
};
