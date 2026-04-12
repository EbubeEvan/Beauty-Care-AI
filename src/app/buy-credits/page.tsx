import { headers } from 'next/headers';

import { auth } from '@/auth';
import Pricing from '@/components/buy-credits/Pricing';
import Heading from '@/components/ui/Heading';
import { getPrices, getUser } from '@/lib/fetchData';

export const dynamic = 'force-dynamic';

export default async function page() {
  const session = await auth();
  const user = await getUser(session?.user?.email || '');
  const requestHeaders = await headers();
  const clientIp =
    requestHeaders.get('x-forwarded-for')?.split(',')[0] ||
    requestHeaders.get('x-real-ip') ||
    '127.0.0.1';
  const pricing = await getPrices(clientIp);

  return (
    <section className='bg-surface text-text-main min-h-screen w-full px-4 py-10 transition-colors duration-300 sm:px-6'>
      <Heading />
      <Pricing
        email={session?.user?.email || ''}
        id={user?._id || ''}
        prices={pricing.prices}
        currency={pricing.currency}
      />
    </section>
  );
}
