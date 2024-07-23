import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import markdownit from 'markdown-it';
import DOMPurify from 'dompurify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sanitizeMessage = (message : string) => {
  const md = markdownit();
  const dirty = md.render(message);
  return DOMPurify.sanitize(dirty);
};