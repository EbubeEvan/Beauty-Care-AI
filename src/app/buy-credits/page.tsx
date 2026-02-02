import { auth } from '@/auth';
import Pricing from '@/components/buy-credits/Pricing';
import Heading from '@/components/ui/Heading';
import { getUser } from '@/lib/fetchData';

export const dynamic = 'force-dynamic';

export default async function page() {
  const session = await auth();
  const user = await getUser(session?.user?.email || '');

  return (
    <section className='min-h-screen w-full bg-gradient-to-br from-[#f5d0fe] to-[#e879f9] dark:from-[#1e293b] dark:to-[#4c1d95]'>
      <Heading />
      <Pricing email={session?.user?.email || ''} id={user?._id || ''} />
    </section>
  );
}
