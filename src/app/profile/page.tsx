import { auth } from '@/auth';
import ProfileDetails from '@/components/Profile/ProfileDetails';
import Heading from '@/components/ui/Heading';
import { getUser } from '@/lib/fetchData';

export default async function page() {
  const session = await auth();
  const user = await getUser(session?.user?.email || '');

  return (
    <section className='bg-surface text-text-main min-h-dvh w-full px-4 transition-colors duration-300 sm:px-6'>
      <Heading />
      <div className='flex w-full justify-center'>
        <ProfileDetails user={user} />
      </div>
    </section>
  );
}
