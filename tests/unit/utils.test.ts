import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/database/dbConnect', () => ({ default: vi.fn(async () => {}) }));

import User from '@/database/models/user.model';
import type { priceType } from '@/lib/types';
import { cn, creditsUpdate, priceConvert, sanitizeMessage } from '@/lib/utils';

describe('cn', () => {
  it('merges tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('a', undefined, 'c')).toBe('a c');
  });
});

describe('sanitizeMessage', () => {
  it('renders markdown and strips XSS', () => {
    const html = sanitizeMessage('Hello **world** <script>alert(1)</script>');
    expect(html).toContain('<strong>world</strong>');
    expect(html).not.toContain('<script>');
  });
});

function price(overrides: Partial<priceType> = {}): priceType {
  return { _id: 'p1', credits: 10, p1: 100, p2: 1, p3: 10, discount: 0, ...overrides };
}

describe('priceConvert', () => {
  it('selects p1 when conversionRate >= 1', () => {
    expect(priceConvert([price()], 1.5)).toEqual([
      { id: 'p1', credits: 10, price: 150, discount: 0 },
    ]);
  });

  it('selects p3 for rates between 0.01 and 1', () => {
    const [converted] = priceConvert([price()], 0.5);
    expect(converted.price).toBe(5);
  });

  it('selects p2 for rates between 0.0001 and 0.01', () => {
    const [converted] = priceConvert([price()], 0.001);
    expect(converted.price).toBeCloseTo(0.001);
  });

  it('falls back to p1 for unexpected rates', () => {
    const [converted] = priceConvert([price()], 0);
    expect(converted.price).toBe(0);
  });

  it('maps every price entry', () => {
    expect(priceConvert([price({ _id: 'a' }), price({ _id: 'b' })], 2)).toHaveLength(2);
  });
});

describe('creditsUpdate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('decrements credits when balance is positive', async () => {
    const findOne = vi.spyOn(User, 'findOne').mockResolvedValue({ creditBalance: 5 } as never);
    const findOneAndUpdate = vi
      .spyOn(User, 'findOneAndUpdate')
      .mockResolvedValue({ credits: 4 } as never);
    await creditsUpdate('jane@example.com');
    expect(findOne).toHaveBeenCalledWith({ email: 'jane@example.com' });
    expect(findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'jane@example.com' },
      { $inc: { creditBalance: -1 } },
      { new: true },
    );
  });

  it('does nothing when balance is zero or user is missing', async () => {
    const findOneAndUpdate = vi.spyOn(User, 'findOneAndUpdate').mockResolvedValue(null);
    vi.spyOn(User, 'findOne').mockResolvedValueOnce(null);
    await creditsUpdate('missing@example.com');
    expect(findOneAndUpdate).not.toHaveBeenCalled();

    vi.spyOn(User, 'findOne').mockResolvedValueOnce({ creditBalance: 0 } as never);
    await creditsUpdate('empty@example.com');
    expect(findOneAndUpdate).not.toHaveBeenCalled();
  });
});
