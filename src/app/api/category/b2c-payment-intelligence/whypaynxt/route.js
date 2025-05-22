import dbConnect from '@/lib/db';
import WhyPayNXT360 from '@/models/category/b2c-payment-intelligence/WhyPayNXT360';

export async function GET() {
  try {
    await dbConnect();

    const latestEntry = await WhyPayNXT360.findOne().sort({ createdAt: -1 });

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
