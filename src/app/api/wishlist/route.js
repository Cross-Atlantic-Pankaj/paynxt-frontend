import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Wishlist from '@/models/Wishlist';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    await connectDB();

    // Verify JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Fetch wishlist for the user
    const wishlist = await Wishlist.find({ userId: decoded.userId }).lean();

    // Return array of seo_urls
    return NextResponse.json(wishlist.map(item => ({ seo_url: item.seo_url })));
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    // Verify JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { seo_url } = await req.json();
    if (!seo_url) {
      return NextResponse.json({ message: 'Missing seo_url' }, { status: 400 });
    }

    // Add to wishlist
    await Wishlist.updateOne(
      { userId: decoded.userId, seo_url },
      { $set: { userId: decoded.userId, seo_url, addedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Added to wishlist' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();

    // Verify JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { seo_url } = await req.json();
    if (!seo_url) {
      return NextResponse.json({ message: 'Missing seo_url' }, { status: 400 });
    }

    // Remove from wishlist
    await Wishlist.deleteOne({ userId: decoded.userId, seo_url });

    return NextResponse.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}