'use client';

import { Menu, Moon, Sparkles, Sun, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          <div className='from-brand to-brand-hover shadow-brand/30 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg'>
            <Sparkles className='h-5 w-5 text-white' />
          </div>
          <span className='from-brand to-brand-hover bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent'>
            Beautycare AI
          </span>
        </div>

        <div className='hidden items-center gap-8 md:flex'>
          {['Features', 'How it Works', 'Pricing', 'FAQ'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className={`font-medium transition-colors ${
                scrolled ? 'text-text-muted hover:text-brand' : 'text-white/90 hover:text-white'
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        <div className='hidden items-center gap-4 md:flex'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              scrolled
                ? 'bg-surface-muted text-text-muted hover:bg-brand-muted hover:text-brand'
                : 'bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
            }`}
          >
            {theme === 'light' ? <Moon className='h-5 w-5' /> : <Sun className='h-5 w-5' />}
          </motion.button>

          <button
            className={`font-medium transition-colors ${
              scrolled ? 'text-text-muted hover:text-brand' : 'text-white/90 hover:text-white'
            }`}
          >
            Sign In
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='bg-brand shadow-brand/30 hover:bg-brand-hover rounded-full px-6 py-2.5 font-semibold text-white shadow-lg transition-colors'
          >
            Get Started
          </motion.button>
        </div>

        <div className='flex items-center gap-2 md:hidden'>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              scrolled
                ? 'bg-surface-muted text-text-muted'
                : 'bg-white/10 text-white backdrop-blur-md'
            }`}
          >
            {theme === 'light' ? <Moon className='h-5 w-5' /> : <Sun className='h-5 w-5' />}
          </motion.button>

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
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className='text-text-muted block font-medium'
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button className='bg-brand w-full rounded-full py-3 font-semibold text-white'>
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
