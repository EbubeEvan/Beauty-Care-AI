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

  if (errMsg.length > 0) {
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
    <Card className='-mt-10 mb-10 w-full max-w-lg min-[1200px]:mt-16'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className='mb-3 text-2xl'>Login</CardTitle>
          <CardDescription>Enter your email below to login to your account.</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          {/* email */}
          <FormInput
            {...register('email')}
            errorText={errors.email?.message || ''}
            id='email'
            label='email'
            placeholder='m@example.com'
          />

          {/* password */}
          <FormInput
            {...register('password')}
            errorText={errors.password?.message || ''}
            id='password'
            label='password'
            placeholder='Doe'
            type='password'
          />
        </CardContent>
        <CardFooter className='flex flex-col'>
          <Button
            type='submit'
            className='w-full bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pink-600 focus:outline-none dark:bg-purple-400 dark:text-gray-900 dark:hover:bg-purple-500'
            disabled={loading}
          >
            {loading ? (
              <Spinner size='small' className='text-gray-200 dark:text-gray-700' />
            ) : (
              'Login'
            )}
          </Button>
          <p className='mt-5 text-sm'>
            Don&apos;t have an account?{' '}
            <Link href='/signup' className='text-pink-500 hover:underline dark:text-purple-600'>
              {' '}
              Sign up here
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
