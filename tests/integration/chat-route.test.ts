import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const { streamTextMock, convertMock } = vi.hoisted(() => ({
  streamTextMock: vi.fn(),
  convertMock: vi.fn(),
}));

vi.mock('ai', () => ({ convertToModelMessages: convertMock, streamText: streamTextMock }));
vi.mock('@ai-sdk/google', () => ({ google: vi.fn((id: string) => id) }));
vi.mock('@/lib/generate-title', () => ({ generateChatTitle: vi.fn(async () => 'Mock Title') }));
vi.mock('@/lib/utils', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/utils')>()),
  creditsUpdate: vi.fn(async () => {}),
}));
vi.mock('@/database/dbConnect', () => ({ default: vi.fn(async () => {}) }));

import User from '@/database/models/user.model';

import { clearDatabase, startInMemoryMongo, stopInMemoryMongo } from '../helpers/db';
import { testUserDoc } from '../helpers/factories';

const uiMessage = { id: 'u1', role: 'user', parts: [{ type: 'text', text: 'help my hair' }] };

function postRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/chat', () => {
  beforeAll(async () => {
    await startInMemoryMongo();
  }, 60000);

  afterAll(async () => {
    await stopInMemoryMongo();
  });

  beforeEach(async () => {
    await clearDatabase();
    vi.clearAllMocks();
    convertMock.mockResolvedValue([{ role: 'user', content: 'help my hair' }]);
    streamTextMock.mockReturnValue({ toUIMessageStreamResponse: () => new Response('streamed') });
  });

  it('returns 404 when the user profile is missing', async () => {
    const { POST } = await import('@/app/api/chat/route');
    const res = await POST(
      postRequest({ messages: [uiMessage], id: 'c1', email: 'ghost@example.com' }),
    );
    expect(res.status).toBe(404);
    expect(streamTextMock).not.toHaveBeenCalled();
  });

  it('streams a response for a known user', async () => {
    await User.create(testUserDoc({ email: 'chat@example.com' }));
    const { POST } = await import('@/app/api/chat/route');
    const res = await POST(
      postRequest({ messages: [uiMessage], id: 'c2', email: 'chat@example.com' }),
    );
    expect(res.status).toBe(200);
    expect(streamTextMock).toHaveBeenCalledOnce();
    expect(await res.text()).toBe('streamed');
  });

  it('returns 500 when conversion fails', async () => {
    convertMock.mockRejectedValueOnce(new Error('boom'));
    await User.create(testUserDoc({ email: 'chat2@example.com' }));
    const { POST } = await import('@/app/api/chat/route');
    const res = await POST(
      postRequest({ messages: [uiMessage], id: 'c3', email: 'chat2@example.com' }),
    );
    expect(res.status).toBe(500);
  });
});
