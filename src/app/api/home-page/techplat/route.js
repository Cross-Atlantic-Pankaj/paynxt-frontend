import dbConnect from '@/lib/db';
import TechnologyPlatform from '@/models/home-page/Techplat';

export async function GET() {
  try {
    await dbConnect();

    const platforms = await TechnologyPlatform.find({})
      .sort({ createdAt: -1 })
      .limit(1);

    return new Response(JSON.stringify(platforms), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching technology platforms:', error);
    return new Response(JSON.stringify({
      message: 'Server error',
      error: error.message || 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
