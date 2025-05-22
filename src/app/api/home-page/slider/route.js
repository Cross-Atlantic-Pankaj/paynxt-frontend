import connectDB from '@/lib/db';
import Slider from '@/models/home-page/Slider';

export async function GET() {
  try {
    await connectDB();

    const sliders = await Slider.find().sort({ createdAt: -1 }).limit(10);

    return new Response(JSON.stringify(sliders), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return new Response(JSON.stringify({ error: 'Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
