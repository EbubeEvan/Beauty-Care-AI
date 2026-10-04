/* eslint-disable jsx-a11y/aria-role -- `role` here is a MessageActions prop, not an ARIA role */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MessageActions } from '@/components/chat/MessageActions';

describe('MessageActions', () => {
  it('copies text to clipboard', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    render(<MessageActions text='hello' role='user' />);
    await user.click(screen.getByTitle('Copy message'));
    expect(writeText).toHaveBeenCalledWith('hello');
    expect(await screen.findByTitle('Copied!')).toBeInTheDocument();
  });

  it('shows voice controls only for assistants with a handler', () => {
    const { rerender } = render(<MessageActions text='hi' role='user' onToggleVoice={vi.fn()} />);
    expect(screen.queryByTitle('Read aloud')).not.toBeInTheDocument();

    rerender(<MessageActions text='hi' role='assistant' onToggleVoice={vi.fn()} />);
    expect(screen.getByTitle('Read aloud')).toBeInTheDocument();
  });

  it('reflects speaking and loading states', () => {
    const { rerender } = render(
      <MessageActions text='hi' role='assistant' isSpeaking onToggleVoice={vi.fn()} />,
    );
    expect(screen.getByTitle('Stop speaking')).toBeInTheDocument();

    rerender(<MessageActions text='hi' role='assistant' isLoading onToggleVoice={vi.fn()} />);
    const btn = screen.getByTitle('Loading audio...');
    expect(btn).toBeDisabled();
  });
});
