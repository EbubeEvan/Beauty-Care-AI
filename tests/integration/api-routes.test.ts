import { Types } from 'mongoose';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/database/dbConnect', () => ({ default: vi.fn(async () => {}) }));
vi.mock('@/lib/r2', () => ({
  getPresignedUploadUrl: vi.fn(async () => ({
    uploadUrl: 'https://signed.example/x',
    key: 'uploads/u1/x.png',
  })),
  R2_PUBLIC_URL: 'https://cdn.example',
}));

import ChatHistory from '@/database/models/chatHistory.model';
import User from '@/database/models/user.model';

import { clearDatabase, startInMemoryMongo, stopInMemoryMongo } from '../helpers/db';
import { testChatDoc, testUserDoc } from '../helpers/factories';

describe('API routes (DB integration)', () => {
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

  it('GET /api/credits returns balances and validates input', async () => {
    const { GET } = await import('@/app/api/credits/route');
    await User.create(testUserDoc({ email: 'credits@example.com', creditBalance: 7 }));

    const ok = await GET(new Request('http://localhost/api/credits?email=credits@example.com'));
    expect(ok.status).toBe(200);
    expect(await ok.json()).toEqual({ credits: 7 });

    const missing = await GET(new Request('http://localhost/api/credits'));
    expect(missing.status).toBe(400);

    const unknown = await GET(new Request('http://localhost/api/credits?email=nope@example.com'));
    expect(unknown.status).toBe(404);
  });

  it('GET /api/history returns sidebar data and validates IDs', async () => {
    const { GET } = await import('@/app/api/history/route');
    const userId = new Types.ObjectId();
    await ChatHistory.create(testChatDoc(userId, { title: 'My chat' }));

    const ok = await GET(new Request(`http://localhost/api/history?id=${userId}`));
    expect(ok.status).toBe(200);
    const body = await ok.json();
    expect(body).toHaveLength(1);
    expect(body[0]).toMatchObject({ title: 'My chat', messages: [] });

    const noId = await GET(new Request('http://localhost/api/history'));
    expect(noId.status).toBe(400);

    const badId = await GET(new Request('http://localhost/api/history?id=not-an-id'));
    expect(badId.status).toBe(400);

    const empty = await GET(new Request(`http://localhost/api/history?id=${new Types.ObjectId()}`));
    expect(await empty.json()).toEqual([]);
  });

  it('POST /api/upload validates input and mints presigned URLs', async () => {
    const { POST } = await import('@/app/api/upload/route');

    const bad = await POST(
      new Request('http://localhost/api/upload', { method: 'POST', body: '{}' }),
    );
    expect(bad.status).toBe(400);

    const disallowed = await POST(
      new Request('http://localhost/api/upload', {
        method: 'POST',
        body: JSON.stringify({
          filename: 'a.exe',
          contentType: 'application/x-msdownload',
          userId: 'u1',
        }),
      }),
    );
    expect(disallowed.status).toBe(400);

    const ok = await POST(
      new Request('http://localhost/api/upload', {
        method: 'POST',
        body: JSON.stringify({ filename: 'photo.png', contentType: 'image/png', userId: 'u1' }),
      }),
    );
    expect(ok.status).toBe(200);
    expect(await ok.json()).toMatchObject({ key: expect.any(String) });
  });

  it('POST /api/tts requires text and handles provider outage', async () => {
    const tts = await import('@/lib/tts');
    const spy = vi.spyOn(tts, 'fetchTtsAudio').mockResolvedValue(null);
    const { POST } = await import('@/app/api/tts/route');

    const bad = await POST(new Request('http://localhost/api/tts', { method: 'POST', body: '{}' }));
    expect(bad.status).toBe(400);

    const unavailable = await POST(
      new Request('http://localhost/api/tts', {
        method: 'POST',
        body: JSON.stringify({ text: 'Hello world' }),
      }),
    );
    expect(unavailable.status).toBe(503);
    spy.mockRestore();
  });

  it('POST /api/tts returns audio when a provider succeeds', async () => {
    const tts = await import('@/lib/tts');
    const spy = vi
      .spyOn(tts, 'fetchTtsAudio')
      .mockResolvedValue({ buffer: Buffer.from([1, 2, 3]), contentType: 'audio/mpeg' });
    const { POST } = await import('@/app/api/tts/route');
    const res = await POST(
      new Request('http://localhost/api/tts', {
        method: 'POST',
        body: JSON.stringify({ text: 'Hello world' }),
      }),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('audio/mpeg');
    spy.mockRestore();
  });
});
