import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Wishlist from '@/models/Wishlist';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    await connectDB();

    // Verify JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized', success: false }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token', success: false }, { status: 401 });
    }

    const { seo_url } = await req.json();
    if (!seo_url) {
      return NextResponse.json({ message: 'Missing seo_url', success: false }, { status: 400 });
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({ userId: decoded.userId, seo_url });
    if (existing) {
      return NextResponse.json({ message: 'Already in wishlist', success: false }, { status: 400 });
    }

    // Add to wishlist
    await Wishlist.create({ userId: decoded.userId, seo_url, addedAt: new Date() });

    return NextResponse.json({ message: 'Added to wishlist', success: true });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json({ message: 'Internal server error', success: false }, { status: 500 });
  }
}