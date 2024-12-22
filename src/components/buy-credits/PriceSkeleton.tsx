import React from 'react'
import { PRICE_SKELETON_ARRAY } from '@/lib/data'
import { Skeleton } from '../ui/skeleton'

export default function PriceSkeleton() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
        {PRICE_SKELETON_ARRAY.map((_, index) => (
            <Skeleton key={index} className='w-[10rem] h-[30rem]'/>
        ))}
    </section>
  )
}
