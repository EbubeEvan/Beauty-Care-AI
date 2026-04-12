'use client';

import { CreditCard } from 'lucide-react';
import { PaystackButton } from 'react-paystack';

import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { addCredits } from '@/lib/actions';
import { FinalPriceType } from '@/lib/types';

const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY || '';

export default function Pricing({
  email,
  id,
  prices,
  currency,
}: Readonly<{
  email: string;
  id: string;
  prices: FinalPriceType[];
  currency: string;
}>) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleSuccess = async (credits: number) => {
    const response = await addCredits(credits, id);
    console.log({ response });
  };

  return (
    <div className='container mx-auto h-full px-5 py-12 md:px-20 lg:px-48'>
      <h1 className='mb-4 text-center text-4xl font-bold'>Get Your Credits</h1>
      <p className='text-muted-foreground mb-6 text-center'>
        Purchase the amount of credits you need
      </p>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {prices.map((price) => (
          <Card key={price.id} className='flex flex-col'>
            <CardHeader className='text-center'>
              <CardTitle className='flex items-center justify-center gap-2 text-2xl'>
                <CreditCard className='h-6 w-6' />
                {price.credits} Credits
              </CardTitle>
              <p className='text-3xl font-bold'>{formatPrice(price.price)}</p>
              {price.discount ? (
                <p className='text-sm font-semibold text-green-500'>Save {price.discount}%</p>
              ) : (
                <div className='h-5' />
              )}
            </CardHeader>
            <CardFooter className='flex w-full justify-center'>
              <PaystackButton
                className='border-border-main bg-surface-muted text-text-main hover:bg-brand-muted mx-5 w-full rounded-md border py-2 transition-colors'
                email={email}
                amount={price.price * 100}
                publicKey={publicKey}
                currency={currency}
                text='Buy'
                onSuccess={() => handleSuccess(price.credits)}
                onClose={() => console.log('Transaction closed')}
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
