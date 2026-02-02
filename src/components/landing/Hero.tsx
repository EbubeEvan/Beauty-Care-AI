'use client';

import { motion } from 'framer-motion';
import { WebcamIcon } from 'lucide-react';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';

import Heading from '../ui/Heading';

export default function Hero() {
  return (
    <section
      className='relative flex h-screen w-full items-center justify-center bg-gradient-to-br from-[#f5d0fe] to-[#e879f9] py-12 md:px-10 md:py-24 lg:py-32 dark:from-[#1e293b] dark:to-[#4c1d95]'
      style={{
        backgroundImage: `url('/images/hero-img.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay to reduce distraction */}
      <div className='absolute inset-0 bg-black/40 dark:bg-black/60' />

      <div className='absolute top-0 left-0 z-10 w-full'>
        <Heading />
      </div>

      <div className='relative z-10 container px-4 text-center md:px-6'>
        <div className='mx-auto max-w-2xl space-y-4'>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className='text-4xl font-bold tracking-tighter text-gray-50 sm:text-5xl md:text-6xl'>
              Get personalized skincare and haircare recommendations
            </h1>
          </motion.div>
          <p className='text-lg text-gray-300'>
            <TypeAnimation
              sequence={[
                'Our AI Beauty Specialist analyzes your skin and hair concerns to provide tailored product suggestions and routines.',
                1000,
              ]}
              wrapper='span'
              speed={50}
              cursor={false}
            />
          </p>
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 4 }}
            variants={{
              hidden: { opacity: 0, y: 0 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Link
              href='/signup'
              className='inline-flex items-center gap-2 rounded-md bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pink-600 focus:outline-none dark:bg-purple-400 dark:text-gray-900 dark:hover:bg-purple-500'
            >
              <WebcamIcon className='h-5 w-5' />
              Start Consultation
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
