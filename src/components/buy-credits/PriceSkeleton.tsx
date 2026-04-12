import { PRICE_SKELETON_ARRAY } from '@/lib/data';

import { Skeleton } from '../ui/skeleton';

export default function PriceSkeleton() {
  return (
    <section className='flex min-h-screen w-full items-center justify-center'>
      <div className='grid w-full grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2'>
        {PRICE_SKELETON_ARRAY.map((_, index) => (
          <Skeleton key={index} className='h-[12rem] md:h-[15rem] md:w-[25rem]' />
        ))}
      </div>
    </section>
  );
}
