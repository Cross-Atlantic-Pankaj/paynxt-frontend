import connectDB from '@/lib/db';
import Stats from '@/models/home-page/Stats';

export async function GET() {
  try {
    await connectDB();

    const stats = await Stats.find().sort({ createdAt: -1 }).limit(4);

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new Response(JSON.stringify({ error: 'Server error while fetching stats' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
