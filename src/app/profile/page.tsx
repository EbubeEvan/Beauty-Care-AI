import { auth } from '@/auth';
import ProfileDetails from '@/components/Profile/ProfileDetails';
import Heading from '@/components/ui/Heading';
import { getUser } from '@/lib/fetchData';

export default async function page() {
  const session = await auth();
  const user = await getUser(session?.user?.email || '');

  return (
    <section className='min-h-[100dvh] w-full bg-gradient-to-br from-[#f5d0fe] to-[#e879f9] max-md:px-3 dark:from-[#1e293b] dark:to-[#4c1d95]'>
      <Heading />
      <div className='flex w-full justify-center'>
        <ProfileDetails user={user} />
      </div>
    </section>
  );
}
