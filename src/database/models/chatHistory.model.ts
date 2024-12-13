import { Document, model, models, Schema } from "mongoose";
import { messageSchematype } from "@/lib/types";

export interface IChatHistory extends Document {
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  chatId: string;
  title: string;
  messages: messageSchematype[];
}

const messageSchema = new Schema<messageSchematype>({
  content: { type: String, required: true },
  createdAt: { type: Date, required: true },
  experimental_attachments: {
    type: [Schema.Types.Mixed],
    required: false,
  },
  id: { type: String, required: true },
  role: { type: String, enum: ["assistant", "user"], required: true },
});

const chatHistorySchema = new Schema<IChatHistory>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, required: true },
  chatId: { type: String, required: true },
  title: { type: String, required: true },
  messages: [messageSchema],
});

const ChatHistory =
  models.ChatHistory || model<IChatHistory>("ChatHistory", chatHistorySchema);
export default ChatHistory;
