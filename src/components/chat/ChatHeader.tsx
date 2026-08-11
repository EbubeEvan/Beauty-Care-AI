'use client';

import { FlowerIcon, Menu } from 'lucide-react';
import Link from 'next/link';

import useStore from '@/lib/store/useStore';

import { ModeToggle } from '../design-system/mode-toggle';

export default function ChatHeader() {
  const { setMenuOpen } = useStore();
  return (
    <header className='bg-surface flex h-14 items-center justify-between px-4 pt-6 lg:px-6'>
      <Menu size={27} className='text-brand md:hidden' onClick={() => setMenuOpen(true)} />
      <Link href='/' className='flex items-center gap-2'>
        <FlowerIcon className='text-brand h-6 w-6 md:ml-6 lg:ml-8' />
        <span className='text-text-main text-lg font-semibold'>Beautycare AI</span>
      </Link>
      <div className='flex items-center gap-4'>
        <ModeToggle />
      </div>
    </header>
  );
}
