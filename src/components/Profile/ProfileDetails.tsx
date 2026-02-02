/* eslint-disable react-hooks/incompatible-library */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleUser } from 'lucide-react';
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
import { addBeautyProfile } from '@/lib/actions';
import {
  ALBINO,
  CHEMICALTREATMENTS,
  HAIRTYPE,
  HAIRVOLUME,
  SENSITIVITY,
  SKINTYPE,
  STRANDTHICKNESS,
} from '@/lib/data';
import { beautyProfileSchema, beautyProfileType, userType } from '@/lib/types';

import { FormInput } from '../design-system/FormInput';
import { SelectItems } from '../onboarding/select-items';
import { Spinner } from '../ui/spinner';

type ProfileDetailsProps = {
  user: userType | null;
};

export default function ProfileDetails({ user }: Readonly<ProfileDetailsProps>) {
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<beautyProfileType>({
    resolver: zodResolver(beautyProfileSchema),
    defaultValues: {
      albino: user?.beautyProfile?.albino || '',
      chemicalTreatment: user?.beautyProfile?.chemicalTreatment || '',
      hairColor: user?.beautyProfile?.hairColor || '',
      hairType: user?.beautyProfile?.hairType || '',
      hairVolume: user?.beautyProfile?.hairVolume || '',
      sensitivity: user?.beautyProfile?.sensitivity || '',
      skinColor: user?.beautyProfile?.skinColor || '',
      skinType: user?.beautyProfile?.skinType || '',
      strandThickness: user?.beautyProfile?.strandThickness || '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof beautyProfileSchema>> = async (data) => {
    setLoading(true);
    const profile = await addBeautyProfile(data, user?._id || '');
    if (profile?.errors) {
      Object.entries(profile?.errors || {}).forEach(([key, value]: [string, any]) => {
        setError(key as keyof beautyProfileType, { message: value[0] });
      });
      setLoading(false);
    } else if (profile.message?.includes('error')) {
      toast.error('Uh Oh. Something went wrong');
      setLoading(false);
    } else {
      toast.success('Your new beauty profile has been saved!');
      setLoading(false);
    }
  };

  return (
    <Card className='mt-10 mb-10 w-full max-w-2xl min-[1200px]:mt-16'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <div className='mb-10 flex flex-col items-center justify-center gap-2'>
            <CircleUser className='min-w-24 text-pink-500 dark:text-purple-400' size={80} />
            <p className='text-lg'>
              {user?.firstName} {user?.lastName}
            </p>
            <i>{user?.email}</i>
          </div>
          <CardTitle className='mb-3 text-center text-2xl'>Beauty Profile</CardTitle>
          <CardDescription className='text-center'>
            Feel free to change your details to suit your current beauty profile.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <h4 className='mt-5 text-center font-bold'>Hair Profile</h4>
          {/* Hair Color */}
          <FormInput
            {...register('hairColor')}
            errorText={errors.hairColor?.message || ''}
            id='Hair-color'
            label='Hair-color'
            placeholder='Black/Brown etc...'
          />

          {/* Hair Type */}
          <SelectItems
            label='Hair Type'
            name='hairType'
            options={HAIRTYPE}
            optionTitle='name'
            optionValue='value'
            placeholder='Select'
            value={watch().hairType}
            error={!!errors.hairType?.message}
            helperText={errors.hairType?.message}
            onValueChange={(e) => setValue('hairType', e)}
          />

          {/* Strand Thickness */}
          <SelectItems
            label='Strand Thickness'
            name='strandThickness'
            options={STRANDTHICKNESS}
            optionTitle='name'
            optionValue='value'
            placeholder='Select'
            value={watch().strandThickness}
            error={!!errors.strandThickness?.message}
            helperText={errors.strandThickness?.message}
            onValueChange={(e) => setValue('strandThickness', e)}
          />

          {/* Chemical Treatment */}
          <SelectItems
            label='Chemical Treatment'
            name='Chemical Treatment'
            options={CHEMICALTREATMENTS}
            optionTitle='name'
            optionValue='value'
            placeholder='Select'
            value={watch().chemicalTreatment}
            error={!!errors.chemicalTreatment?.message}
            helperText={errors.chemicalTreatment?.message}
            onValueChange={(e) => setValue('chemicalTreatment', e)}
          />

          {/* Hair Volume */}
          <SelectItems
            label='Hair Volume'
            name='hairVolume'
            options={HAIRVOLUME}
            optionTitle='name'
            optionValue='value'
            placeholder='Select'
            value={watch().hairVolume}
            error={!!errors.hairVolume?.message}
            helperText={errors.hairVolume?.message}
            onValueChange={(e) => setValue('hairVolume', e)}
          />

          {/* Skin section */}
          <h4 className='mt-5 text-center font-bold'>Skin Profile</h4>

          {/* Skin Color */}
          <FormInput
            {...register('skinColor')}
            errorText={errors.skinColor?.message || ''}
            id='skin-color'
            label='skin-color'
            placeholder='Dark Brown/Light Brown/ Pale etc...'
          />

          {/* Skin Type */}
          <SelectItems
            label='Skin Type'
            name='skinType'
            options={SKINTYPE}
            optionTitle='name'
            optionValue='value'
            placeholder='Select'
            value={watch().skinType}
            error={!!errors.skinType?.message}
            helperText={errors.skinType?.message}
            onValueChange={(e) => setValue('skinType', e)}
          />

          {/* Sensitivity */}
          <SelectItems
            label='Sensitivity'
            name='sensitivity'
            options={SENSITIVITY}
            optionTitle='name'
            optionValue='value'
            placeholder='Select'
            value={watch().sensitivity}
            error={!!errors.sensitivity?.message}
            helperText={errors.sensitivity?.message}
            onValueChange={(e) => setValue('sensitivity', e)}
          />

          {/* Albino */}
          <SelectItems
            label='Albino'
            name='albino'
            options={ALBINO}
            optionTitle='name'
            optionValue='value'
            placeholder='Select'
            value={watch().albino}
            error={!!errors.albino?.message}
            helperText={errors.albino?.message}
            onValueChange={(e) => setValue('albino', e)}
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
              'Save Changes'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
