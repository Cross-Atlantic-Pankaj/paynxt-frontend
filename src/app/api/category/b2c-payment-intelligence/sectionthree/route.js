import dbConnect from '@/lib/db';
import SectionThree from '@/models/category/b2c-payment-intelligence/SectionThree';

export async function GET() {
  try {
    await dbConnect();

    const latestSections = await SectionThree.find()
      .sort({ createdAt: -1 })  // Most recent entries first
      .limit(3);                // Adjust the number as needed

    return new Response(JSON.stringify(latestSections), {
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
