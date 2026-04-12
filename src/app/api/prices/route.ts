export const dynamic = 'force-dynamic';

import { getPrices } from '@/lib/fetchData';

export async function GET(req: Request) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const pricing = await getPrices(clientIp);

    return new Response(JSON.stringify(pricing), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch prices:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch pricing information' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
