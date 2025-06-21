import connectDB from '@/lib/db';
import relart from '@/models/blog-page/relarticles';

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Step 1: Find the current article to extract its subcategory
    const currentArticle = await relart.findOne({ slug });

    if (!currentArticle || !currentArticle.subcategory) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const subcategory = currentArticle.subcategory;

    // Step 2: Find related articles (exclude current one)
    const relatedArticles = await relart
      .find({
        subcategory: { $regex: new RegExp(`^${subcategory}$`, 'i') },
        slug: { $ne: slug } // exclude current article
      })
      .sort({ date: -1, title: 1 })
      // most recent first
      .limit(5);

    return new Response(JSON.stringify(relatedArticles), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Error fetching related articles:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
