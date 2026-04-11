import { Star } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { FadeIn } from './FadeIn';

interface TestimonialCardProps {
  name: string;
  role: string;
  text: string;
  avatar?: string;
  delay?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  text,
  avatar,
  delay = 0,
}: TestimonialCardProps) => (
  <FadeIn delay={delay}>
    <div className='bg-surface-muted border-border-main h-full rounded-2xl border p-6'>
      <div className='mb-4 flex gap-1'>
        {[...Array(5)].map((_, i) => (
          <Star key={i} className='h-5 w-5 fill-amber-400 text-amber-400' />
        ))}
      </div>
      <p className='text-text-main mb-6 leading-relaxed'>{text}</p>
      <div className='flex items-center gap-3'>
        <div className='from-brand to-brand-hover flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br font-semibold text-white'>
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={40}
              height={40}
              className='h-full w-full object-cover'
              referrerPolicy='no-referrer'
            />
          ) : (
            name[0]
          )}
        </div>
        <div>
          <div className='text-text-main font-semibold'>{name}</div>
          <div className='text-text-muted text-sm'>{role}</div>
        </div>
      </div>
    </div>
  </FadeIn>
);
