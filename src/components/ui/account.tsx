'use client';

import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
          <Avatar className='h-5 w-5'>
            <AvatarFallback className='bg-white/20 text-xs text-white'>U</AvatarFallback>
          </Avatar>
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
