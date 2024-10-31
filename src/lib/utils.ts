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

export async function fetchPricingData() {
  try {
    const response = await fetch('http://localhost:3000/api/prices', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-store',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetching pricing data failed:", error);
    return { prices: [], currency: 'USD' }; // Default or fallback data
  }
}

