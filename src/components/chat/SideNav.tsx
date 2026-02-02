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
    <div className='flex h-full flex-col py-6'>
      {/* Main content area */}
      <div
        className='flex flex-grow flex-col gap-5 px-3'
        style={{ maxHeight: 'calc(100vh - 100px)' }}
      >
        <div
          className={clsx('flex transition-all duration-300', {
            'justify-center': !menuOpen,
            'justify-start': menuOpen,
          })}
        >
          <Button
            onClick={() => setMenuOpen(!menuOpen)}
            className='rounded-full hover:bg-pink-300 dark:hover:bg-purple-400'
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
            className='flex gap-1 rounded-full px-3 py-2 text-white hover:bg-pink-300 dark:hover:bg-purple-400'
          >
            <Plus />
            {menuOpen && 'New Chat'}
          </Link>
        </div>
        {/* Make the history div scrollable */}
        <div
          className={clsx(
            'flex flex-col gap-3 overflow-y-auto', // Enables vertical scrolling
            { hidden: !menuOpen },
          )}
          style={{ maxHeight: 'calc(100vh - 200px)' }} // Adjust the height as needed
        >
          {isLoading ? (
            <Spinner size='medium' className='text-gray-200 dark:text-gray-700' />
          ) : (
            history?.map((chat) => (
              <Link
                href={`/chat/${chat.chatId}`}
                className={clsx(
                  'mr-3 flex gap-2 rounded-full px-5 py-2 text-white hover:bg-pink-300 dark:hover:bg-purple-400',
                  {
                    'bg-pink-300 dark:bg-purple-400': chat.chatId === pathID,
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
