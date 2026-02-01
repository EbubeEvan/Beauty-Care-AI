import { z } from "zod";
import type { UIMessage } from "@ai-sdk/react";
import type { UIDataTypes, UITools, UIMessagePart } from "ai";

/* ───────────── AUTH & FORMS ───────────── */

export interface LoginType {
  email: string;
  password: string;
}

export interface SignUpType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface selectProps {
  items: string[];
  id: string;
}

/* ───────────── SCHEMAS ───────────── */

export const signUpFormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z
    .string()
    .min(1)
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address",
    ),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1)
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address",
    ),
  password: z.string().min(6),
});

export const beautyProfileSchema = z.object({
  hairColor: z.string().min(1),
  hairType: z.string(),
  strandThickness: z.string(),
  chemicalTreatment: z.string(),
  hairVolume: z.string(),
  skinColor: z.string().min(1),
  skinType: z.string(),
  sensitivity: z.string(),
  albino: z.string(),
});

export interface beautyProfileType {
  hairColor: string;
  hairType: string;
  strandThickness: string;
  chemicalTreatment: string;
  hairVolume: string;
  skinColor: string;
  skinType: string;
  sensitivity: string;
  albino: string;
}

/* ───────────── AI CHAT MESSAGES ───────────── */

/**
 * Legacy attachment type from old schema
 */
export interface Attachment {
  name?: string;
  contentType?: string;
  url: string;
}

/**
 * Legacy message before v6
 */
export interface LegacyMessage {
  id: string;
  role: "assistant" | "user";
  experimental_attachments?: Attachment[];
  content: string;
  createdAt: Date;
}

/**
 * A message can be either UIMessage (v6) or legacy
 */
export type StoredMessage = UIMessage | LegacyMessage;

/**
 * Type guard for legacy messages
 */
export function isLegacyMessage(msg: StoredMessage): msg is LegacyMessage {
  return "content" in msg && !("parts" in msg);
}

/**
 * Convert a legacy message to UIMessage (v6),
 * including attachments → file parts
 */
export function transformLegacyMessageToUIMessage(
  msg: LegacyMessage,
): UIMessage {
  const parts: Array<UIMessagePart<UIDataTypes, UITools>> = [];

  // first the text
  parts.push({
    type: "text",
    text: msg.content,
  });

  // then attachments (if any): convert to v6 file parts
  if (msg.experimental_attachments) {
    for (const att of msg.experimental_attachments) {
      parts.push({
        type: "file",
        url: att.url,
        filename: att.name,
        mediaType: att.contentType || "",
      });
    }
  }

  return {
    id: msg.id,
    role: msg.role,
    parts,
    // UIMessage does not natively include createdAt in the type,
    // but you can attach it to metadata if you need timestamp:
    metadata: { createdAt: msg.createdAt },
  };
}

/**
 * Normalize any stored message to a UIMessage
 */
export function toUIMessage(msg: StoredMessage): UIMessage {
  return isLegacyMessage(msg) ? transformLegacyMessageToUIMessage(msg) : msg;
}

/**
 * Extract the display text (first text part)
 */
export function getMessageDisplayText(msg: StoredMessage): string {
  // if legacy, use content directly
  if (isLegacyMessage(msg)) return msg.content;

  const textPart = msg.parts.find(
    (p): p is UIMessagePart<UIDataTypes, UITools> & { type: "text" } =>
      p.type === "text",
  );
  return textPart?.text ?? "";
}

/**
 * Extract file parts (so you can show images/files in UI)
 */
export function getMessageFileParts(
  msg: UIMessage,
): Array<Extract<UIMessagePart<UIDataTypes, UITools>, { type: "file" }>> {
  return msg.parts.filter(
    (p): p is Extract<UIMessagePart<UIDataTypes, UITools>, { type: "file" }> =>
      p.type === "file",
  );
}

/* ───────────── CHAT TYPES ───────────── */

export interface chatType {
  userId: string;
  chatId: string;
  title: string;
  createdAt: Date;
  messages: UIMessage[];
}

export type HistoryMessage = LegacyMessage | UIMessage;

// Update in types.ts
export interface HistoryType {
  userId: string;
  chatId: string;
  title: string;
  messages: UIMessage[]; // Changed from HistoryMessage[]
}

/* ───────────── USER / PRICING ───────────── */

export interface userType {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  creditBalance: number;
  beautyProfile: beautyProfileType;
}

export interface priceType {
  _id: string;
  credits: number;
  p1: number;
  p2: number;
  p3: number;
  discount: number;
}

export interface FinalPriceType {
  id: string;
  credits: number;
  price: number;
  discount: number;
}

export interface PriceResponse {
  prices: FinalPriceType[];
  currency: string;
}

export interface CreditsResponse {
  credits: number;
}

export interface userReturn {
  id?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface beautyReturn {
  id?: string;
  message?: string;
  errors?: Record<string, string[]>;
}
