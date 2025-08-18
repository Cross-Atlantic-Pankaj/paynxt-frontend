import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SavedArticle from '@/models/SavedArticle';
import BlogManager from '@/models/blog-page/blogcontent';
import TileTemplate from '@/models/TileTemplate';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    await connectDB();
    
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid Authorization header:', authHeader);
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log('Decoded JWT:', decoded);
    } catch (error) {
      console.error('JWT Error:', error.message, error);
      return NextResponse.json({ success: false, message: `Invalid token: ${error.message}` }, { status: 401 });
    }
    
    const savedArticles = await SavedArticle.find({ userId: decoded.userId }).lean();
    
    if (!savedArticles || savedArticles.length === 0) {
      return NextResponse.json({ 
        success: true, 
        data: [],
        message: 'No saved articles found'
      });
    }
    
    const blogSlugs = savedArticles.map((article) => article.slug);
    const blogs = await BlogManager.find({ slug: { $in: blogSlugs } })
      .select('imageIconurl category subcategory topic subtopic date slug title summary tileTemplateId')
      .lean();
    
    if (!blogs || blogs.length === 0) {
      return NextResponse.json({ 
        success: true, 
        data: [],
        message: 'No matching blogs found'
      });
    }
    
    // Extract unique tileTemplateIds and fetch them in batch
    const tileTemplateIds = [...new Set(
      blogs
        .map(blog => blog.tileTemplateId)
        .filter(id => id && typeof id === 'string' && id.length === 24)
    )];

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
      }
    }
    
    // Map savedAt from savedArticles to blogs and join tile templates
    const enrichedBlogs = blogs.map((blog) => {
      const savedArticle = savedArticles.find((sa) => sa.slug === blog.slug);
      return { 
        ...blog, 
        savedAt: savedArticle?.savedAt,
        tileTemplateId: blog.tileTemplateId ? 
          tileTemplatesMap.get(blog.tileTemplateId.toString()) || blog.tileTemplateId : 
          null
      };
    });

    // Sort by savedAt (most recent first)
    enrichedBlogs.sort((a, b) => {
      if (!a.savedAt || !b.savedAt) return 0;
      return new Date(b.savedAt) - new Date(a.savedAt);
    });
    
    return NextResponse.json({ 
      success: true, 
      data: enrichedBlogs 
    }, {
      headers: {
        'Cache-Control': 'private, no-cache', // Private data, don't cache
      }
    });
    
  } catch (error) {
    console.error('Error fetching saved articles:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
