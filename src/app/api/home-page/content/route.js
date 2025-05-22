// src/app/api/home-page/content/route.js

import dbConnect from '@/lib/db';
import ResearchInsight from '@/models/home-page/content';

export async function GET() {
  try {
    await dbConnect();

    const allData = await ResearchInsight.find();

    const featuredResearch = allData.filter(
      item => item.sectionType === 'Featured Research'
    );
    const insights = allData.filter(
      item => item.sectionType === 'Insights'
    );

    return new Response(JSON.stringify({ featuredResearch, insights }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API Error:', error); // full error stack in terminal
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
