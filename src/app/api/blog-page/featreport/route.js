import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Make sure this path is correct
import FeatRepo from '@/models/blog-page/featreport'; // Your schema file

export const dynamic = 'force-dynamic'; // Optional for latest data on every request

export async function GET() {
  try {
    await connectDB();

    const featuredReports = await FeatRepo.find().sort({ createdAt: -1 }).limit(5); // Get latest first

    return NextResponse.json(featuredReports);
  } catch (error) {
    console.error('Error fetching featured reports:', error);
    return NextResponse.json({ error: 'Failed to fetch featured reports' }, { status: 500 });
  }
}
