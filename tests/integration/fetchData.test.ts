import axios from 'axios';
import { Types } from 'mongoose';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/headers', () => ({ headers: vi.fn(async () => new Headers()) }));
vi.mock('@/database/dbConnect', () => ({ default: vi.fn(async () => {}) }));

import ChatHistory from '@/database/models/chatHistory.model';
import Price from '@/database/models/price.model';
import User from '@/database/models/user.model';

import { clearDatabase, startInMemoryMongo, stopInMemoryMongo } from '../helpers/db';
import { testChatDoc, testPriceDoc, testUserDoc } from '../helpers/factories';

describe('fetchData (DB + HTTP integration)', () => {
  beforeAll(async () => {
    await startInMemoryMongo();
  }, 60000);

  afterAll(async () => {
    await stopInMemoryMongo();
  });

  beforeEach(async () => {
    await clearDatabase();
    vi.clearAllMocks();
  });

  it('getUser returns a parsed user and null when missing', async () => {
    const { getUser } = await import('@/lib/fetchData');
    const created = await User.create(testUserDoc({ email: 'fetch@example.com' }));
    void created;

    const user = await getUser('fetch@example.com');
    expect(user?.email).toBe('fetch@example.com');
    expect(user?.beautyProfile.hairColor).toBeTruthy();

    await expect(getUser('nobody@example.com')).resolves.toBeNull();
  });

  it('getUser fills beauty profile defaults when fields are absent', async () => {
    const { getUser } = await import('@/lib/fetchData');
    const created = await User.create(testUserDoc({ email: 'partial@example.com' }));
    await User.collection.updateOne({ _id: created._id }, { $set: { beautyProfile: {} } });
    const user = await getUser('partial@example.com');
    expect(user?.beautyProfile.skinType).toBe('');
  });

  it('getChat converts legacy messages and returns null when missing', async () => {
    const { getChat } = await import('@/lib/fetchData');
    const userId = new Types.ObjectId();
    const chatId = `chat-${Date.now()}`;
    await ChatHistory.create({
      userId,
      chatId,
      title: 'Legacy chat',
      messages: [
        {
          id: 'legacy-1',
          role: 'user',
          content: 'hello',
          createdAt: new Date(),
        },
      ],
    });

    const chat = await getChat(chatId);
    expect(chat?.chatId).toBe(chatId);
    expect(chat?.messages[0].parts[0]).toMatchObject({ type: 'text', text: 'hello' });

    await expect(getChat('does-not-exist')).resolves.toBeNull();
  });

  it('getPricesForCurrentRequest converts prices using geo + FX rate', async () => {
    process.env.EXCHANGE_RATE_KEY = 'test-key';
    await Price.create(testPriceDoc({ p1: 1000, p2: 1, p3: 100, credits: 20, discount: 5 }));

    const getSpy = vi.spyOn(axios, 'get');
    getSpy.mockResolvedValueOnce({ data: { currency: 'USD' } });
    getSpy.mockResolvedValueOnce({ data: { conversion_rates: { USD: 0.5 } } });

    const { getPricesForCurrentRequest } = await import('@/lib/fetchData');
    const result = await getPricesForCurrentRequest();
    expect(result.currency).toBe('USD');
    expect(result.prices[0].price).toBe(50); // p3 * 0.5
    getSpy.mockRestore();
    delete process.env.EXCHANGE_RATE_KEY;
  });

  it('getPricesForCurrentRequest throws without EXCHANGE_RATE_KEY', async () => {
    delete process.env.EXCHANGE_RATE_KEY;
    const { getPricesForCurrentRequest } = await import('@/lib/fetchData');
    await expect(getPricesForCurrentRequest()).rejects.toThrow('Missing EXCHANGE_RATE_KEY');
  });

  it('getChat surfaces a friendly error when the DB fails', async () => {
    const { getChat } = await import('@/lib/fetchData');
    const spy = vi.spyOn(ChatHistory, 'findOne').mockRejectedValueOnce(new Error('db down'));
    await expect(getChat('x')).rejects.toThrow('Failed to fetch chat.');
    spy.mockRestore();
    void testChatDoc;
  });
});
