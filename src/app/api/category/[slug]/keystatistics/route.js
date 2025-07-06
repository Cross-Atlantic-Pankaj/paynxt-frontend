import dbConnect from '@/lib/db';
import KeyStatistics from '@/models/category/b2c-payment-intelligence/KeyStatistics';

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { slug } = params;

    if (!slug) {
      return new Response(JSON.stringify({ message: 'Slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // First, try to get data for given slug
    let statistics = await KeyStatistics.find({ slug })
      .sort({ createdAt: -1 })
      .limit(10);

    // Fallback to global (slug: null) if nothing found
    if (!statistics || statistics.length === 0) {
      statistics = await KeyStatistics.find({ slug: null })
        .sort({ createdAt: -1 })
        .limit(10);
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
