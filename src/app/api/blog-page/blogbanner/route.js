import connectDB from '@/lib/db';
import BlogBanner from '@/models/blog-page/blogbanner';

// Updated GET method
export async function GET() {
  try {
    await connectDB();

    const banners = await BlogBanner.find().sort({ createdAt: -1 });

    return new Response(JSON.stringify(banners), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Banner fetch error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

