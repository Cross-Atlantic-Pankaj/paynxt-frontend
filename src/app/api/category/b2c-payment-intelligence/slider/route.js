// src/app/api/category/b2c-payment-intelligence/slider/route.js
import dbConnect from '@/lib/db';
import ProdSlider from '@/models/category/b2c-payment-intelligence/ProdSlider';

export async function GET() {
  try {
    await dbConnect();

    const sliders = await ProdSlider.find()
      .sort({ createdAt: -1 })
      .limit(10); // fetch latest 10

    return new Response(JSON.stringify(sliders), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch sliders' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
