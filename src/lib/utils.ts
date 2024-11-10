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
    // Define the base URL dynamically
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';

    console.log("Base URL in production:", baseUrl);
    
    const response = await fetch(`${baseUrl}/api/prices`, {
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


