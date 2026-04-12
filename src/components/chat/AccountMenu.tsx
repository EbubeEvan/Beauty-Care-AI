import clsx from 'clsx';
import { ChevronsUpDownIcon, CircleUser, CreditCard, User, Wallet } from 'lucide-react';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useStore from '@/lib/store/useStore';

import Logout from './Logout';

export function AccountMenu({
  credits,
  userName,
}: Readonly<{ credits: number; userName: string }>) {
  const { menuOpen } = useStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={clsx(
            'text-text-main hover:bg-brand/15 relative flex cursor-pointer rounded-2xl p-3 transition-colors',
            {
              hidden: !menuOpen,
            },
          )}
        >
          <CircleUser size={35} />
          <div className='ml-3'>
            <p>{userName}</p>
            <div className='flex gap-2'>
              <CreditCard />
              <p>{`${credits} credits`}</p>
            </div>
          </div>
          <ChevronsUpDownIcon className='absolute top-5 right-0 cursor-pointer' />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='border-border-main bg-surface text-text-main w-56 border'>
        <DropdownMenuItem className='focus:bg-brand/15 focus:text-text-main dark:focus:bg-brand/15 dark:focus:text-text-main'>
          <Link href='/buy-credits' className='flex w-full gap-3 rounded-md px-5 py-2'>
            <Wallet />
            <p>Buy credits</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className='focus:bg-brand/15 focus:text-text-main dark:focus:bg-brand/15 dark:focus:text-text-main'>
          <Link href='/profile' className='flex w-full gap-3 rounded-md px-5 py-2'>
            <User />
            <p>profile</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className='bg-border-main' />
        <Logout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
