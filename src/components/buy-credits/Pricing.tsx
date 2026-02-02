'use client';

import { CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PaystackButton } from 'react-paystack';
import { toast } from 'react-toastify';

import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetchPrices } from '@/hooks/useFetchPrices';
import { addCredits } from '@/lib/actions';

import PriceSkeleton from './PriceSkeleton';

const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY || '';

export default function Pricing({
  email,
  id,
}: Readonly<{
  email: string;
  id: string;
}>) {
  const [message, setMessage] = useState('');
  const { data, isLoading } = useFetchPrices();

  console.log(data);

  const currency = data?.currency;
  const prices = data?.prices;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Trigger toast when `message` is updated
  useEffect(() => {
    if (message) {
      toast.error(message);
      // Use a timeout to clear the message after toast is displayed
      const timer = setTimeout(() => {
        setMessage('');
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {}, [data]);

  const handleSuccess = async (credits: number) => {
    const response = await addCredits(credits, id); // Using price.credits directly
    console.log({ response });
  };

  return (
    <div className='container mx-auto h-full px-5 py-12 md:px-20 lg:px-48'>
      <h1 className='mb-4 text-center text-4xl font-bold'>Get Your Credits</h1>
      <p className='text-muted-foreground mb-6 text-center'>
        Purchase the amount of credits you need
      </p>
      {isLoading && <PriceSkeleton />}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {prices?.map((price) => (
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
                className='mx-5 w-full rounded-md border border-slate-200 bg-white py-2 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50'
                email={email}
                amount={price.price * 100} // Paystack expects amount in kobo (for NGN), so multiply by 100
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
