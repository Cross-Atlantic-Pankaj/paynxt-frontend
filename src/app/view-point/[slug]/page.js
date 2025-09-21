'use client';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import { usePathname, notFound, useParams } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper/modules";
import { Pagination } from 'swiper/modules';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import slugify from '@/lib/slugify';
import TileRenderer from '@/components/TileRenderer';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import DOMPurify from 'dompurify';
import WhySubscribe from '@/components/whysubscribe';
import { FaLinkedin } from 'react-icons/fa6';
// import Head from 'next/head';

export default function BlogPage() {
    const params = useParams();
    const slug = params?.slug?.replace(/^\/view-point\//, '');
    const { user } = useUser();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [banner, setBanner] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sliders, setSliders] = useState([]);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [consults, setConsults] = useState([]);
    const [featuredReports, setFeaturedReports] = useState([]);
    const pathname = usePathname();
    const [savedArticles, setSavedArticles] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (!slug) return;

        const fetchBanner = async () => {
            try {
                const res = await fetch('/api/blog-page/blogbanner');
                const data = await res.json();
                const matchedBanner = Array.isArray(data)
                    ? data.find(b => slugify(b.title) === slug)
                    : null;
                setBanner(matchedBanner || null);
            } catch (err) {
                console.error('Error fetching banner:', err);
            }
        };

        const fetchSliders = async () => {
            const res = await fetch('/api/blog-page/blogslider');
            const data = await res.json();
            setSliders(data);
        };

        const fetchBlog = async () => {
            try {
                const res = await fetch('/api/blog-page/blogcontent');
                const data = await res.json();
                if (Array.isArray(data)) {
                    const matchedBlog = data.find(b => slugify(b.title) === slug);
                    console.log("Matched Blog (from content):", matchedBlog);
                    setBlog(matchedBlog || null);
                }
            } catch (err) {
                console.error('Error fetching blog:', err);
            } finally {
                setLoading(false);
            }
        };

        const fetchConsults = async () => {
            const res = await fetch('/api/blog-page/consult');
            const data = await res.json();
            setConsults(data);
        };

        const fetchFeaturedReports = async () => {
            try {
                const res = await fetch('/api/blog-page/featreport');
                const data = await res.json();
                setFeaturedReports(data);
            } catch (error) {
                console.error('Error fetching featured reports:', error);
            }
        };

        fetchBanner();
        fetchSliders();
        fetchBlog();
        fetchConsults();
        fetchFeaturedReports();
    }, [slug]); // ✅ run once based on slug

    useEffect(() => {
        const fetchRelatedArticles = async () => {
            if (!blog) {
                console.log("Blog is not set yet");
                return;
            }

            try {
                console.log("Triggering related articles API using slug:", slug);
                const res = await fetch(`/api/blog-page/relarticles?slug=${encodeURIComponent(slug)}`);
                const data = await res.json();
                console.log("Related articles response:", data);
                if (Array.isArray(data)) {
                    setRelatedArticles(data);
                }
            } catch (error) {
                console.error('Error fetching related articles:', error);
            }
        };
        fetchRelatedArticles();
    }, [blog]);


    if (loading) return <div className="text-center mt-10">Loading blog...</div>;
    if (!blog) return <div className="text-center mt-10 text-red-500">Blog not found</div>;

    const handleSaveArticle = async (blog, e) => {
        e.preventDefault(); // Prevent any default behavior
        e.stopPropagation(); // Stop event bubbling to parent Link
        if (!user) {
            toast.error('Please log in to save articles');
            router.push(`/login?callbackUrl=/view-point/${blog.slug}`);
            return;
        }

        const isSaved = savedArticles.includes(blog.slug);
        const toastId = toast.loading(isSaved ? 'Removing article...' : 'Saving article...');
        try {
            const res = await fetch('/api/saved-articles', {
                method: isSaved ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ slug: blog.slug }),
            });
            const data = await res.json();
            if (data.success) {
                setSavedArticles((prev) =>
                    isSaved ? prev.filter((s) => s !== blog.slug) : [...prev, blog.slug]
                );
                toast.success(isSaved ? 'Article removed from saved' : 'Article saved successfully', {
                    id: toastId,
                });
            } else {
                toast.error(data.message || 'Failed to save article', { id: toastId });
            }
        } catch (error) {
            console.error('Error saving article:', error);
            toast.error('Failed to save article', { id: toastId });
        }
    };


    const isSaved = savedArticles.includes(blog.slug);

    const handleSearch = () => {
        if (!searchTerm.trim()) return;
        router.push(`/report-store?search=${encodeURIComponent(searchTerm)}`);
    };

    return (
        <>
            <main className="min-h-screen bg-white">
                <style jsx global>{`
  .swiper-pagination {
    position: relative;
    margin-top: 16px;
    text-align: center;
  }

  .swiper-pagination-bullet {
    background: #155392 !important;
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    background: #FF6B00 !important;
  }
`}</style>
                {banner && (
                <section className="w-full bg-darkBorderColor py-20 px-8">
                    <div className="flex flex-col md:!flex-row items-center justify-between gap-8 appContainer mx-auto">
                        {/* Left Banner Section */}
                        <div className="w-full md:!w-2/3 text-left">
                            {banner ? (
                                <div>
                                    <div className="font-playfair text-4xl font-bold text-themeBlueColor mb-6">{banner.title}</div>

                                    
                                    {banner.summary && (
                                        <p className="text-lg text-salte-800 mb-6"
                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(banner.summary, { ADD_ATTR: ['style'] }) }}
                                        />
                                    )}


                                    <div className="mt-2 flex items-center">
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            className="w-full max-w-md px-4 py-3 rounded-l-sm bg-white text-slate-700 placeholder-slate-400 focus:outline-none"
                                        />
                                        <button
                                            onClick={handleSearch}
                                            className="px-6 py-3 rounded-r-sm bg-themeOrangeColor hover:bg-themeBlueColor focus:outline-none cursor-pointer duration-300 font-medium">
                                            <span className='text-white'>Search</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-white">Loading banner...</p>
                            )}
                        </div>

                        {/* Right Slider Section */}
                        <div className="w-full md:!w-1/3 bg-white rounded-lg shadow-lg p-4 h-fit">
                            <Swiper
                                modules={[Pagination, Autoplay]}
                                pagination={{
                                    el: '.custom-pagination',
                                    clickable: true,
                                }}
                                spaceBetween={16}
                                slidesPerView={1}
                                autoplay={{
                                    delay: 5000, // 5 seconds
                                    disableOnInteraction: false, // keeps auto-rotating even after user interacts
                                }}
                            >
                                {sliders.map((slide, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="">
                                            <p className="text-xs text-themeOrangeColor uppercase mb-1">{slide.typeText}</p>
                                            <h3 className="text-xl font-semibold text-themeBlueColor">{slide.title}</h3>
                                            <p className="text-sm text-slate-800 mt-1 mb-2">
                                                {slide.shortDescription.length > 100
                                                    ? `${slide.shortDescription.slice(0, 100)}...`
                                                    : slide.shortDescription}
                                            </p>
                                            <div className="flex justify-end">
                                                <a
                                                    href={slide.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-white bg-themeBlueColor hover:bg-themeOrangeColor uppercase transition duration-500 px-3 py-1 rounded"
                                                >
                                                    Read More
                                                </a>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Custom pagination container */}
                            <div className="custom-pagination flex justify-center gap-2 mt-4"></div>

                            {/* Inline styles for pagination bullets */}
                            <style>{`
    .custom-pagination .swiper-pagination-bullet {
      width: 20px;
      height: 4px;
      background-color: #ccc;
      opacity: 1;
      border-radius: 2px;
      transition: background-color 0.3s ease;
    }

    .custom-pagination .swiper-pagination-bullet-active {
      background-color: #155392;
    }
  `}</style>
                        </div>

                    </div>
                </section>
                )}
                <div className="appContainer py-10 flex flex-row gap-8">
                    {/* Left 3/4 */}
                    <div className="w-3/4">
                        <h1 className="text-2xl font-semibold mb-4">{blog.title}</h1>
                        <div className="pt-0 flex gap-2 mb-6">
                            <a
                                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://pay-nxt360.vercel.app/view-point/${blog.slug}`)}&title=${encodeURIComponent(blog.title)}&summary=${encodeURIComponent(blog.summary)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center justify-center gap-2 px-2 py-1 rounded-xs border border-[#0077B5] bg-[#0077B5] text-white text-sm font-medium transition hover:bg-[white] hover:text-[#0077B5]">
                                    <FaLinkedin />
                                    Share
                            </a>
                            <button
                                onClick={(e) => handleSaveArticle(blog, e)}
                                className={`inline-flex items-center justify-center gap-2 px-3 py-1 rounded-sm border text-sm font-medium transition ${isSaved
                                    ? 'border-red-500 bg-red-500 !text-white hover:bg-white hover:text-red-500 hover:cursor-pointer'
                                    : 'border-green-500 bg-green-500 !text-white hover:bg-white hover:!text-green-500 hover:cursor-pointer'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                                </svg>
                                {isSaved ? 'Remove' : 'Save'}
                            </button>
                        </div>
                        <div
                            className="text-slate-700 mb-6 text-md prose leading-6"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.summary) }}
                        />

                        <div className="mb-8">
                            <div
                                className="text-slate-700 text-md prose leading-6 prose"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.articlePart1) }}
                            />
                        </div>
                        {blog.advertisement && (
                            <div className="bg-borderColor p-4 rounded">
                                <h3 className="text-lg font-semibold text-themeBlueColor mb-2">
                                    {blog.advertisement.title}
                                </h3>
                                <p className="text-sm text-slate-600 mb-2">
                                    {blog.advertisement.description}
                                </p>
                                <a
                                    href={blog.advertisement.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-themeOrangeColor hover:themeBlueColor transition duration-500 text-sm"
                                >
                                    Visit Advertisement
                                </a>
                            </div>
                        )}

                        {user ? (
                            <div className="mt-6">
                                <div
                                    className="text-gray-800 leading-relaxed prose article-content"
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.articlePart2) }}
                                />
                            </div>
                        ) : (
                            <div className="bg-darkBorderColor p-4 rounded mt-6 text-center">
                                <p className="text-lg text-slate-700 font-semibold !mb-1">
                                    Register to view more
                                </p>
                                <p className="text-sm text-slate-700 !mb-4">
                                    It's free and takes only a minute!
                                </p>
                                <div className="flex justify-center gap-4 mt-4">
                                    <Link
                                        href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                                        className="px-6 py-3 bg-themeOrangeColor text-[white] font-semibold rounded-tr-xl rounded-bl-xl hover:bg-themeBlueColor transition duration-300 cursor-pointer"
                                    >
                                        Sign In
                                    </Link>

                                    <Link
                                        href={`/signup?callbackUrl=${encodeURIComponent(pathname)}`}
                                        className="px-6 py-3 bg-themeBlueColor text-[white] font-semibold rounded-tr-xl rounded-bl-xl hover:bg-themeOrangeColor transition duration-300 cursor-pointer"
                                    >
                                        Register Now
                                    </Link>

                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right 1/4 */}
                    <div className="w-1/4">
                        <div className="w-full lg:w-1/4">
                            <h2 className="bg-themeBlueColor text-white text-lg px-4 py-2 font-bold mb-2">Related Articles</h2>

                            <div className="bg-white border border-borderColor ">
                                {relatedArticles.length === 0 ? (
                                    <p className="text-gray-500 text-sm px-4 py-2">No related articles found.</p>
                                ) : (
                                    relatedArticles.map((article) => (
                                        <div key={article._id} className="px-4 py-3 group" title={moment(article.date).fromNow()}>
                                            <a
                                                href={`/view-point/${article.slug}`} // ✅ Using slug-based URL
                                                className="flex items-start gap-2 text-sm text-blue-700 group-hover:text-[#FF6B00]"
                                            >
                                                {article.tileTemplateId && (
                                                    <TileRenderer
                                                        tileTemplateId={article.tileTemplateId}
                                                        fallbackIcon="FileText"
                                                        className="w-4 h-4 mr-2"
                                                    />
                                                )}
                                                <span className="text-blue-700 group-hover:text-[#FF6B00]">&gt;</span>
                                                <span>{article.title}</span>
                                            </a>
                                            {article.description && (
                                                <p className="text-sm text-gray-600 mt-1">{article.description}</p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="mt-8">
                            {/* <h2 className="bg-[#155392] text-white text-lg px-4 py-2 font-bold mb-2">
                            Consult With Us
                        </h2> */}
                            {consults.length === 0 ? (
                                <p className="text-slate-500 text-sm">No consult options available.</p>
                            ) : (
                                consults.map((consult) => (
                                    <div key={consult._id} className="bg-themeBlueColor p-4 mb-4 rounded">
                                        <p className="text-xl text-white text-center mb-3">{consult.description}</p>
                                        <h3 className="text-4xl font-semibold text-center text-white mb-1">{consult.title}</h3>
                                        <div className="flex justify-center mt-4">
                                            <a
                                                href={consult.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-3 bg-themeOrangeColor text-[white] font-semibold rounded-tr-xl rounded-bl-xl hover:bg-white hover:!text-themeBlueColor transition duration-300 cursor-pointer"
                                            >
                                                CONSULT NOW
                                            </a>
                                        </div>

                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                
                {featuredReports?.length > 0 && (
                <div className="w-full bg-slate-50 py-10">
                    <div className='appContainer'>
                        <h2 className="text-2xl font-semibold text-center text-themeBlueColor">FEATURED REPORTS</h2>
                    {featuredReports.length === 0 ? (
                        <p className="text-gray-500 text-sm">No featured reports found.</p>
                    ) : (
                        <Swiper
                            modules={[Pagination]}
                            pagination={{ clickable: true }}
                            spaceBetween={20}
                            className="w-full"
                        >
                            {featuredReports.map((report, index) =>
                                Array.from({ length: Math.ceil(report.blogs.length / 3) }, (_, chunkIndex) => {
                                    const chunk = report.blogs.slice(chunkIndex * 3, chunkIndex * 3 + 3);
                                    return (
                                        <SwiperSlide key={`${index}-${chunkIndex}`}>
                                            <div className="grid grid-cols-3 gap-6 py-10">
                                                {chunk.map((blog, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="p-8 rounded bg-white"
                                                    >
                                                        <div className="flex justify-center items-center mb-8">
                                                            {blog.tileTemplateId ? (
                                                                <TileRenderer
                                                                    tileTemplateId={blog.tileTemplateId}
                                                                    fallbackIcon="FileText"
                                                                    className="w-15 h-15"
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={blog.imageIconurl}
                                                                    alt={blog.blogName}
                                                                    className="w-15 h-15 object-contain rounded"
                                                                />
                                                            )}
                                                        </div>
                                                        <h3 className="text-lg text-center font-semibold text-themeBlueColor h-15 overflow-hidden">
                                                            {blog.blogName}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 mt-2">{blog.description}</p>
                                                        <div className="flex justify-center">
                                                            <a
                                                                href={"/google.com"}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="mt-4 w-fit inline-block text-center font-semibold text-white bg-themeOrangeColor hover:text-white hover:bg-themeBlueColor px-5 py-3 rounded-tr-xl rounded-bl-xl text-sm transition duration-500"
                                                            >
                                                                VIEW DETAILS
                                                            </a>
                                                        </div>

                                                    </div>
                                                ))}
                                            </div>
                                        </SwiperSlide>
                                    );
                                })
                            )}
                        </Swiper>
                    )}
                </div>
                </div>
                )}

                <WhySubscribe/>
            </main>
        </>
    );
}