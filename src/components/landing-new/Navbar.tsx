'use client';

import { FlowerIcon, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ModeToggle } from '@/components/design-system/mode-toggle';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const modeToggleTone = scrolled ? 'default' : 'overlay';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/90 dark:shadow-brand/20 shadow-lg backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
        <div className='flex items-center gap-2'>
          <div className='from-brand to-brand-hover shadow-brand/30 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br shadow-lg'>
            <FlowerIcon className='h-5 w-5 text-white' />
          </div>
          <span className='from-brand to-brand-hover bg-linear-to-r bg-clip-text text-xl font-bold text-transparent'>
            Beautycare AI
          </span>
        </div>

        <div className='hidden items-center gap-8 md:flex'>
          {['Features', 'How it Works', 'Pricing', 'FAQ'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replaceAll(' ', '-')}`}
              className={`font-medium transition-colors ${
                scrolled ? 'text-text-muted hover:text-brand' : 'text-white/90 hover:text-white'
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        <div className='hidden items-center gap-4 md:flex'>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <ModeToggle tone={modeToggleTone} />
          </motion.div>

          <Link
            href='/login'
            className={`font-medium transition-colors ${
              scrolled ? 'text-text-muted hover:text-brand' : 'text-white/90 hover:text-white'
            }`}
          >
            Sign In
          </Link>

          <Link
            href='/signup'
            className='bg-brand hover:bg-brand-hover inline-flex rounded-full px-6 py-2.5 transition-colors'
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='shadow-brand/30 inline-flex w-full items-center justify-center rounded-full font-semibold text-white shadow-lg'
            >
              Get Started
            </motion.div>
          </Link>
        </div>

        <div className='flex items-center gap-2 md:hidden'>
          <motion.div whileTap={{ scale: 0.9 }}>
            <ModeToggle tone={modeToggleTone} />
          </motion.div>

          <button
            className={`p-2 transition-colors ${scrolled ? 'text-text-muted' : 'text-white'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='bg-surface border-border-main overflow-hidden border-t md:hidden'
          >
            <div className='space-y-4 px-6 py-4'>
              {['Features', 'How it Works', 'Pricing', 'FAQ'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replaceAll(' ', '-')}`}
                  className='text-text-muted block font-medium'
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Link href='/signup' className='block'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='bg-brand inline-block w-full rounded-full py-3 text-center font-semibold text-white'
                >
                  Get Started
                </motion.div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
