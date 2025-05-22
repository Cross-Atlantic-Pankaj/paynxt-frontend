import connectDb from '@/lib/db';
import Products from '@/models/home-page/product';

export async function GET() {
  try {
    await connectDb();

    const allDocs = await Products.find().sort({ createdAt: -1 });

    const allProducts = allDocs.flatMap(doc =>
      doc.products.map(product => ({
        ...product.toObject(),
        mainTitle: doc.mainTitle,
        parentCreatedAt: doc.createdAt,
      }))
    );

    const sortedProducts = allProducts.sort(
      (a, b) => new Date(b.parentCreatedAt) - new Date(a.parentCreatedAt)
    );

    return new Response(JSON.stringify(sortedProducts.slice(0, 8)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to load products' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
