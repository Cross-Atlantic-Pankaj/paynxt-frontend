import connectDB from '@/lib/db';
import BlogManager from '@/models/blog-page/blogcontent';

export async function GET() {
  try {
    await connectDB();

    // Fetch the 10 latest blog entries
    const latestBlogs = await BlogManager.find().sort({ createdAt: -1 }).limit(10);

    if (!latestBlogs || latestBlogs.length === 0) {
      return new Response(JSON.stringify({ message: 'No blogs found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(latestBlogs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching blogs:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
