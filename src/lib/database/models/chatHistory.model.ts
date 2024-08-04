import { Document, model, models, Schema } from 'mongoose';
import { messageSchematype } from '../../types';

export interface IChatHistory extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  messages: messageSchematype[];
}

const messageSchema = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, required: true },
  experimental_attachments: { type: String, required: false },
  id: { type: String, required: true },
  role: { type: String, enum: ["assistant", "user"], required: true },
});

const chatHistorySchema = new Schema<IChatHistory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  messages: [messageSchema],
});

const ChatHistory = models.ChatHistory || model<IChatHistory>('ChatHistory', chatHistorySchema);
export default ChatHistory;
