import connectDB from '@/lib/db';
import Repcontent from '@/models/reports/repcontent';

export async function GET() {
  try {
    // connect to DB
    await connectDB();

    // fetch reports, sorted by created date descending
    const reports = await Repcontent.find().sort({ createdAt: -1 });

    if (!reports || reports.length === 0) {
      return new Response(JSON.stringify({ message: 'No reports found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(reports), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
