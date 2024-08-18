import dbConnect from "./database/dbConnect";
import User, { IUser } from "./database/models/user.model";
import ChatHistory, { IChatHistory } from "./database/models/chatHistory.model";
import { HistoryType, userType } from "./types";

export const fetchHistory = async (id: string): Promise<HistoryType[]> => {
  try {
    await dbConnect();

    const history = await ChatHistory.find<IChatHistory>({ userId: id }).sort({ createdAt: -1 });

    // Check if history is null or undefined
    if (!history || history.length === 0) {
      return []; // Return an empty array if no history found
    }

    const parsedHistory: HistoryType[] = JSON.parse(JSON.stringify(history));

    return parsedHistory;
  } catch (error : any) {
    if (error.message.includes('timed out')) {
      console.error('Database operation timed out:', error);
      // Handle timeout, e.g., return an empty array or display an error message
      return [];
    } else {
      console.log("Database error:", error);
      throw error; // Re-throw the error for proper error handling
    }
  }
};

export const getUser = async(userEmail: string): Promise<userType | null> => {
  try {
    dbConnect()
    const user : IUser | null =  await User.findOne({email : userEmail})

    const parsedUser : userType = JSON.parse(JSON.stringify(user))

    return parsedUser
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
};