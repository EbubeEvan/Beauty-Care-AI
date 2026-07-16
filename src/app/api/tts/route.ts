import { NextResponse } from 'next/server';

import { fetchTtsAudio, splitTextIntoChunks } from '@/lib/tts';

const UPSTREAM_TIMEOUT_MS = 30_000;

export async function POST(req: Request) {
  try {
    const { text } = (await req.json()) as { text: string };

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const chunks = splitTextIntoChunks(text);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

    try {
      const audioBuffers: { buffer: Buffer; contentType: string }[] = [];

      for (const chunk of chunks) {
        const result = await fetchTtsAudio(chunk, controller.signal);
        if (!result) {
          return NextResponse.json({ error: 'All TTS providers unavailable' }, { status: 503 });
        }
        audioBuffers.push(result);
      }

      const combined = Buffer.concat(audioBuffers.map((r) => r.buffer));
      const contentType = audioBuffers[0].contentType;

      return new NextResponse(new Uint8Array(combined), {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return NextResponse.json({ error: 'TTS request timed out' }, { status: 504 });
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error('TTS route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
