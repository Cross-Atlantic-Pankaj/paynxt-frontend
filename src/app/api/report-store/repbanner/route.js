import connectDB from '@/lib/db';
import ViewTopBanner from '@/models/reports/repbanner';

export async function GET() {
  try {
    await connectDB();

    const latestBanner = await ViewTopBanner.findOne().sort({ createdAt: -1 });

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
