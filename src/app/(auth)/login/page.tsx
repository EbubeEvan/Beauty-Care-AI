import { Metadata } from 'next';

import LoginForm from '@/components/login/login-form';

export const metadata: Metadata = {
  title: 'Login',
};

export default function page() {
  return (
    <section className='bg-surface text-text-main flex flex-1 flex-col items-center justify-center px-4 transition-colors duration-300 sm:px-6'>
      <div className='flex w-full justify-center'>
        <LoginForm />
      </div>
    </section>
  );
}
