import Pricing from "@/components/buy-credits/Pricing";
import Heading from "@/components/ui/Heading";
import { fetchPricingData } from "@/lib/utils";
import { FinalPriceType } from "@/lib/types";

export const dynamic = 'force-dynamic';

export default async function page() {
  const { prices, currency } = await fetchPricingData();
  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-[#f5d0fe] to-[#e879f9] dark:from-[#1e293b] dark:to-[#4c1d95]">
      <Heading />
      <Pricing prices={prices} currency={currency}/>
    </section>
  );
}
