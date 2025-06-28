import connectDB from '@/lib/db';
import BlogManager from '@/models/blog-page/blogcontent';

export default async function Head({ params }) {
  const slug = params.slug;

  await connectDB();

  const blog = await BlogManager.findOne({ slug }).lean();

  return (
    <>
      <title>{blog ? `${blog.title} | PayNxt360` : 'PayNxt360'}</title>
      <meta name="description" content={blog?.summary || 'Default summary'} />

      {/* Open Graph */}
      <meta property="og:title" content={blog?.title || 'PayNxt360'} />
      <meta property="og:description" content={blog?.summary || 'Default summary'} />
      <meta property="og:url" content={`https://pay-nxt360.vercel.app/blog-page/${slug}`} />
      <meta property="og:type" content="article" />
      {/* If you later add an image field: */}
      {/* <meta property="og:image" content={blog?.imageIconurl} /> */}
    </>
  );
}
