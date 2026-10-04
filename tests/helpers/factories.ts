import { Types } from 'mongoose';

import { beautyProfileDefault } from '@/lib/data';

export const testBeautyProfile = { ...beautyProfileDefault };

export function testUserInput(overrides: Record<string, unknown> = {}) {
  return {
    firstName: 'Jane',
    lastName: 'Doe',
    email: `jane.${Date.now()}.${Math.floor(Math.random() * 1e6)}@example.com`,
    password: 'password123',
    ...overrides,
  };
}

export function testUserDoc(overrides: Record<string, unknown> = {}) {
  return {
    firstName: 'Jane',
    lastName: 'Doe',
    email: `jane.${Date.now()}.${Math.floor(Math.random() * 1e6)}@example.com`,
    password: 'hashed-password',
    creditBalance: 20,
    beautyProfile: { ...testBeautyProfile },
    ...overrides,
  };
}

export function testChatDoc(
  userId: Types.ObjectId | string,
  overrides: Record<string, unknown> = {},
) {
  return {
    userId,
    chatId: `chat-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    title: 'Test chat',
    messages: [
      { id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] },
      { id: 'm2', role: 'assistant', parts: [{ type: 'text', text: 'Hi there' }] },
    ],
    ...overrides,
  };
}

export function testPriceDoc(overrides: Record<string, unknown> = {}) {
  return {
    credits: 50,
    p1: 5000,
    p2: 5,
    p3: 500,
    discount: 10,
    ...overrides,
  };
}
