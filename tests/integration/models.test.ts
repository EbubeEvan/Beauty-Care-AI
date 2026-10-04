import { Types } from 'mongoose';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import ChatHistory from '@/database/models/chatHistory.model';

import { clearDatabase, startInMemoryMongo, stopInMemoryMongo } from '../helpers/db';
import { testChatDoc } from '../helpers/factories';

describe('chatHistory model', () => {
  beforeAll(async () => {
    await startInMemoryMongo();
  }, 60000);

  afterAll(async () => {
    await stopInMemoryMongo();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  it('rejects messages with no content, parts, or attachments', async () => {
    const doc = new ChatHistory({
      userId: new Types.ObjectId(),
      chatId: `chat-${Date.now()}`,
      title: 'Empty',
      messages: [{ id: 'm1', role: 'user' }],
    });
    await expect(doc.validate()).rejects.toThrow(/content, parts/);
  });

  it('findByChatId / findByUserId sort and filter correctly', async () => {
    const userId = new Types.ObjectId();
    await ChatHistory.create(testChatDoc(userId, { chatId: `a-${Date.now()}`, title: 'A' }));
    await ChatHistory.create(testChatDoc(userId, { chatId: `b-${Date.now()}`, title: 'B' }));
    await ChatHistory.create(testChatDoc(new Types.ObjectId(), { chatId: `c-${Date.now()}` }));

    const mine = await ChatHistory.findByUserId(String(userId));
    expect(mine).toHaveLength(2);

    const one = await ChatHistory.findByChatId(mine[0].chatId);
    expect(one?.title).toBe(mine[0].title);
    expect(await ChatHistory.findByChatId('missing')).toBeNull();
  });

  it('addMessage appends and persists', async () => {
    const userId = new Types.ObjectId();
    const doc = await ChatHistory.create(testChatDoc(userId, { messages: [] }));
    await doc.addMessage({
      id: 'm-new',
      role: 'assistant',
      parts: [{ type: 'text', text: 'hello' }],
    } as never);
    expect((await ChatHistory.findByChatId(doc.chatId))!.messages).toHaveLength(1);
  });
});
