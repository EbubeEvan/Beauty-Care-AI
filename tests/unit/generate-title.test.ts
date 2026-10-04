import { beforeEach, describe, expect, it, vi } from 'vitest';

const { generateTextMock } = vi.hoisted(() => ({ generateTextMock: vi.fn() }));

vi.mock('ai', () => ({ generateText: generateTextMock }));
vi.mock('@ai-sdk/google', () => ({ google: vi.fn((id: string) => id) }));

import { generateChatTitle } from '@/lib/generate-title';

describe('generateChatTitle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the LLM title, stripped and trimmed', async () => {
    generateTextMock.mockResolvedValue({ text: '"My Hair Routine"' });
    await expect(generateChatTitle('help with hair', 'use conditioner')).resolves.toBe(
      'My Hair Routine',
    );
  });

  it('truncates titles longer than 50 chars', async () => {
    generateTextMock.mockResolvedValue({ text: 'a'.repeat(60) });
    const title = await generateChatTitle('hi', 'hello');
    expect(title).toHaveLength(50);
    expect(title.endsWith('...')).toBe(true);
  });

  it('falls back to user message keywords when the LLM fails', async () => {
    generateTextMock.mockRejectedValue(new Error('LLM down'));
    await expect(
      generateChatTitle('one two three four five six seven eight', 'reply'),
    ).resolves.toBe('one two three four five six');
  });

  it('falls back to assistant message when user message is empty', async () => {
    generateTextMock.mockRejectedValue(new Error('LLM down'));
    await expect(generateChatTitle('', 'assistant answer here')).resolves.toBe(
      'assistant answer here',
    );
  });

  it('returns New Chat when everything is empty', async () => {
    generateTextMock.mockRejectedValue(new Error('LLM down'));
    await expect(generateChatTitle('', '')).resolves.toBe('New Chat');
  });
});
