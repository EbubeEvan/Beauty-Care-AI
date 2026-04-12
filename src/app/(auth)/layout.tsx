import Heading from '@/components/ui/Heading';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className='bg-surface text-text-main min-h-screen transition-colors duration-300'>
      <Heading />
      {children}
    </section>
  );
}
