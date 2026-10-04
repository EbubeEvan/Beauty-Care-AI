import { describe, expect, it } from 'vitest';

import { splitTextIntoChunks, stripMarkdownForTts } from '@/lib/tts';

describe('stripMarkdownForTts', () => {
  it('strips common markdown formatting', () => {
    expect(stripMarkdownForTts('**bold** and *italic*')).toBe('bold and italic');
    expect(stripMarkdownForTts('# Title\n> quote')).toBe('Title\nquote');
    expect(stripMarkdownForTts('[text](https://example.com)')).toBe('text');
    expect(stripMarkdownForTts('![alt](img.png)')).toBe('alt');
    expect(stripMarkdownForTts('`code`')).toBe('code');
    expect(stripMarkdownForTts('<b>html</b>')).toBe('html');
    expect(stripMarkdownForTts('- item')).toBe('item');
    expect(stripMarkdownForTts('1. item')).toBe('item');
  });

  it('keeps code block content but drops fences', () => {
    expect(stripMarkdownForTts('```js\nconst a = 1;\n```')).toBe('const a = 1;');
  });
});

describe('splitTextIntoChunks', () => {
  it('returns short text as a single chunk', () => {
    expect(splitTextIntoChunks('hello')).toEqual(['hello']);
  });

  it('splits long text into multiple chunks that rejoin losslessly', () => {
    const text = `${'Sentence one. '.repeat(500)}${'Sentence two! '.repeat(500)}`;
    const chunks = splitTextIntoChunks(text);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join('')).toBe(text);
    expect(chunks.every((c) => c.length <= 4500)).toBe(true);
  });
});
