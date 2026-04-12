import axios from 'axios';
import { headers } from 'next/headers';

import dbConnect from '@/database/dbConnect';
import ChatHistory, { IChatHistory } from '@/database/models/chatHistory.model';
import Price, { IPrice } from '@/database/models/price.model';
import User, { IUser } from '@/database/models/user.model';
import {
  chatType,
  PriceResponse,
  priceType,
  serializeUIMessageForClient,
  type StoredMessage,
  toUIMessage,
  userType,
} from '@/lib/types';
import { priceConvert } from '@/lib/utils';

type LeanChatRecord = {
  userId: { toString(): string } | string;
  chatId: string;
  title: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  messages: StoredMessage[];
};

const toIsoString = (value?: Date | string): string | undefined => {
  if (!value) {
    return undefined;
  }

  return typeof value === 'string' ? value : value.toISOString();
};

/**
 * Fetch a chat by ID and convert stored messages
 * (including legacy with attachments) to UIMessage[].
 */
export const getChat = async (id: string): Promise<chatType | null> => {
  try {
    await dbConnect();

    const chat = await ChatHistory.findOne<IChatHistory>({ chatId: id }).lean();
    if (!chat) return null;

    const raw = chat as unknown as LeanChatRecord;

    const parsedChat: chatType = {
      userId: String(raw.userId),
      chatId: String(raw.chatId),
      title: raw.title,
      createdAt: toIsoString(raw.createdAt) || '',
      updatedAt: toIsoString(raw.updatedAt),
      messages: raw.messages.map((msg) => serializeUIMessageForClient(toUIMessage(msg))),
    };

    return parsedChat;
  } catch (error) {
    console.error('Failed to fetch chat:', error);
    throw new Error('Failed to fetch chat.');
  }
};

/**
 * Fetch a user by email from the database
 * and return a plain userType object.
 */
export const getUser = async (userEmail: string): Promise<userType | null> => {
  try {
    console.log('Attempting to fetch user:', userEmail);

    await dbConnect();

    const user = await User.findOne<IUser>({ email: userEmail }).lean();

    if (!user) {
      console.log('User not found');
      return null;
    }

    console.log('User found successfully');

    const parsedUser: userType = {
      _id: String(user._id),
      id: String(user._id),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      creditBalance: user.creditBalance,
      beautyProfile: {
        hairColor: user.beautyProfile?.hairColor || '',
        hairType: user.beautyProfile?.hairType || '',
        strandThickness: user.beautyProfile?.strandThickness || '',
        chemicalTreatment: user.beautyProfile?.chemicalTreatment || '',
        hairVolume: user.beautyProfile?.hairVolume || '',
        skinColor: user.beautyProfile?.skinColor || '',
        skinType: user.beautyProfile?.skinType || '',
        sensitivity: user.beautyProfile?.sensitivity || '',
        albino: user.beautyProfile?.albino || '',
      },
    };

    return parsedUser;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
};

export const getPricesForCurrentRequest = async (): Promise<PriceResponse> => {
  const exchangeKey = process.env.EXCHANGE_RATE_KEY;

  if (!exchangeKey) {
    throw new Error('Missing EXCHANGE_RATE_KEY');
  }

  const requestHeaders = await headers();
  const clientIp =
    requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    requestHeaders.get('x-real-ip')?.trim() ||
    '127.0.0.1';

  try {
    await dbConnect();

    const prices = await Price.find<IPrice>();
    const parsedPrices: priceType[] = prices.map((price) => ({
      _id: price._id.toString(),
      credits: price.credits,
      p1: price.p1,
      p2: price.p2,
      p3: price.p3,
      discount: price.discount,
    }));

    const { data: locationData } = await axios.get(`https://ipapi.co/${clientIp}/json/`);
    const currency = locationData.currency || 'NGN';

    const { data: exchangeData } = await axios.get(
      `https://v6.exchangerate-api.com/v6/${exchangeKey}/latest/NGN`,
    );
    const conversionRate = exchangeData.conversion_rates[currency] || 1;

    return {
      prices: priceConvert(parsedPrices, conversionRate),
      currency,
    };
  } catch (error) {
    console.error('Failed to fetch prices:', error);
    throw new Error('Failed to fetch pricing information');
  }
};
