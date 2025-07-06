import dbConnect from '@/lib/db';
import SectionThree from '@/models/category/b2c-payment-intelligence/SectionThree';

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { slug } = params;

    if (!slug) {
      return new Response(JSON.stringify({ message: 'Slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // First, try to find section data specific to this slug
    let sections = await SectionThree.find({ slug })
      .sort({ createdAt: -1 })
      .limit(3);

    // If nothing found, fallback to global (slug: null)
    if (!sections || sections.length === 0) {
      sections = await SectionThree.find({ slug: null })
        .sort({ createdAt: -1 })
        .limit(3);
    }

    return new Response(JSON.stringify(sections || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching section three data:', error);
    return new Response(JSON.stringify({ error: 'Server error while fetching section data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
