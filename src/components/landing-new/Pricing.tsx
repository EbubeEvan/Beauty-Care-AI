import { CreditCard } from 'lucide-react';

import { FadeIn } from './ui/FadeIn';
import { PricingCard } from './ui/PricingCard';

export const Pricing = () => {
  const pricingPlans = [
    {
      name: 'Starter Pack',
      price: '$9',
      credits: '50',
      features: [
        'Full skin analysis',
        '25 AI chat messages',
        'Personalized routines',
        'Email support',
      ],
    },
    {
      name: 'Beauty Pack',
      price: '$25',
      credits: '150',
      features: [
        'Advanced skin & hair analysis',
        'Unlimited AI chat',
        'Ingredient analysis',
        'Priority support',
        'Routine tracking',
      ],
    },
    {
      name: 'Ultimate Pack',
      price: '$60',
      credits: '400',
      features: [
        'Everything in Beauty Pack',
        'Expert consultation credits',
        'Exclusive product discounts',
        'Early access to features',
        'Lifetime profile storage',
      ],
    },
  ];

  return (
    <section id='pricing' className='bg-surface-muted py-24 transition-colors duration-300'>
      <div className='mx-auto max-w-7xl px-6'>
        <FadeIn className='mb-16 text-center'>
          <span className='bg-brand-muted text-brand mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-semibold'>
            Credit Bundles
          </span>
          <h2 className='text-text-main mb-4 text-4xl font-bold lg:text-5xl'>Pay As You Go</h2>
          <p className='text-text-muted text-xl'>No subscriptions. Buy credits as you need them.</p>
        </FadeIn>

        <div className='mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-3'>
          {pricingPlans.map((plan, i) => (
            <PricingCard
              key={plan.name}
              {...plan}
              delay={i * 0.1}
              popular={plan.name === 'Beauty Pack'}
            />
          ))}
        </div>

        <FadeIn delay={0.4} className='mt-12 text-center'>
          <p className='text-text-muted flex items-center justify-center gap-2'>
            <CreditCard className='h-4 w-4' />
            Secure payment powered by Stripe • Credits never expire
          </p>
        </FadeIn>
      </div>
    </section>
  );
};
