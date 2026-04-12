'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

import { FadeIn } from './ui/FadeIn';

export const Cta = () => {
  return (
    <section className='from-brand to-brand-hover relative overflow-hidden bg-gradient-to-br py-24 transition-colors duration-300'>
      <div className='relative z-10 mx-auto max-w-4xl px-6 text-center'>
        <FadeIn>
          <h2 className='mb-6 text-4xl font-bold text-white lg:text-5xl'>
            Ready to Transform Your Beauty Routine?
          </h2>
          <p className='mx-auto mb-10 max-w-2xl text-xl text-white/80'>
            Join thousands of users who have discovered their perfect beauty formula with AI-powered
            precision.
          </p>

          <div className='flex flex-wrap justify-center gap-4'>
            <Link
              href='/signup'
              className='bg-surface hover:bg-surface-muted inline-flex rounded-full px-8 py-4 transition-colors'
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='text-brand inline-flex w-full items-center justify-center rounded-full font-bold shadow-xl'
              >
                Get Started Free
              </motion.div>
            </Link>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20'
            >
              View Pricing
            </motion.button>
          </div>

          <p className='mt-6 text-sm text-white/70'>
            No credit card required • 10 free credits on signup
          </p>
        </FadeIn>
      </div>
    </section>
  );
};
