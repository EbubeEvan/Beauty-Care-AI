import {
  Document,
  model,
  models,
  Schema,
  Model,
  Types,
} from "mongoose";
import type { StoredMessage } from "@/lib/types";
import { UIMessagePart, UIDataTypes, UITools } from "ai";

/* ───────────── TYPES ───────────── */

export interface IMessageDoc {
  id: string;
  role: "system" | "assistant" | "user";
  content?: string;
  experimental_attachments?: {
    url: string;
    name?: string;
    contentType?: string;
  }[];
  parts?: UIMessagePart<UIDataTypes, UITools>[];
  metadata?: unknown;
}

export interface IChatHistory extends Document {
  userId: Types.ObjectId;
  chatId: string;
  title: string;
  messages: IMessageDoc[];
  createdAt: Date;
  updatedAt: Date;
  addMessage(message: StoredMessage): Promise<IChatHistory>;
}

export interface ChatHistoryModel extends Model<IChatHistory> {
  findByUserId(userId: string): Promise<IChatHistory[]>;
  findByChatId(chatId: string): Promise<IChatHistory | null>;
}

/* ───────────── SCHEMAS ───────────── */

const attachmentSchema = new Schema(
  {
    url: { type: String, required: true },
    name: { type: String },
    contentType: { type: String },
  },
  { _id: false }
);

const messageSchema = new Schema<IMessageDoc>(
  {
    id: { type: String, required: true },
    role: {
      type: String,
      enum: ["system", "assistant", "user"],
      required: true,
    },
    content: { type: String },
    experimental_attachments: {
      type: [attachmentSchema],
      required: false,
    },
    parts: { type: [Schema.Types.Mixed] },
    metadata: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

// Pre‑validate hook to enforce at least one non‑empty property
messageSchema.pre("validate", function (next) {
  const hasText = !!this.content;
  const hasParts = Array.isArray(this.parts) && this.parts.length > 0;
  const hasAttachments =
    Array.isArray(this.experimental_attachments) &&
    this.experimental_attachments.length > 0;

  if (!hasText && !hasParts && !hasAttachments) {
    const err = new Error(
      "A message must have content, parts, or experimental_attachments"
    );
    return next(err);
  }
  next();
});

const chatHistorySchema = new Schema<IChatHistory, ChatHistoryModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    chatId: {
      type: String,
      required: true,
      unique: true,
    },
    title: { type: String, required: true, trim: true },
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

chatHistorySchema.index({ userId: 1, createdAt: -1 });

chatHistorySchema.methods.addMessage = function (
  this: IChatHistory,
  message: StoredMessage
) {
  this.messages.push(message);
  return this.save();
};

chatHistorySchema.static(
  "findByUserId",
  function (this: ChatHistoryModel, userId: string) {
    return this.find({ userId }).sort({ createdAt: -1 });
  }
);

chatHistorySchema.static(
  "findByChatId",
  function (this: ChatHistoryModel, chatId: string) {
    return this.findOne({ chatId });
  }
);

const ChatHistory =
  (models.ChatHistory as ChatHistoryModel) ||
  model<IChatHistory, ChatHistoryModel>(
    "ChatHistory",
    chatHistorySchema
  );

export default ChatHistory;
