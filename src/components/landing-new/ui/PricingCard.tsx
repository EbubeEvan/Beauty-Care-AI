'use client';

import { Check, Crown } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

interface PricingCardProps {
  name: string;
  price: string;
  credits: string;
  features: string[];
  popular?: boolean;
  delay?: number;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  credits,
  features,
  popular = false,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className={`relative flex h-full flex-col rounded-3xl p-8 transition-all duration-300 ${
      popular
        ? 'from-brand to-brand-hover shadow-brand/30 scale-105 bg-gradient-to-br text-white shadow-2xl'
        : 'bg-surface border-border-main text-text-main border-2'
    }`}
  >
    {popular && (
      <div className='absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-amber-400 px-4 py-1 text-sm font-bold text-amber-900'>
        <Crown className='h-4 w-4' />
        Most Popular
      </div>
    )}

    <div className='mb-6'>
      <h3 className='mb-2 text-xl font-bold'>{name}</h3>
      <div className='flex items-baseline gap-1'>
        <span className='text-4xl font-bold'>{price}</span>
      </div>
      <div
        className={`mt-4 inline-block rounded-lg px-3 py-1 text-sm font-bold ${popular ? 'bg-white/20 text-white' : 'bg-brand-muted text-brand'}`}
      >
        {credits} Credits
      </div>
    </div>

    <ul className='mb-8 flex-1 space-y-4'>
      {features.map((feature, i) => (
        <li key={i} className='flex items-start gap-3'>
          <div
            className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${popular ? 'bg-white/20' : 'bg-brand-muted'}`}
          >
            <Check className={`h-3 w-3 ${popular ? 'text-white' : 'text-brand'}`} />
          </div>
          <span className={popular ? 'text-white/90' : 'text-text-muted'}>{feature}</span>
        </li>
      ))}
    </ul>

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full rounded-xl py-3 font-semibold transition-colors ${
        popular
          ? 'text-brand bg-white hover:bg-white/90'
          : 'bg-brand hover:bg-brand-hover text-white'
      }`}
    >
      Buy Credits
    </motion.button>
  </motion.div>
);
