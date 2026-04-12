import { auth } from '@/auth';
import NewChat from '@/components/chat/NewChat';
import { getUser } from '@/lib/fetchData';

export default async function page() {
  const session = await auth();
  const user = await getUser(session?.user?.email || '');

  return (
    <div className='bg-surface text-text-main h-full w-full overflow-hidden transition-colors duration-300'>
      <NewChat username={user?.firstName || 'User'} />
    </div>
  );
}
