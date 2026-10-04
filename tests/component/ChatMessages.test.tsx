import type { UIMessage } from '@ai-sdk/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ChatMessages } from '@/components/chat/ChatMessages';

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element -- lightweight stub for jsdom tests
  default: (props: { alt: string; src: string }) => <img alt={props.alt} src={props.src} />,
}));

const textMessage = (id: string, role: 'user' | 'assistant', text: string): UIMessage =>
  ({
    id,
    role,
    parts: [{ type: 'text', text }],
  }) as unknown as UIMessage;

describe('ChatMessages', () => {
  it('renders user and assistant text', () => {
    render(
      <ChatMessages
        messages={[
          textMessage('u1', 'user', 'Hello'),
          textMessage('a1', 'assistant', '**Hi** there'),
        ]}
      />,
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi', { exact: false })).toBeInTheDocument();
  });

  it('shows Thinking loader when a reply is pending', () => {
    render(<ChatMessages messages={[textMessage('u1', 'user', 'Hello')]} />);
    expect(screen.getByText('Thinking...')).toBeInTheDocument();
  });

  it('hides loader when reply has arrived', () => {
    render(
      <ChatMessages
        messages={[textMessage('u1', 'user', 'Hi'), textMessage('a1', 'assistant', 'Hello')]}
      />,
    );
    expect(screen.queryByText('Thinking...')).not.toBeInTheDocument();
  });

  it('renders attached images and audio bubbles', () => {
    render(
      <ChatMessages
        messages={[
          {
            id: 'm1',
            role: 'user',
            parts: [
              { type: 'text', text: 'see files' },
              {
                type: 'file',
                url: 'https://cdn.example/pic.png',
                mediaType: 'image/png',
                filename: 'pic.png',
              },
              { type: 'file', url: 'https://cdn.example/voice.webm', mediaType: 'audio/webm' },
            ],
          } as unknown as UIMessage,
          textMessage('a1', 'assistant', 'Nice!'),
        ]}
      />,
    );
    expect(screen.getByAltText('pic.png')).toBeInTheDocument();
    expect(document.querySelector('audio')).toHaveAttribute(
      'src',
      'https://cdn.example/voice.webm',
    );
  });

  it('sanitizes malicious message HTML', () => {
    render(
      <ChatMessages
        messages={[
          textMessage('u1', 'user', '<img src=x onerror=alert(1)> Hello'),
          textMessage('a1', 'assistant', 'ok'),
        ]}
      />,
    );
    expect(document.querySelector('[onerror]')).toBeNull();
  });
});
