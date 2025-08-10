import connectDB from '@/lib/db';
import TileTemplate from '@/models/TileTemplate';

// GET tile template by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Tile template ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const tileTemplate = await TileTemplate.findById(id);

    if (!tileTemplate) {
      return new Response(JSON.stringify({ message: 'Tile template not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(tileTemplate), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching tile template:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
