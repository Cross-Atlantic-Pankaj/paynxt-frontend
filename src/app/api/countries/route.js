import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import repformats from '@/models/reports/repformat';

export async function GET() {
  try {
    await connectDB();

    const countries = await repformats.find().sort({ repFormatName: 1 }).lean();

    const countryNames = countries.map(country => country.repFormatName);

    return NextResponse.json(countryNames, { status: 200 });
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

