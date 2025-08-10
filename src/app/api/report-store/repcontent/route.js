import connectDB from '@/lib/db';
import Repcontent from '@/models/reports/repcontent';
import TileTemplate from '@/models/TileTemplate';

export async function GET() {
  try {
    await connectDB();

    // First fetch reports without populate to avoid connection issues
    const reports = await Repcontent.find()
      .lean()
      .sort({ 
        Featured_Report_Status: -1,  // Featured reports first (1 comes before 0)
        createdAt: -1                 // Within each group, sort by date descending
      });

    if (!reports || reports.length === 0) {
      return new Response(JSON.stringify({ message: 'No reports found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract unique tileTemplateIds (filter out null/undefined)
    const tileTemplateIds = [...new Set(
      reports
        .map(report => report.tileTemplateId)
        .filter(id => id && typeof id === 'string' && id.length === 24)
    )];

    // Fetch tile templates in batch if we have any IDs
    let tileTemplatesMap = new Map();
    if (tileTemplateIds.length > 0) {
      try {
        const tileTemplates = await TileTemplate.find({
          _id: { $in: tileTemplateIds }
        }).lean();
        
        tileTemplates.forEach(template => {
          tileTemplatesMap.set(template._id.toString(), template);
        });
      } catch (tileError) {
        console.warn('Failed to fetch tile templates:', tileError);
        // Continue without tile templates
      }
    }

    // Join the data manually
    const processedReports = reports.map(report => ({
      ...report,
      tileTemplateId: report.tileTemplateId ? 
        tileTemplatesMap.get(report.tileTemplateId.toString()) || report.tileTemplateId : 
        null
    }));

    return new Response(JSON.stringify(processedReports), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      },
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
