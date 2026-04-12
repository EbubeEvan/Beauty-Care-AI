'use client';

import { UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Account() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='bg-brand hover:bg-brand-hover inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors focus:outline-none'>
          <UserIcon className='h-4 w-4' />
          Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => router.push('/login')}>Login</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/signup')}>Sign Up</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
