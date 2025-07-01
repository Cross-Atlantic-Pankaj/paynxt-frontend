import connectDB from '@/lib/db';
import BlogManager from '@/models/blog-page/blogcontent';

console.log('✅ head.js file is loaded');

export default async function Head({ params }) {
  const slug = params.slug;
  console.log('Building head for slug:', slug);

  await connectDB();
  const blog = await BlogManager.findOne({ slug }).lean();
  console.log('Blog found in head.js:', blog);

  // fallback title/description
  const title = blog ? `${blog.title} | PayNxt360` : 'PayNxt360';
  const description = blog?.summary?.slice(0, 160) || 'Latest articles and insights from PayNxt360.';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={blog?.title || 'PayNxt360'} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`https://pay-nxt360.vercel.app/blog-page/${slug}`} />
      <meta property="og:type" content="article" />

      {/* If you add an image later */}
      {/* <meta property="og:image" content={blog?.imageIconurl} /> */}

      {/* Optional: Twitter cards */}
      {/* <meta name="twitter:card" content="summary_large_image" /> */}
      {/* <meta name="twitter:title" content={blog?.title || 'PayNxt360'} /> */}
      {/* <meta name="twitter:description" content={description} /> */}
      {/* <meta name="twitter:image" content={blog?.imageIconurl} /> */}
    </>
  );
}
  