'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TypeAnimation } from 'react-type-animation';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CARDITEMS } from '@/lib/data';

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <section className='flex w-full items-center justify-center bg-linear-to-br from-[#f5d0fe] to-[#e879f9] py-12 md:px-10 md:py-24 lg:py-32 dark:from-[#1e293b] dark:to-[#4c1d95]'>
      <div className='container px-4 text-center md:px-6 lg:px-4'>
        <div className='mx-auto max-w-2xl space-y-4'>
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 2 }}
            variants={{
              hidden: { opacity: 0, y: 0 },
              visible: { opacity: 1, y: 0 },
            }}
            className='flex inline-block rounded-lg bg-pink-100 px-3 py-1 text-sm font-medium text-pink-500 dark:bg-purple-800 dark:text-purple-400'
          >
            AI-Powered Recommendations
          </motion.div>
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <h2 className='text-3xl font-bold tracking-tighter text-gray-900 sm:text-4xl dark:text-gray-50'>
              Unlock your skin and hair&apos;s potential
            </h2>
          </motion.div>
          <p className='text-lg text-gray-700 dark:text-gray-400'>
            <TypeAnimation
              sequence={[
                '',
                5000,
                'Our advanced AI analyzes your unique skin and hair concerns to provide personalized product recommendations and routines.',
              ]}
              wrapper='span'
              speed={50}
              cursor={false}
            />
          </p>
          <ul ref={ref} className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {CARDITEMS.map((item) => (
              <motion.li
                key={item.id}
                variants={cardVariants}
                initial='initial'
                animate={isInView ? 'animate' : 'initial'}
                transition={{ duration: 0.3, delay: item.id * 0.4 }}
              >
                <Card className='h-[15rem] text-left'>
                  <CardHeader>
                    <item.icon className='h-8 w-8 text-pink-500 dark:text-purple-400' />
                  </CardHeader>
                  <CardContent>
                    <h3 className='text-xl font-bold text-gray-900 dark:text-gray-50'>
                      {item.title}
                    </h3>
                    <p className='text-gray-700 dark:text-gray-400'>{item.description}</p>
                  </CardContent>
                </Card>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
