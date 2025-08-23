import dbConnect from '@/lib/db';
import SectorDynamics from '@/models/category/b2c-payment-intelligence/SectorDynamics';

export async function GET(req, { params }) {
  await dbConnect();
  const { slug } = params;
  // console.log('Slug param in API:', slug);

  let data = await SectorDynamics.find({ slug }).sort({ createdAt: -1 });
  // console.log('Data with slug:', data);

  if (!data || data.length === 0) {
    data = await SectorDynamics.find({ slug: null }).sort({ createdAt: -1 });
    // console.log('Fallback data with slug null:', data);
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

