import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8 }}
      className='group bg-surface border-border-main shadow-brand/10 rounded-3xl border p-8 shadow-xl transition-all duration-300'
    >
      <div className='bg-brand-muted mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110'>
        <Icon className='text-brand h-7 w-7' />
      </div>
      <h3 className='text-text-main mb-3 text-2xl font-bold'>{title}</h3>
      <p className='text-text-muted leading-relaxed'>{description}</p>
    </motion.div>
  );
};
