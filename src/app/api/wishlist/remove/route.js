import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Wishlist from '@/models/Wishlist';

export async function POST(req) {
  try {
    await connectDB();
    const { userId, reportId } = await req.json();

    if (!userId || !reportId) {
      return NextResponse.json({ success: false, message: 'Missing userId or reportId' }, { status: 400 });
    }

    const deleted = await Wishlist.findOneAndDelete({ userId, reportId });

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Item not found in wishlist' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Report removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
