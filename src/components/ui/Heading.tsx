'use client';

import { FlowerIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ModeToggle } from '../design-system/mode-toggle';
import { Account } from './account';

export default function Heading() {
  const pathname = usePathname();
  const modeToggleTone = pathname === '/' ? 'overlay' : 'default';

  return (
    <header className='flex h-14 items-center justify-between px-4 py-10 lg:px-6'>
      <Link href='/' className='flex items-center gap-2'>
        <FlowerIcon className='text-brand h-6 w-6' />
        <span className='text-text-main text-lg font-semibold'>Beautycare AI</span>
      </Link>
      <div className='flex items-center gap-4'>
        <ModeToggle tone={modeToggleTone} />
        {pathname === '/' && <Account />}
      </div>
    </header>
  );
}
