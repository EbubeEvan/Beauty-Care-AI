import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Auto-cleanup RTL between tests
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// jsdom lacks matchMedia (used by next-themes / radix). Provide a noop stub.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList) as typeof window.matchMedia;
}

// scrollTo / scrollIntoView stubs for chat scroll containers
if (!window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = () => {};
}
if (!window.HTMLElement.prototype.scrollTo) {
  window.HTMLElement.prototype.scrollTo = () => {};
}

// next/navigation is client-only; default mock so component tests don't crash.
// Individual tests can override with vi.mock factories of their own.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));
