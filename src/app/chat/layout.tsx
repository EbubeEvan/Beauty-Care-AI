import { Metadata } from 'next';

import { auth } from '@/auth';
import LayoutContent from '@/components/chat/LayoutContent';
import { getUser } from '@/lib/fetchData';

export const metadata: Metadata = {
  title: 'chat',
};

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const user = await getUser(session?.user?.email || '');

  return (
    <div>
      <LayoutContent
        id={user?._id}
        email={session?.user?.email || ''}
        username={`${user?.firstName || ''} ${user?.lastName || ''}`}
      >
        {children}
      </LayoutContent>
    </div>
  );
}
