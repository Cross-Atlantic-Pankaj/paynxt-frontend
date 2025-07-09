// src/app/api/report-store/[slug]/route.js
import connectDB from '@/lib/db';
import Repcontent from '@/models/reports/repcontent';

export async function GET(req, context) {
  try {
    const { slug } = context.params;
    await connectDB();

    const report = await Repcontent.findOne({ seo_url: slug }).lean();

    if (!report) {
      return new Response(JSON.stringify({ success: false, message: 'Report not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, data: report }), { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), { status: 500 });
  }
}
