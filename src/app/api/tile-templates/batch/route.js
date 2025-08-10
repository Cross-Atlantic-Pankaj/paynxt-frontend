import connectDB from '@/lib/db';
import TileTemplate from '@/models/TileTemplate';

// POST - Fetch multiple tile templates by IDs
export async function POST(request) {
  try {
    await connectDB();
    
    const { ids } = await request.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid or missing IDs array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Filter out invalid ObjectIds
    const validIds = ids.filter(id => id && typeof id === 'string' && id.length === 24);
    
    if (validIds.length === 0) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch all tile templates in one query
    const tileTemplates = await TileTemplate.find({
      _id: { $in: validIds }
    }).lean();

    // Return array in same order as requested IDs
    const orderedTemplates = validIds.map(id => {
      const template = tileTemplates.find(t => t._id.toString() === id);
      return template || null;
    });

    return new Response(JSON.stringify(orderedTemplates), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching batch tile templates:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
