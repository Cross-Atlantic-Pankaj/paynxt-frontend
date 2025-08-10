import connectDB from '@/lib/db';
import BlogManager from '@/models/blog-page/blogcontent';

export async function GET() {
  try {
    await connectDB();

    // Fetch the 10 latest blog entries with populated tileTemplateId
    const latestBlogs = await BlogManager.find()
      .populate('tileTemplateId')
      .lean()
      .sort({ createdAt: -1 })
      .limit(10);

    if (!latestBlogs || latestBlogs.length === 0) {
      return new Response(JSON.stringify({ message: 'No blogs found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ensure all blogs have a tileTemplateId field (even if null)
    const processedBlogs = latestBlogs.map(blog => ({
      ...blog,
      tileTemplateId: blog.tileTemplateId || null
    }));

    return new Response(JSON.stringify(processedBlogs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching blogs:', error);
    
    // If populate fails, try without it as fallback
    try {
      const latestBlogs = await BlogManager.find()
        .lean()
        .sort({ createdAt: -1 })
        .limit(10);

      if (!latestBlogs || latestBlogs.length === 0) {
        return new Response(JSON.stringify({ message: 'No blogs found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Ensure all blogs have a tileTemplateId field (set to null)
      const processedBlogs = latestBlogs.map(blog => ({
        ...blog,
        tileTemplateId: null
      }));

      return new Response(JSON.stringify(processedBlogs), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (fallbackError) {
      console.error('Fallback fetch also failed:', fallbackError);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}
