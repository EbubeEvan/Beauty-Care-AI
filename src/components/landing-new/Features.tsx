'use client';

import { Coins, Droplets, MessageCircle, ScanFace } from 'lucide-react';

import { FadeIn } from './ui/FadeIn';
import { FeatureCard } from './ui/FeatureCard';

export const Features = () => {
  const features = [
    {
      icon: ScanFace,
      title: 'Skin Analysis',
      description:
        'Our AI examines your skin type, texture, and concerns to recommend the best products and routines.',
    },
    {
      icon: Droplets,
      title: 'Hair Analysis',
      description:
        'Our AI evaluates your hair type, condition, and concerns to suggest the perfect haircare products.',
    },
    {
      icon: MessageCircle,
      title: 'AI-Powered Chatbot',
      description:
        'Have natural conversations and receive tailored recommendations for your skin and hair concerns.',
    },
    {
      icon: Coins,
      title: 'Credit System',
      description:
        'Utilize your credits to access expert advice and receive personalized treatment plans. Top up anytime.',
    },
  ];

  return (
    <section id='features' className='bg-surface-muted py-24 transition-colors duration-300'>
      <div className='mx-auto max-w-7xl px-6'>
        <FadeIn className='mb-16 text-center'>
          <span className='bg-brand-muted text-brand mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-semibold'>
            Features
          </span>
          <h2 className='text-text-main mb-4 text-4xl font-bold lg:text-5xl'>
            AI-Powered Beauty Solutions
          </h2>
          <p className='text-text-muted mx-auto max-w-2xl text-xl'>
            Comprehensive tools designed to understand and enhance your unique beauty
          </p>
        </FadeIn>

        <div className='grid gap-8 md:grid-cols-2'>
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};
