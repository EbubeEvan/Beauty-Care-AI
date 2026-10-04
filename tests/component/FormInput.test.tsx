import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { FormInput } from '@/components/design-system/FormInput';

describe('FormInput', () => {
  it('renders label, placeholder and error text', () => {
    render(<FormInput id='email' label='email' placeholder='m@example.com' errorText='Required' />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('m@example.com')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<FormInput id='pw' label='password' placeholder='' type='password' errorText='' />);
    const input = screen.getByLabelText('Password') as HTMLInputElement;
    expect(input.type).toBe('password');
    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input.type).toBe('text');
    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input.type).toBe('password');
  });
});
