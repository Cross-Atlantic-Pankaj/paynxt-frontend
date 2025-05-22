// src/app/api/home-page/topbanner/route.js
import connectDB from '@/lib/db';
import TopBanner from '@/models/home-page/TopBanner';

export async function GET() {
  try {
    await connectDB();

    const latestBanner = await TopBanner.findOne().sort({ createdAt: -1 });

    if (!latestBanner) {
      return new Response(JSON.stringify({ message: 'No banner found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(latestBanner), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Banner fetch error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
