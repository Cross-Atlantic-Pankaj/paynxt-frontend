import slugify from '@/lib/slugify';

export async function generateMetadata({ params }) {
  console.log('generateMetadata is running!');

  const slug = params.slug;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/blog-page/blogcontent`, {
      next: { revalidate: 60 }
    });
    const data = await res.json();

    const blog = Array.isArray(data)
      ? data.find(b => slugify(b.title) === slug)
      : null;

    console.log("Blog:", blog);

    if (!blog) {
      return {
        title: 'Blog not found - PayNxt',
        description: 'The requested blog could not be found.'
      };
    }

    return {
      title: blog.title,
      description: blog.summary,
      openGraph: {
        title: blog.title,
        description: blog.summary,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog-page/${slug}`,
        images: [
          {
            url: blog.imageIconurl,
            width: 800,
            height: 600,
            alt: blog.title
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.summary,
        images: [blog.imageIconurl]
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'PayNxt',
      description: 'An unexpected error occurred.'
    };
  }
}
