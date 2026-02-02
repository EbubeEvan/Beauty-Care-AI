'use client';

import clsx from 'clsx';

import ChatHeader from '@/components/chat/ChatHeader';
import SideNav from '@/components/chat/SideNav';
import { useFetchHistory } from '@/hooks/useFetchHistory';
import useStore from '@/lib/store/useStore';

export default function LayoutContent({
  children,
  id,
  email,
  username,
}: Readonly<{
  children: React.ReactNode;
  id?: string;
  email?: string;
  username: string;
}>) {
  const { data: history } = useFetchHistory(id!);
  const { menuOpen } = useStore();

  console.log(history);

  return (
    <div className='flex h-full w-full'>
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 overflow-x-hidden overflow-y-auto bg-pink-500 transition-all dark:bg-purple-500',
          {
            'max-md:translate-x-[-100%] md:w-[5%]': !menuOpen,
            'max-md:w-[80%] min-[1280px]:w-[21%] md:w-[32%] lg:w-[20%]': menuOpen,
          },
        )}
      >
        <SideNav id={id} email={email!} userName={username} />
      </aside>
      <div
        className={clsx(
          'h-screen flex-1 overflow-hidden bg-gradient-to-br from-[#f5d0fe] to-[#e879f9] transition-all dark:from-[#1e293b] dark:to-[#4c1d95]',
          {
            'w-full md:w-[95%] md:pl-10 lg:pl-14': !menuOpen,
            'md:ml-[32%] md:w-[68%] lg:ml-[20%] lg:w-[80%]': menuOpen,
          },
        )}
      >
        <header className='w-full'>
          <ChatHeader />
        </header>
        <main
          className='flex-1 px-[2rem]'
          // onClick={() => setMenuOpen(false)}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
