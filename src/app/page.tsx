import About from "@/components/landing/About";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Heading from "@/components/ui/Heading";
import Hero from "@/components/landing/Hero";
import Testimonials from "@/components/landing/Testimonials";

export default function Home() {
  return (
    <main className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-[#f5d0fe] to-[#e879f9] dark:from-[#1e293b] dark:to-[#4c1d95]">
      
      <section className="flex-1">
        <Hero />
        <About />
        <Features />
        <Testimonials />
      </section>
      <Footer />
    </main>
  );
}
