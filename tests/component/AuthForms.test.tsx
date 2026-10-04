import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const { pushMock, authenticateMock, createUserMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  authenticateMock: vi.fn(),
  createUserMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('@/lib/actions', () => ({
  authenticate: authenticateMock,
  createUser: createUserMock,
}));
vi.mock('@/lib/store/useStore', () => ({
  default: () => ({ setId: vi.fn(), id: '' }),
}));

import LoginForm from '@/components/login/login-form';
import SignupForm from '@/components/signup/signup-form';

describe('LoginForm', () => {
  it('shows validation errors for bad input', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.type(screen.getByLabelText('Password'), '123');
    await user.click(screen.getByRole('button', { name: 'Login' }));
    expect(await screen.findAllByText('Invalid email address')).not.toHaveLength(0);
    expect(authenticateMock).not.toHaveBeenCalled();
  });

  it('submits valid credentials', async () => {
    const user = userEvent.setup();
    authenticateMock.mockResolvedValue(undefined);
    render(<LoginForm />);
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Login' }));
    await waitFor(() =>
      expect(authenticateMock).toHaveBeenCalledWith({
        email: 'jane@example.com',
        password: 'password123',
      }),
    );
  });
});

describe('SignupForm', () => {
  it('creates a user and navigates to onboarding on success', async () => {
    const user = userEvent.setup();
    createUserMock.mockResolvedValue({ id: 'new-id', message: 'ok' });
    render(<SignupForm />);
    await user.type(screen.getByLabelText('FirstName'), 'Jane');
    await user.type(screen.getByLabelText('LastName'), 'Doe');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));
    await waitFor(() => expect(createUserMock).toHaveBeenCalled());
    expect(pushMock).toHaveBeenCalledWith('/signup/onboarding');
  });

  it('blocks submit with invalid email', async () => {
    const user = userEvent.setup();
    render(<SignupForm />);
    await user.type(screen.getByLabelText('FirstName'), 'Jane');
    await user.type(screen.getByLabelText('LastName'), 'Doe');
    await user.type(screen.getByLabelText('Email'), 'bad');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
  });
});
