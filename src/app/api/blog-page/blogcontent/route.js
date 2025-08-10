import connectDB from '@/lib/db';
import BlogManager from '@/models/blog-page/blogcontent';

// GET all blogs (latest first)
export async function GET() {
  try {
    await connectDB();

    const blogs = await BlogManager.find()
      .populate('tileTemplateId')
      .lean()
      .sort({ createdAt: -1 });

    // Ensure all blogs have a tileTemplateId field (even if null)
    const processedBlogs = blogs.map(blog => ({
      ...blog,
      tileTemplateId: blog.tileTemplateId || null
    }));

    if (!processedBlogs || processedBlogs.length === 0) {
      return new Response(JSON.stringify({ message: 'No blogs found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(processedBlogs), {
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

// POST a new blog
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { title, summary, articlePart1, articlePart2, advertisement } = body;

    // Optional: You can validate fields here
    if (!title || !summary || !articlePart1) {
      return new Response(JSON.stringify({ error: 'Required fields missing' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newBlog = new BlogManager({
      title,
      summary,
      articlePart1,
      articlePart2,
      advertisement,
    });

    await newBlog.save();

    return new Response(JSON.stringify(newBlog), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error creating blog:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
