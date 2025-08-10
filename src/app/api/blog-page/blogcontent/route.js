import connectDB from '@/lib/db';
import BlogManager from '@/models/blog-page/blogcontent';
import TileTemplate from '@/models/TileTemplate';

// GET all blogs (latest first)
export async function GET() {
  try {
    await connectDB();

    // First fetch blogs without populate to avoid connection issues
    const blogs = await BlogManager.find()
      .lean()
      .sort({ createdAt: -1 });

    if (!blogs || blogs.length === 0) {
      return new Response(JSON.stringify({ message: 'No blogs found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract unique tileTemplateIds (filter out null/undefined)
    const tileTemplateIds = [...new Set(
      blogs
        .map(blog => blog.tileTemplateId)
        .filter(id => id && typeof id === 'string' && id.length === 24)
    )];

    // Fetch tile templates in batch if we have any IDs
    let tileTemplatesMap = new Map();
    if (tileTemplateIds.length > 0) {
      try {
        const tileTemplates = await TileTemplate.find({
          _id: { $in: tileTemplateIds }
        }).lean();
        
        tileTemplates.forEach(template => {
          tileTemplatesMap.set(template._id.toString(), template);
        });
      } catch (tileError) {
        console.warn('Failed to fetch tile templates:', tileError);
        // Continue without tile templates
      }
    }

    // Join the data manually
    const processedBlogs = blogs.map(blog => ({
      ...blog,
      tileTemplateId: blog.tileTemplateId ? 
        tileTemplatesMap.get(blog.tileTemplateId.toString()) || blog.tileTemplateId : 
        null
    }));

    return new Response(JSON.stringify(processedBlogs), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      },
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
