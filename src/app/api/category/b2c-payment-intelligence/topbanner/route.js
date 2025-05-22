import dbConnect from '@/lib/db';
import ProdTopBanner from '@/models/category/b2c-payment-intelligence/ProdTopBanner';

export async function GET() {
  try {
    await dbConnect();

    const latestBanner = await ProdTopBanner.findOne().sort({ createdAt: -1 });

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
    console.error('Error fetching top banner:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
