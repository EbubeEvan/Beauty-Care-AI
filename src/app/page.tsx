import { Cta } from '@/components/landing-new/CTA';
import { Faq } from '@/components/landing-new/FAQ';
import { Features } from '@/components/landing-new/Features';
import { Footer } from '@/components/landing-new/Footer';
import { Hero } from '@/components/landing-new/Hero';
import { HowItWorks } from '@/components/landing-new/HowItWorks';
import { Navbar } from '@/components/landing-new/Navbar';
import { Pricing } from '@/components/landing-new/Pricing';
import { Testimonials } from '@/components/landing-new/Testimonials';

export default function Home() {
  return (
    <div className='bg-surface min-h-screen transition-colors duration-300'>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
