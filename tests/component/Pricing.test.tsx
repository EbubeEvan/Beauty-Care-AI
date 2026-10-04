import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-paystack', () => ({
  PaystackButton: (props: { text: string }) => <button type='button'>{props.text}</button>,
}));
vi.mock('@/lib/actions', () => ({ addCredits: vi.fn() }));

import Pricing from '@/components/buy-credits/Pricing';

describe('Pricing', () => {
  const prices = [
    { id: 'a', credits: 50, price: 5000, discount: 10 },
    { id: 'b', credits: 100, price: 9000, discount: 0 },
  ];

  it('renders credit packs with formatted prices and discounts', () => {
    render(<Pricing email='jane@example.com' id='user-1' prices={prices} currency='NGN' />);
    expect(screen.getByText('50 Credits')).toBeInTheDocument();
    expect(screen.getByText('100 Credits')).toBeInTheDocument();
    expect(screen.getByText('Save 10%')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Buy' })).toHaveLength(2);
  });
});
