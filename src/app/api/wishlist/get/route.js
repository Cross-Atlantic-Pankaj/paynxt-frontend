import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Wishlist from '@/models/Wishlist';
import Repcontent from '@/models/reports/repcontent';

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId } = body;

    const wishlistItems = await Wishlist.find({ userId }).populate('reportId');

    const reports = wishlistItems.map(item => item.reportId);

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
