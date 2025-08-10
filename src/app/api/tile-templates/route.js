import connectDB from '@/lib/db';
import TileTemplate from '@/models/TileTemplate';

// GET all tile templates
export async function GET() {
  try {
    await connectDB();

    const tileTemplates = await TileTemplate.find().sort({ createdAt: -1 });

    if (!tileTemplates || tileTemplates.length === 0) {
      return new Response(JSON.stringify({ message: 'No tile templates found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(tileTemplates), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching tile templates:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST a new tile template
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { name, type, jsxCode, backgroundColor, iconName, iconColor, iconSize, useTileBgEverywhere } = body;

    // Validate required fields
    if (!name || !type || !jsxCode) {
      return new Response(JSON.stringify({ error: 'Required fields missing' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newTileTemplate = new TileTemplate({
      name,
      type,
      jsxCode,
      backgroundColor,
      iconName,
      iconColor,
      iconSize,
      useTileBgEverywhere,
    });

    await newTileTemplate.save();

    return new Response(JSON.stringify(newTileTemplate), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error creating tile template:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
