import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SavedArticle from '@/models/SavedArticle';
import BlogManager from '@/models/blog-page/blogcontent'; // Import BlogManager model
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
      console.log('Decoded JWT:', decoded);
    } catch (error) {
      console.error('JWT Error:', error.message, error);
      return NextResponse.json({ success: false, message: `Invalid token: ${error.message}` }, { status: 401 });
    }
    const savedArticles = await SavedArticle.find({ userId: decoded.userId }).lean();
    const blogSlugs = savedArticles.map((article) => article.slug);
    const blogs = await BlogManager.find({ slug: { $in: blogSlugs } })
      .select('imageIconurl category subcategory topic subtopic date slug title summary')
      .lean();
    console.log('Fetched Blogs:', blogs);
    // Map savedAt from savedArticles to blogs
    const enrichedBlogs = blogs.map((blog) => {
      const savedArticle = savedArticles.find((sa) => sa.slug === blog.slug);
      return { ...blog, savedAt: savedArticle?.savedAt };
    });
    return NextResponse.json({ success: true, data: enrichedBlogs });
  } catch (error) {
    console.error('Error fetching saved articles:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
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
      console.log('Decoded JWT:', decoded);
    } catch (error) {
      console.error('JWT Error:', error.message, error);
      return NextResponse.json({ success: false, message: `Invalid token: ${error.message}` }, { status: 401 });
    }
    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ success: false, message: 'Missing slug' }, { status: 400 });
    }
    const existing = await SavedArticle.findOne({ userId: decoded.userId, slug });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Article already saved' }, { status: 400 });
    }
    // Verify blog exists
    const blog = await BlogManager.findOne({ slug }).lean();
    if (!blog) {
      return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
    }
    const savedArticle = await SavedArticle.create({
      userId: decoded.userId,
      slug,
      savedAt: new Date(),
    });
    console.log('Saved Article:', savedArticle);
    return NextResponse.json({ success: true, message: 'Article saved', data: savedArticle });
  } catch (error) {
    console.error('Error saving article:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
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
      console.log('Decoded JWT:', decoded);
    } catch (error) {
      console.error('JWT Error:', error.message, error);
      return NextResponse.json({ success: false, message: `Invalid token: ${error.message}` }, { status: 401 });
    }
    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ success: false, message: 'Missing slug' }, { status: 400 });
    }
    const result = await SavedArticle.deleteOne({ userId: decoded.userId, slug });
    console.log('Delete Result:', result);
    return NextResponse.json({ success: true, message: 'Article removed' });
  } catch (error) {
    console.error('Error removing saved article:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}