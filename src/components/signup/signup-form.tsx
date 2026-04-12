'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { createUser } from '@/lib/actions';
import useStore from '@/lib/store/useStore';
import { signUpFormSchema, SignUpType } from '@/lib/types';

import { FormInput } from '../design-system/FormInput';
import { Spinner } from '../ui/spinner';

export default function SignupForm() {
  const router = useRouter();

  const { setId } = useStore();

  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (errMsg.length > 0 && !errMsg.includes('NEXT')) {
    toast.error(errMsg);
  }

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpType>({
    resolver: zodResolver(signUpFormSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof signUpFormSchema>> = async (data) => {
    setLoading(true);
    const user = await createUser(data);
    if (user?.errors) {
      Object.entries(user?.errors || {}).forEach(([key, value]: [string, any]) => {
        setError(key as keyof SignUpType, { message: value[0] });
      });

      setErrMsg(user?.message || '');
      setLoading(false);
    } else {
      setId(user?.id || '');
      router.push('/signup/onboarding');
      setLoading(false);
    }
  };

  return (
    <Card className='mt-10 mb-10 w-full max-w-lg min-[1200px]:mt-16'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className='px-8 pt-8 md:px-10 md:pt-10'>
          <CardTitle className='mb-3 text-3xl'>Sign Up</CardTitle>
          <CardDescription className='text-base'>
            Begin your journey to achieving your beauty goals
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-6 px-8 md:px-10'>
          {/* firstname */}
          <FormInput
            {...register('firstName')}
            errorText={errors.firstName?.message || ''}
            id='firstName'
            label='firstName'
            placeholder='Jane'
          />

          {/* lastname */}
          <FormInput
            {...register('lastName')}
            errorText={errors.lastName?.message || ''}
            id='lastName'
            label='lastName'
            placeholder='Doe'
          />

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
            placeholder=''
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
              'Sign Up'
            )}
          </Button>

          <p className='mt-6 text-base'>
            Already have an account?
            <Link href='/login' className='text-brand hover:underline'>
              {' '}
              Login here
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
