import { beforeEach, describe, expect, it } from 'vitest';

import useStore from '@/lib/store/useStore';

describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({
      id: '',
      newPrompt: null,
      newPromptAudio: null,
      first: false,
      menuOpen: false,
      messageCount: 0,
      credits: 0,
    });
  });

  it('has expected defaults', () => {
    const state = useStore.getState();
    expect(state.id).toBe('');
    expect(state.newPrompt).toBeNull();
    expect(state.credits).toBe(0);
    expect(state.messageCount).toBe(0);
  });

  it('updates each slice via setters', () => {
    const s = useStore.getState();
    s.setId('user-1');
    s.setNewPrompt('hello');
    s.setNewPromptAudio('audio-url');
    s.setFirst(true);
    s.setMenuOpen(true);
    s.setMessageCount(3);
    s.setCredits(42);

    const next = useStore.getState();
    expect(next.id).toBe('user-1');
    expect(next.newPrompt).toBe('hello');
    expect(next.newPromptAudio).toBe('audio-url');
    expect(next.first).toBe(true);
    expect(next.menuOpen).toBe(true);
    expect(next.messageCount).toBe(3);
    expect(next.credits).toBe(42);
  });
});
