import connectDB from '@/lib/db';
import BlogSlider from '@/models/blog-page/blogslider';

export async function GET() {
  try {
    await connectDB();

    const sliders = await BlogSlider.find().sort({ createdAt: -1 }).limit(10);

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
