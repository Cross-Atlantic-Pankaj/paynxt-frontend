import dbConnect from '@/lib/db';
import KeyStatistics from '@/models/category/b2c-payment-intelligence/KeyStatistics';

export async function GET() {
  try {
    await dbConnect();

    const statistics = await KeyStatistics.find()
      .sort({ createdAt: -1 })  // Sort by newest
      .limit(10);                // Limit to top 4

    if (!statistics || statistics.length === 0) {
      return new Response(JSON.stringify({ message: 'No key statistics found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(statistics), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching key statistics:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
