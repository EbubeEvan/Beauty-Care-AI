/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
'use client';

import clsx from 'clsx';
import { Menu, MessageCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useFetchCredits } from '@/hooks/useFetchCredits';
import { useFetchHistory } from '@/hooks/useFetchHistory';
import useStore from '@/lib/store/useStore';

import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { AccountMenu } from './AccountMenu';

export default function SideNav({
  id,
  email,
  userName,
}: Readonly<{
  id?: string;
  email: string;
  userName: string;
}>) {
  const { data: history, isLoading } = useFetchHistory(id!);
  const { data: newCredits } = useFetchCredits(email);
  const { menuOpen, setMenuOpen, setCredits, credits } = useStore();
  const pathname = usePathname();
  const pathID = pathname.split('/')[2];

  console.log(credits);

  useEffect(() => {
    console.log('New Credits from API:', newCredits?.credits); // Log fetched data
    if (newCredits?.credits !== undefined || null) {
      setCredits(newCredits?.credits!);
    }
  }, [newCredits?.credits, setCredits]);

  return (
    <div className='flex h-full min-h-0 flex-col overflow-hidden py-6'>
      {/* Main content area */}
      <div className='flex min-h-0 flex-1 flex-col gap-5 px-3'>
        <div
          className={clsx('flex transition-all duration-300', {
            'justify-center': !menuOpen,
            'justify-start': menuOpen,
          })}
        >
          <Button
            onClick={() => setMenuOpen(!menuOpen)}
            variant='ghost'
            className='text-text-main hover:bg-brand/15 dark:hover:bg-brand/15 rounded-full bg-transparent shadow-none dark:bg-transparent'
          >
            <Menu />
          </Button>
        </div>
        <div
          className={clsx('flex transition-all duration-1000', {
            'justify-center': !menuOpen,
            'justify-start': menuOpen,
          })}
        >
          <Link
            href='/chat'
            className='text-text-main hover:bg-brand/15 flex gap-1 rounded-full px-3 py-2 transition-colors'
          >
            <Plus />
            {menuOpen && 'New Chat'}
          </Link>
        </div>
        {/* Make the history div scrollable */}
        <div
          className={clsx('flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-2', {
            hidden: !menuOpen,
          })}
        >
          {isLoading ? (
            <div className='flex min-h-50 items-center justify-center'>
              <Spinner size='medium' className='text-white/80' />
            </div>
          ) : (
            history?.map((chat) => (
              <Link
                href={`/chat/${chat.chatId}`}
                className={clsx(
                  'text-text-main hover:bg-brand/15 mr-3 flex gap-2 rounded-full px-5 py-2 transition-colors',
                  {
                    'bg-brand/15': chat.chatId === pathID,
                  },
                )}
                key={chat.chatId}
              >
                <MessageCircle className='max-w-4 min-w-4' />
                <p className='truncate'>
                  {chat.messages[0].parts[0]?.type === 'text'
                    ? chat.messages[0].parts[0]?.text
                    : 'Untitled Chat'}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* AccountMenu at the bottom */}
      <div className='px-3'>
        <AccountMenu credits={newCredits?.credits || 0} userName={userName} />
      </div>
    </div>
  );
}
