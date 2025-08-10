import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Make sure this path is correct
import FeatRepo from '@/models/blog-page/featreport'; // Your schema file

export const dynamic = 'force-dynamic'; // Optional for latest data on every request

export async function GET() {
  try {
    await connectDB();

    const featuredReports = await FeatRepo.find()
      .populate('blogs.tileTemplateId')
      .lean()
      .sort({ createdAt: -1 });

    // Ensure all featured reports have tileTemplateId fields (even if null)
    const processedReports = featuredReports.map(report => ({
      ...report,
      blogs: report.blogs ? report.blogs.map(blog => ({
        ...blog,
        tileTemplateId: blog.tileTemplateId || null
      })) : []
    }));

    return new Response(JSON.stringify(processedReports), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching featured reports:', error);
    return NextResponse.json({ error: 'Failed to fetch featured reports' }, { status: 500 });
  }
}
