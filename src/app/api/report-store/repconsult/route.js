import connectDB from '@/lib/db';
import Consultsec from '@/models/reports/repconsult'; // Adjust path if needed

export async function GET() {
  try {
    await connectDB();
    const consults = await Consultsec.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(consults), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching consults:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
