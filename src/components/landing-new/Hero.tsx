'use client';

import { ArrowRight, Heart, Play, Shield, Sparkles, Star } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

export const Hero = () => {
  return (
    <section className='relative flex min-h-screen items-center justify-center overflow-hidden pt-20'>
      {/* Background Image with Overlay */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='https://res.cloudinary.com/dig1aye1l/image/upload/v1775768667/hero-img_i0mwe8.jpg'
          alt='Beauty Community'
          fill={true}
          className='object-cover'
          referrerPolicy='no-referrer'
        />
        <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 transition-colors duration-300 dark:from-black/80 dark:via-black/60 dark:to-black/80' />
      </div>

      <div className='relative z-10 mx-auto max-w-4xl px-6 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className='mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md'
          >
            <Sparkles className='text-brand-muted h-4 w-4' />
            <span className='text-sm font-semibold text-white'>AI-Powered Beauty Specialist</span>
          </motion.div>

          <h1 className='mb-8 text-5xl leading-tight font-bold text-white lg:text-7xl'>
            Get personalized <span className='text-brand-muted'>skincare & haircare</span>{' '}
            recommendations
          </h1>

          <p className='mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-white/80'>
            Our AI Beauty Specialist analyzes your skin and hair concerns to provide tailored
            product suggestions and routines.
          </p>

          <div className='mb-16 flex flex-wrap justify-center gap-6'>
            <Link
              href='/signup'
              className='bg-brand shadow-brand/40 hover:bg-brand-hover inline-flex rounded-full transition-all'
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='flex items-center gap-3 rounded-full px-10 py-4 text-lg font-bold text-white shadow-2xl'
              >
                Start Consultation
                <ArrowRight className='h-5 w-5' />
              </motion.div>
            </Link>

            <motion.a
              href='#how-it-works'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-10 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20'
            >
              <Play className='h-5 w-5 fill-white' />
              Watch How It Works
            </motion.a>
          </div>

          <div className='flex flex-wrap justify-center gap-8 text-white/60'>
            <div className='flex items-center gap-2'>
              <Shield className='text-brand-muted h-5 w-5' />
              <span className='text-sm font-medium'>Secure & Private</span>
            </div>
            <div className='flex items-center gap-2'>
              <Star className='text-brand-muted h-5 w-5' />
              <span className='text-sm font-medium'>4.9/5 User Rating</span>
            </div>
            <div className='flex items-center gap-2'>
              <Heart className='text-brand-muted h-5 w-5' />
              <span className='text-sm font-medium'>Trusted by 10k+</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subtle Bottom Fade */}
      <div className='from-surface pointer-events-none absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t to-transparent' />
    </section>
  );
};
