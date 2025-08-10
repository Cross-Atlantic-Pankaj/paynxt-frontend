import connectDB from '@/lib/db';
import BlogSlider from '@/models/blog-page/blogslider';
import TileTemplate from '@/models/TileTemplate';

export async function GET() {
  try {
    await connectDB();

    // First fetch sliders without populate to avoid connection issues
    const sliders = await BlogSlider.find()
      .lean()
      .sort({ createdAt: -1 })
      .limit(10);

    if (!sliders || sliders.length === 0) {
      return new Response(JSON.stringify({ message: 'No sliders found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract unique tileTemplateIds (filter out null/undefined)
    const tileTemplateIds = [...new Set(
      sliders
        .map(slider => slider.tileTemplateId)
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
    const processedSliders = sliders.map(slider => ({
      ...slider,
      tileTemplateId: slider.tileTemplateId ? 
        tileTemplatesMap.get(slider.tileTemplateId.toString()) || slider.tileTemplateId : 
        null
    }));

    return new Response(JSON.stringify(processedSliders), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      },
    });

  } catch (error) {
    console.error('Error fetching sliders:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
