'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authenticate } from '@/lib/actions';
import { loginSchema, LoginType } from '@/lib/types';

import { FormInput } from '../design-system/FormInput';
import { Spinner } from '../ui/spinner';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  if (errMsg.length > 0 && !errMsg.includes('NEXT')) {
    toast.error(errMsg);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({ resolver: zodResolver(loginSchema) });

  const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (data) => {
    try {
      setLoading(true);
      const user = await authenticate(data);
      return user;
    } catch (error: any) {
      setErrMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <Card className='-mt-10 mb-10 w-full max-w-lg min-[1200px]:mt-16 md:min-h-[34rem]'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex h-full flex-col'>
        <CardHeader className='px-8 pt-8 md:px-10 md:pt-10'>
          <CardTitle className='mb-3 text-3xl'>Login</CardTitle>
          <CardDescription className='text-base'>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid flex-1 gap-8 px-8 py-6 md:px-10'>
          {/* email */}
          <FormInput
            {...register('email')}
            errorText={errors.email?.message || ''}
            id='email'
            label='Email'
            placeholder='m@example.com'
          />

          {/* password */}
          <FormInput
            {...register('password')}
            errorText={errors.password?.message || ''}
            id='password'
            label='Password'
            placeholder='Doe'
            type='password'
          />
        </CardContent>
        <CardFooter className='flex flex-col px-8 pb-8 md:px-10 md:pb-10'>
          <Button
            type='submit'
            className='bg-brand hover:bg-brand-hover w-full px-6 py-4 text-base font-medium text-white shadow-sm transition-colors focus:outline-none'
            disabled={loading}
          >
            {loading ? (
              <Spinner size='small' className='text-gray-200 dark:text-gray-700' />
            ) : (
              'Login'
            )}
          </Button>
          <p className='mt-6 text-base'>
            Don&apos;t have an account?{' '}
            <Link href='/signup' className='text-brand hover:underline'>
              {' '}
              Sign up here
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
