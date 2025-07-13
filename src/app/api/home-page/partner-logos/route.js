// src/app/api/home-page/partner-logos/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PartnerLogo from '@/models/home-page/partnerlogo';

export async function GET() {
  try {
    await connectDB();
    const logos = await PartnerLogo.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: logos });
  } catch (error) {
    console.error('Partner logos GET Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
