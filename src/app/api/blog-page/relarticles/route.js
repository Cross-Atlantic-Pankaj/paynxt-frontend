import connectDB from '@/lib/db';
import relart from '@/models/blog-page/relarticles';

export async function GET() {
  try {
    await connectDB();
    const articles = await relart.find().sort({ createdAt: -1 }).limit(5); // Optional limit
    return new Response(JSON.stringify(articles), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error fetching related articles:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
