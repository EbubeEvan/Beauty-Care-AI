const TTS_AI_API = 'https://api.tts.ai/v1/tts/';
const TTS_AI_RESULTS = 'https://api.tts.ai/v1/speech/results/';
const MAX_CHARS_PER_CHUNK = 4500;
const POLL_INTERVAL_MS = 800;
const MAX_POLL_ATTEMPTS = 15;

export function stripMarkdownForTts(text: string): string {
  let cleaned = text;

  // Code blocks (triple backticks) — keep content only
  cleaned = cleaned.replace(/```[\s\S]*?```/g, (match) => {
    const inner = match.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
    return inner.trim();
  });

  // Inline code
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // Images — keep alt text only
  cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');

  // Links — keep text only
  cleaned = cleaned.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

  // Bold + italic
  cleaned = cleaned.replace(/\*\*\*(.+?)\*\*\*/g, '$1');
  cleaned = cleaned.replace(/___(.+?)___/g, '$1');

  // Bold
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, '$1');
  cleaned = cleaned.replace(/__(.+?)__/g, '$1');

  // Italic
  cleaned = cleaned.replace(/\*(.+?)\*/g, '$1');
  cleaned = cleaned.replace(/_(.+?)_/g, '$1');

  // Strikethrough
  cleaned = cleaned.replace(/~~(.+?)~~/g, '$1');

  // Headers — remove # prefix
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

  // Blockquotes — remove > prefix
  cleaned = cleaned.replace(/^>\s+/gm, '');

  // Unordered list markers
  cleaned = cleaned.replace(/^[\s]*[-*+]\s+/gm, '');

  // Ordered list markers
  cleaned = cleaned.replace(/^[\s]*\d+\.\s+/gm, '');

  // Horizontal rules
  cleaned = cleaned.replace(/^[-*_]{3,}\s*$/gm, '');

  // HTML tags (fallback for any remaining)
  cleaned = cleaned.replace(/<[^>]+>/g, '');

  // Collapse multiple newlines into single
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Collapse multiple spaces
  cleaned = cleaned.replace(/ {2,}/g, ' ');

  return cleaned.trim();
}

export function splitTextIntoChunks(text: string): string[] {
  if (text.length <= MAX_CHARS_PER_CHUNK) {
    return [text];
  }

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= MAX_CHARS_PER_CHUNK) {
      chunks.push(remaining);
      break;
    }

    let splitIndex = -1;
    const searchRange = remaining.slice(0, MAX_CHARS_PER_CHUNK);

    for (const delimiter of ['. ', '! ', '? ', '.\n', '!\n', '?\n']) {
      const lastIndex = searchRange.lastIndexOf(delimiter);
      if (lastIndex > splitIndex) {
        splitIndex = lastIndex + delimiter.length;
      }
    }

    if (splitIndex <= 0) {
      splitIndex = MAX_CHARS_PER_CHUNK;
    }

    chunks.push(remaining.slice(0, splitIndex));
    remaining = remaining.slice(splitIndex);
  }

  return chunks;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadAudio(url: string, signal: AbortSignal): Promise<Buffer> {
  const audioResponse = await fetch(url, { signal });
  if (!audioResponse.ok) {
    throw new Error(`Failed to download audio: ${audioResponse.status}`);
  }
  const arrayBuffer = await audioResponse.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function pollForResult(
  uuid: string,
  apiKey: string | undefined,
  signal: AbortSignal,
): Promise<Buffer> {
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    await sleep(POLL_INTERVAL_MS);

    const pollResponse = await fetch(`${TTS_AI_RESULTS}?uuid=${uuid}`, {
      signal,
      headers,
    });

    if (!pollResponse.ok) {
      throw new Error(`Polling failed: ${pollResponse.status}`);
    }

    const result = (await pollResponse.json()) as {
      status?: string;
      result_url?: string;
      error?: string;
    };

    if (result.status === 'completed' && result.result_url) {
      return downloadAudio(result.result_url, signal);
    }

    if (result.status === 'failed') {
      throw new Error(result.error || 'TTS generation failed');
    }
  }

  throw new Error('TTS polling timed out');
}

export async function fetchTtsAudio(
  text: string,
  apiKey: string | undefined,
  signal: AbortSignal,
): Promise<Buffer> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch(TTS_AI_API, {
    method: 'POST',
    signal,
    headers,
    body: JSON.stringify({
      model: 'kokoro',
      text,
      voice: 'af_bella',
      format: 'mp3',
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('TTS.ai API error:', response.status, errorBody);
    throw new Error(`TTS request failed: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const data = (await response.json()) as {
      result_url?: string;
      uuid?: string;
      status?: string;
      error?: string;
    };

    if (data.error) {
      throw new Error(`TTS.ai error: ${data.error}`);
    }

    // Completed immediately (cached) — fetch result_url directly
    if (data.status === 'completed' && data.result_url) {
      return downloadAudio(data.result_url, signal);
    }

    // Queued — poll until completed
    if (data.uuid) {
      return pollForResult(data.uuid, apiKey, signal);
    }

    throw new Error('No result_url or uuid in TTS.ai response');
  }

  // Audio returned directly (fallback)
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
