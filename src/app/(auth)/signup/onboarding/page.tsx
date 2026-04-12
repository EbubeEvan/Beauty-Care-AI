import { Metadata } from 'next';

import OnboardingForm from '@/components/onboarding/onboarding-form';

export const metadata: Metadata = {
  title: 'Onboarding',
};

export default async function page() {
  return (
    <section className='bg-surface text-text-main flex flex-1 flex-col items-center justify-center px-4 transition-colors duration-300 sm:px-6'>
      <div className='flex w-full justify-center'>
        <OnboardingForm />
      </div>
    </section>
  );
}
