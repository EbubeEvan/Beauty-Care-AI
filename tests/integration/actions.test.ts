import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/database/dbConnect', () => ({ default: vi.fn(async () => {}) }));
vi.mock('@/auth', () => ({ signIn: vi.fn(), signOut: vi.fn() }));
vi.mock('next-auth', () => ({ AuthError: class AuthError extends Error {} }));

import User from '@/database/models/user.model';

import { clearDatabase, startInMemoryMongo, stopInMemoryMongo } from '../helpers/db';
import { testBeautyProfile, testUserDoc, testUserInput } from '../helpers/factories';

describe('server actions (DB integration)', () => {
  beforeAll(async () => {
    await startInMemoryMongo();
  }, 60000);

  afterAll(async () => {
    await stopInMemoryMongo();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  it('createUser creates a user with hashed password and defaults', async () => {
    const { createUser } = await import('@/lib/actions');
    const input = testUserInput();
    const result = await createUser(input);
    expect(result.id).toBeTruthy();
    expect(result.message).toMatch(/success/i);

    const saved = await User.findOne({ email: input.email.toLowerCase() });
    expect(saved).toBeTruthy();
    expect(saved!.password).not.toBe(input.password);
    expect(saved!.creditBalance).toBe(20);
  });

  it('createUser rejects invalid input without touching the DB', async () => {
    const { createUser } = await import('@/lib/actions');
    const result = await createUser({ firstName: '', lastName: '', email: 'bad', password: '1' });
    expect(result.errors).toBeTruthy();
    expect(await User.countDocuments()).toBe(0);
  });

  it('createUser surfaces duplicate-email DB errors', async () => {
    const { createUser } = await import('@/lib/actions');
    const input = testUserInput({ email: 'dupe@example.com' });
    await createUser(input);
    const second = await createUser({ ...input, firstName: 'Other' });
    expect(second.message).toMatch(/database error/i);
    expect(second.id).toBeUndefined();
  });

  it('addBeautyProfile updates the profile', async () => {
    const { addBeautyProfile } = await import('@/lib/actions');
    const created = await User.create(testUserDoc());
    const result = await addBeautyProfile(
      { ...testBeautyProfile, hairColor: 'Brown', skinColor: 'Medium' },
      String(created._id),
    );
    expect(result.message).toMatch(/success/i);
    const updated = await User.findById(created._id);
    expect(updated!.beautyProfile.hairColor).toBe('Brown');
  });

  it('addBeautyProfile rejects invalid profiles and unknown users', async () => {
    const { addBeautyProfile } = await import('@/lib/actions');
    const created = await User.create(testUserDoc());
    const invalid = await addBeautyProfile(
      { ...testBeautyProfile, hairColor: '', skinColor: '' },
      String(created._id),
    );
    expect(invalid.errors).toBeTruthy();

    const missing = await addBeautyProfile(
      { ...testBeautyProfile, hairColor: 'Black', skinColor: 'Deep' },
      '000000000000000000000000',
    );
    expect(missing.message).toMatch(/error/i);
  });

  it('addCredits increments balance and handles unknown users', async () => {
    const { addCredits } = await import('@/lib/actions');
    const created = await User.create(testUserDoc({ creditBalance: 5 }));
    const message = await addCredits(10, String(created._id));
    expect(message).toMatch(/10 credits added/);
    expect((await User.findById(created._id))!.creditBalance).toBe(15);

    const notFound = await addCredits(10, '000000000000000000000000');
    expect(notFound).toMatch(/something went wrong/i);
  });
});
