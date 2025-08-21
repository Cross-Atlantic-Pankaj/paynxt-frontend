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
    const currentArticle = await relart.findOne({ slug }).lean();

    if (!currentArticle || !currentArticle.subcategory) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const subcategory = currentArticle.subcategory;

    // Step 2: Find up to 5 latest related articles in the same subcategory, excluding the current one
    const relatedArticles = await relart
      .find({
        subcategory,
        slug: { $ne: slug }, // Exclude the current article
      })
      .populate('tileTemplateId')
      .sort({ date: -1 }) // Sort by date in descending order (newest first)
      .limit(5) // Limit to 5 articles
      .lean();

    // Ensure all articles have a tileTemplateId field (even if null)
    const processedArticles = relatedArticles.map(article => ({
      ...article,
      tileTemplateId: article.tileTemplateId || null,
    }));

    return new Response(JSON.stringify(processedArticles), {
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