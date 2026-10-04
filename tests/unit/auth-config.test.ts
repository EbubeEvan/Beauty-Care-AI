import { describe, expect, it } from 'vitest';

import { authConfig } from '@/auth.config';

describe('authConfig.authorized', () => {
  const callback = authConfig.callbacks!.authorized! as (args: {
    auth: { user?: object } | null;
    request: { nextUrl: URL; headers: Headers };
  }) => boolean | Response;

  const requestFor = (path: string, isServerAction = false) =>
    ({
      nextUrl: new URL(`http://localhost${path}`),
      headers: new Headers(isServerAction ? { 'next-action': 'abc' } : {}),
    }) as never;

  it('allows logged-in users on protected pages', () => {
    expect(callback({ auth: { user: {} }, request: requestFor('/chat') })).toBe(true);
  });

  it('blocks anonymous users on protected pages', () => {
    expect(callback({ auth: null, request: requestFor('/chat') })).toBe(false);
    expect(callback({ auth: null, request: requestFor('/buy-credits') })).toBe(false);
    expect(callback({ auth: null, request: requestFor('/profile') })).toBe(false);
  });

  it('redirects logged-in users away from public pages', () => {
    const result = callback({ auth: { user: {} }, request: requestFor('/') });
    expect(result).toBeInstanceOf(Response);
    expect([301, 302, 307, 308]).toContain((result as Response).status);
    expect((result as Response).headers.get('location')).toContain('/chat');
  });

  it('allows anonymous users on public pages', () => {
    expect(callback({ auth: null, request: requestFor('/') })).toBe(true);
  });

  it('lets server actions through without redirecting', () => {
    expect(callback({ auth: null, request: requestFor('/chat', true) })).toBe(true);
  });
});
