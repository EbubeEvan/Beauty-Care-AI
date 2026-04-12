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
  const { menuOpen, setMenuOpen } = useStore();

  console.log(history);

  return (
    <div className='bg-surface text-text-main flex h-screen w-full overflow-hidden'>
      <aside
        className={clsx(
          'bg-brand-muted text-text-main fixed inset-y-0 left-0 z-40 overflow-hidden transition-all',
          {
            'max-md:-translate-x-full md:w-[5%]': !menuOpen,
            'max-md:w-[80%] min-[1280px]:w-[21%] md:w-[32%] lg:w-[20%]': menuOpen,
          },
        )}
      >
        <SideNav id={id} email={email!} userName={username} />
      </aside>
      {menuOpen && (
        <button
          type='button'
          aria-label='Close side navigation'
          className='fixed inset-y-0 right-0 z-30 w-[20%] bg-transparent md:hidden'
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div
        className={clsx(
          'bg-surface flex h-screen min-h-0 flex-1 flex-col overflow-hidden transition-all',
          {
            'w-full md:w-[95%] md:pl-10 lg:pl-14': !menuOpen,
            'md:ml-[32%] md:w-[68%] lg:ml-[20%] lg:w-[80%]': menuOpen,
          },
        )}
      >
        <header className='w-full'>
          <ChatHeader />
        </header>
        <main className='flex min-h-0 flex-1 overflow-hidden px-4 md:px-8'>{children}</main>
      </div>
    </div>
  );
}
