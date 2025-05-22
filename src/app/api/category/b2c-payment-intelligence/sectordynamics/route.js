import dbConnect from '@/lib/db';
import SectorDynamics from '@/models/category/b2c-payment-intelligence/SectorDynamics';

export async function GET() {
  try {
    await dbConnect();

    const data = await SectorDynamics.find({}).sort({ createdAt: -1 });

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ message: 'No sector dynamics found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching sector dynamics:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
