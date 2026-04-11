'use client';

import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  question,
  answer,
  isOpen,
  onClick,
}) => (
  <div className='border-border-main border-b last:border-0'>
    <button
      onClick={onClick}
      className='group flex w-full items-center justify-between py-6 text-left'
    >
      <span className='text-text-main group-hover:text-brand pr-8 text-lg font-semibold transition-colors'>
        {question}
      </span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className='bg-brand-muted/20 group-hover:bg-brand-muted/40 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors'
      >
        <ChevronDown className='text-brand h-5 w-5' />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='overflow-hidden'
        >
          <p className='text-text-muted pb-6 leading-relaxed'>{answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
