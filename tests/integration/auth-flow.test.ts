import bcrypt from 'bcrypt';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/database/dbConnect', () => ({ default: vi.fn(async () => {}) }));
vi.mock('@/auth', () => ({ signIn: vi.fn(), signOut: vi.fn() }));
vi.mock('next-auth', () => ({ AuthError: class AuthError extends Error {} }));

import { clearDatabase, startInMemoryMongo, stopInMemoryMongo } from '../helpers/db';
import { testUserInput } from '../helpers/factories';

describe('credentials auth flow', () => {
  beforeAll(async () => {
    await startInMemoryMongo();
  }, 60000);

  afterAll(async () => {
    await stopInMemoryMongo();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  it('created users can be verified with bcrypt (authorize happy path)', async () => {
    const { createUser } = await import('@/lib/actions');
    const { getUser } = await import('@/lib/fetchData');
    const input = testUserInput({ email: 'auth@example.com', password: 'secret123' });
    await createUser(input);

    const user = await getUser('auth@example.com');
    expect(user).toBeTruthy();
    await expect(bcrypt.compare('secret123', user!.password)).resolves.toBe(true);
    await expect(bcrypt.compare('wrongpass', user!.password)).resolves.toBe(false);
  });

  it('login schema rejects bad credentials before DB lookup', async () => {
    const { loginSchema } = await import('@/lib/types');
    expect(loginSchema.safeParse({ email: 'bad', password: '1' }).success).toBe(false);
  });
});
