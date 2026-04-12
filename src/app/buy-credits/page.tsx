import { auth } from '@/auth';
import Pricing from '@/components/buy-credits/Pricing';
import Heading from '@/components/ui/Heading';
import { getPricesForCurrentRequest, getUser } from '@/lib/fetchData';

export const dynamic = 'force-dynamic';

export default async function page() {
  const session = await auth();
  const user = await getUser(session?.user?.email || '');
  const pricing = await getPricesForCurrentRequest();

  return (
    <section className='bg-surface text-text-main min-h-screen w-full px-4 transition-colors duration-300 sm:px-6'>
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
