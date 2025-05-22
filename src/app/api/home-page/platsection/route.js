import dbConnect from '@/lib/db';
import PlatformSection from '@/models/home-page/platformSection';

export async function GET() {
  try {
    await dbConnect();

    const latestSections = await PlatformSection.find()
      .sort({ createdAt: -1 })
      .limit(3);

    return new Response(JSON.stringify(latestSections), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching platform sections:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch platform section' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
