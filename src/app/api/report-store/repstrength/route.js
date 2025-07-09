import connectDB from '@/lib/db';
import Strength from '@/models/reports/repstrength';

export async function GET() {
  try {
    await connectDB();

    const data = await Strength.find({})
      .sort({ createdAt: -1 })
      .limit(3);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching strengths:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch strengths',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
