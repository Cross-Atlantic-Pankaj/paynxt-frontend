import connectDB from '@/lib/db';
import BlogSlider from '@/models/blog-page/blogslider';

export async function GET() {
  try {
    await connectDB();

    const sliders = await BlogSlider.find()
      .populate('tileTemplateId')
      .lean()
      .sort({ createdAt: -1 })
      .limit(10);

    // Ensure all sliders have a tileTemplateId field (even if null)
    const processedSliders = sliders.map(slider => ({
      ...slider,
      tileTemplateId: slider.tileTemplateId || null
    }));

    return new Response(JSON.stringify(processedSliders), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching sliders:', error);
    
    // If populate fails, try without it as fallback
    try {
      const sliders = await BlogSlider.find()
        .lean()
        .sort({ createdAt: -1 })
        .limit(10);

      // Ensure all sliders have a tileTemplateId field (set to null)
      const processedSliders = sliders.map(slider => ({
        ...slider,
        tileTemplateId: null
      }));

      return new Response(JSON.stringify(processedSliders), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (fallbackError) {
      console.error('Fallback fetch also failed:', fallbackError);
      return new Response(JSON.stringify({ error: 'Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}
