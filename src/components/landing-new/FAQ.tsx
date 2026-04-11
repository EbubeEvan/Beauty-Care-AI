'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

import { AccordionItem } from './ui/AccordionItem';
import { FadeIn } from './ui/FadeIn';

export const Faq = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the AI skin analysis work?',
      a: 'Our advanced AI uses computer vision technology to analyze photos of your skin, identifying texture, tone, hydration levels, and specific concerns like acne or wrinkles. It compares your profile against millions of data points to provide accurate recommendations.',
    },
    {
      q: 'Are the product recommendations personalized?',
      a: 'Absolutely! Every recommendation is tailored to your unique beauty profile. We consider your skin/hair type, concerns, climate, age, and even ingredient preferences to suggest products that will work specifically for you.',
    },
    {
      q: 'How do credits work?',
      a: 'Credits are our in-app currency. Each analysis, chat session, or detailed report uses a certain number of credits. You receive free credits monthly with your subscription, and you can purchase additional credits anytime.',
    },
    {
      q: 'Is my data secure and private?',
      a: 'Yes, we take privacy seriously. Your photos and personal data are encrypted and never shared with third parties. We comply with GDPR and other privacy regulations. You can delete your data at any time.',
    },
    {
      q: 'Can I cancel my subscription anytime?',
      a: "Yes, you can cancel your subscription at any time with no cancellation fees. You'll continue to have access until the end of your billing period, and any unused credits remain valid for 12 months.",
    },
  ];

  return (
    <section id='faq' className='bg-surface-muted py-24 transition-colors duration-300'>
      <div className='mx-auto max-w-3xl px-6'>
        <FadeIn className='mb-16 text-center'>
          <span className='bg-brand-muted text-brand mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-semibold'>
            FAQ
          </span>
          <h2 className='text-text-main mb-4 text-4xl font-bold lg:text-5xl'>
            Frequently Asked Questions
          </h2>
          <p className='text-text-muted text-xl'>Everything you need to know about Beautycare AI</p>
        </FadeIn>

        <div className='bg-surface border-border-main rounded-2xl border p-6 shadow-lg md:p-8'>
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              question={faq.q}
              answer={faq.a}
              isOpen={openFaq === i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            />
          ))}
        </div>

        <FadeIn delay={0.3} className='mt-12 text-center'>
          <p className='text-text-muted mb-4'>Still have questions?</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='bg-brand hover:bg-brand-hover inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-colors'
          >
            <MessageCircle className='h-5 w-5' />
            Contact Support
          </motion.button>
        </FadeIn>
      </div>
    </section>
  );
};
