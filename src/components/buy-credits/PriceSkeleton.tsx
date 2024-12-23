import React from 'react';
import { PRICE_SKELETON_ARRAY } from '@/lib/data';
import { Skeleton } from '../ui/skeleton';

export default function PriceSkeleton() {
  return (
    <section className="flex items-center justify-center min-h-screen w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 w-full">
        {PRICE_SKELETON_ARRAY.map((_, index) => (
          <Skeleton key={index} className="md:w-[25rem] h-[12rem] md:h-[15rem]" />
        ))}
      </div>
    </section>
  );
}
