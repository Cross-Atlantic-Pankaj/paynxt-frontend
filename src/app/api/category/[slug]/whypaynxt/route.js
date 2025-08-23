import dbConnect from '@/lib/db';
import WhyPayNXT360 from '@/models/category/b2c-payment-intelligence/WhyPayNXT360';

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { slug } = params;
    // console.log('Slug param in API:', slug);

    let latestEntry = null;

    if (slug) {
      // Try to find entry for this slug
      latestEntry = await WhyPayNXT360.findOne({ slug }).sort({ createdAt: -1 });
    }

    if (!latestEntry) {
      // Fallback: find global entry (where slug is null)
      latestEntry = await WhyPayNXT360.findOne({ slug: null }).sort({ createdAt: -1 });
    }

    if (!latestEntry) {
      return new Response(JSON.stringify({ message: 'No entry found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(latestEntry), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching WhyPayNXT360 data:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
