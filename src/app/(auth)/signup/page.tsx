import { Metadata } from 'next';

import SignupForm from '@/components/signup/signup-form';

export const metadata: Metadata = {
  title: 'Signup',
};

export default function page() {
  return (
    <section className='bg-surface text-text-main flex flex-1 flex-col items-center justify-center px-4 transition-colors duration-300 sm:px-6'>
      <div className='flex w-full justify-center'>
        <SignupForm />
      </div>
    </section>
  );
}
