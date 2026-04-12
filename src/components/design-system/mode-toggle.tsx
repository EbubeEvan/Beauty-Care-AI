'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const modeToggleVariants = cva('border-none shadow-none', {
  variants: {
    tone: {
      default:
        'bg-transparent text-text-main hover:bg-surface-muted dark:bg-transparent dark:text-text-main dark:hover:bg-surface-muted',
      overlay:
        'bg-transparent text-white hover:bg-white/10 dark:bg-transparent dark:text-white dark:hover:bg-white/10',
    },
  },
  defaultVariants: {
    tone: 'default',
  },
});

type ModeToggleProps = React.ComponentPropsWithoutRef<typeof Button> &
  VariantProps<typeof modeToggleVariants>;

export function ModeToggle({ className, tone, ...props }: Readonly<ModeToggleProps>) {
  const { resolvedTheme, setTheme } = useTheme();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    props.onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      size='icon'
      className={cn(modeToggleVariants({ tone }), className)}
      onClick={handleClick}
      {...props}
    >
      <Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
      <Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
