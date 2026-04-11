/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Twitter,
} from 'lucide-react';
import { motion } from 'motion/react';

export const Footer = () => {
  return (
    <footer className='border-t border-white/10 bg-slate-900 py-16 text-slate-400 transition-colors duration-300'>
      <div className='mx-auto max-w-7xl px-6'>
        <div className='mb-12 grid gap-12 md:grid-cols-2 lg:grid-cols-5'>
          <div className='lg:col-span-2'>
            <div className='mb-4 flex items-center gap-2'>
              <div className='from-brand to-brand-hover flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br'>
                <Sparkles className='h-5 w-5 text-white' />
              </div>
              <span className='text-xl font-bold text-white'>Beautycare AI</span>
            </div>
            <p className='mb-6 max-w-sm leading-relaxed'>
              Revolutionizing beauty through artificial intelligence. Get personalized skincare and
              haircare recommendations tailored to your unique profile.
            </p>
            <div className='flex gap-4'>
              {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href='#'
                  whileHover={{ scale: 1.1, y: -2 }}
                  className='hover:bg-brand flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition-colors hover:text-white'
                >
                  <Icon className='h-5 w-5' />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className='mb-4 font-semibold text-white'>Product</h4>
            <ul className='space-y-3'>
              {['Features', 'Pricing', 'How it Works', 'API', 'Integrations'].map((item) => (
                <li key={item}>
                  <a href='#' className='hover:text-brand transition-colors'>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='mb-4 font-semibold text-white'>Company</h4>
            <ul className='space-y-3'>
              {['About Us', 'Blog', 'Careers', 'Press Kit', 'Partners'].map((item) => (
                <li key={item}>
                  <a href='#' className='hover:text-brand transition-colors'>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='mb-4 font-semibold text-white'>Support</h4>
            <ul className='space-y-3'>
              {[
                'Help Center',
                'Contact Us',
                'Privacy Policy',
                'Terms of Service',
                'Cookie Policy',
              ].map((item) => (
                <li key={item}>
                  <a href='#' className='hover:text-brand transition-colors'>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='mb-8 border-t border-slate-800 pt-8'>
          <div className='grid gap-6 md:grid-cols-3'>
            <div className='flex items-center gap-3'>
              <Mail className='text-brand h-5 w-5' />
              <span>support@beautycareai.com</span>
            </div>
            <div className='flex items-center gap-3'>
              <Phone className='text-brand h-5 w-5' />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className='flex items-center gap-3'>
              <MapPin className='text-brand h-5 w-5' />
              <span>San Francisco, CA</span>
            </div>
          </div>
        </div>

        <div className='flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 md:flex-row'>
          <p className='text-sm'>© 2026 Beautycare AI. All rights reserved.</p>
          <div className='flex items-center gap-6 text-sm'>
            <a href='#' className='transition-colors hover:text-white'>
              Privacy
            </a>
            <a href='#' className='transition-colors hover:text-white'>
              Terms
            </a>
            <a href='#' className='transition-colors hover:text-white'>
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
