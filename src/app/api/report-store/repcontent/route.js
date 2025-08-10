import connectDB from '@/lib/db';
import Repcontent from '@/models/reports/repcontent';

export async function GET() {
  try {
    // connect to DB
    await connectDB();

    // First, try to fetch with populate - handle gracefully if some documents don't have the field
    let reports;
    try {
      reports = await Repcontent.find()
        .populate('tileTemplateId')  // Simple populate - Mongoose will handle missing fields gracefully
        .lean()
        .sort({ 
          Featured_Report_Status: -1,  // Featured reports first (1 comes before 0)
          createdAt: -1                 // Within each group, sort by date descending
        });
    } catch (populateError) {
      console.warn('Populate failed, fetching without populate:', populateError);
      // Fallback to fetching without populate
      reports = await Repcontent.find()
        .lean()
        .sort({ 
          Featured_Report_Status: -1,
          createdAt: -1
        });
    }

    if (!reports || reports.length === 0) {
      return new Response(JSON.stringify({ message: 'No reports found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Process reports to ensure consistent structure
    const processedReports = reports.map(report => ({
      ...report,
      // Ensure tileTemplateId field exists (even if null) for all documents
      tileTemplateId: report.hasOwnProperty('tileTemplateId') ? report.tileTemplateId : null
    }));

    return new Response(JSON.stringify(processedReports), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    
    // If populate fails, try without it as fallback
    try {
      const reports = await Repcontent.find()
        .lean()
        .sort({ 
          Featured_Report_Status: -1,  // Featured reports first
          createdAt: -1                 // Within each group, sort by date descending
        });

      if (!reports || reports.length === 0) {
        return new Response(JSON.stringify({ message: 'No reports found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Ensure all reports have a tileTemplateId field (set to null)
      const processedReports = reports.map(report => ({
        ...report,
        tileTemplateId: null
      }));

      return new Response(JSON.stringify(processedReports), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (fallbackError) {
      console.error('Fallback fetch also failed:', fallbackError);
      return new Response(JSON.stringify({ message: 'Server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}
