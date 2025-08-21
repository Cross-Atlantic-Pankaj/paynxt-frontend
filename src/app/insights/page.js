'use client';
import { useEffect, useState, useMemo } from 'react';
import { Select, Typography, Collapse, Pagination } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination as SwiperPagination } from 'swiper/modules';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import TileRenderer from '@/components/TileRenderer';
import PerformanceMonitor from '@/components/PerformanceMonitor';
const { Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

export default function ViewPointPage() {
    const router = useRouter();
    const { user, isLoading, logout } = useUser();
    const [banner, setBanner] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sliders, setSliders] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [selectedCat, setSelectedCat] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null); // { topic: string, sub: string }
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [topics, setTopics] = useState([]);
    const [pageLoadStart, setPageLoadStart] = useState(performance.now());

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const res = await fetch('/api/View-point/ViewBanner');
                const data = await res.json();
                setBanner(data);
            } catch (error) {
                console.error('Error fetching banner:', error);
                setBanner(null);
            }
        };

        const fetchSliders = async () => {
            try {
                const res = await fetch('/api/View-point/ViewSlider');
                const data = await res.json();
                // Ensure sliders is always an array
                setSliders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching sliders:', error);
                setSliders([]);
            }
        };

        const fetchBlogs = async () => {
            try {
                const res = await fetch('/api/View-point/ViewBlogs');
                const data = await res.json();
                // Ensure blogs is always an array
                setBlogs(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching blogs:', error);
                setBlogs([]);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/View-point/ViewCategories');
                const data = await res.json();
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            }
        };

        const fetchTopics = async () => {
            try {
                const res = await fetch('/api/View-point/ViewTopics'); // adjust path
                const data = await res.json();
                setTopics(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching topics:', error);
                setTopics([]);
            }
        };

        const fetchAllData = async () => {
            try {
                await Promise.all([
                    fetchTopics(),
                    fetchCategories(),
                    fetchBanner(),
                    fetchSliders(),
                    fetchBlogs()
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const CategoryFilter = ({ categories, selectedCat, onSelect, blogs }) => {
        const [openKey, setOpenKey] = useState(null);

        const handleCategoryClick = (catName) => {
            if (selectedCat?.cat === catName && !selectedCat?.sub) {
                onSelect(null); // Deselect
            } else {
                onSelect({ cat: catName }); // Select category
            }
        };

        return (
            <div className="bg-gray-100 overflow-hidden">
                {/* Title */}
                <div className="bg-[#155392] text-white px-4 py-2 font-semibold text-lg">
                    Filter by category
                </div>

                {/* Categories */}
                <Collapse
                    accordion
                    activeKey={openKey}
                    onChange={(key) => setOpenKey(key)}
                    expandIconPosition="end"
                    className="bg-gray-100 border-none shadow-none"
                    expandIcon={({ isActive }) => (
                        <div
                            className={`w-4 h-4 flex items-center mt-3 justify-center rounded-full transition-all duration-300 ${isActive ? 'bg-gray-100' : 'bg-[#155392]'
                                }`}
                        >
                            {isActive ? (
                                <MinusOutlined style={{ fontSize: 10, color: '#155392' }} />
                            ) : (
                                <PlusOutlined style={{ fontSize: 10, color: 'white' }} />
                            )}
                        </div>
                    )}
                >
                    {categories.map((cat) => {
                        // Filter subcategories to only those present in blogs
                        const filteredSubcategories = cat.subcategories.filter((sub) =>
                            blogs.some((blog) => Array.isArray(blog.subcategory) && blog.subcategory.includes(sub))
                        );

                        // Only render the Panel if there are subcategories or the category is tagged
                        if (
                            filteredSubcategories.length > 0 ||
                            blogs.some((blog) => Array.isArray(blog.category) && blog.category.includes(cat.name))
                        ) {
                            return (
                                <Panel
                                    key={cat.name}
                                    className="!bg-gray-100 !border-0"
                                    header={
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent collapse toggle
                                                handleCategoryClick(cat.name);
                                            }}
                                            className={`px-4 py-1 rounded-2xl cursor-pointer flex justify-between items-center ${selectedCat?.cat === cat.name && !selectedCat?.sub
                                                ? 'bg-[#155392] text-white font-semibold'
                                                : 'text-gray-800 font-semibold'
                                                }`}
                                        >
                                            {cat.name}
                                        </div>
                                    }
                                >
                                    <div className="bg-gray-100 p-0">
                                        {filteredSubcategories.map((sub, idx) => (
                                            <div
                                                key={idx}
                                                className="cursor-pointer px-8 py-1 hover:bg-gray-200 text-md text-gray-700"
                                                onClick={() => onSelect({ cat: cat.name, sub })}
                                            >
                                                {sub}
                                            </div>
                                        ))}
                                    </div>
                                </Panel>
                            );
                        }
                        return null;
                    })}
                </Collapse>

                {/* Remove white padding around dropdown */}
                <style jsx global>{`
        .ant-collapse-content {
          background-color: #f3f4f6 !important; /* Tailwind gray-100 */
        }
        .ant-collapse-content-box {
          padding: 0 !important;
          background-color: #f3f4f6 !important;
        }
      `}</style>
            </div>
        );
    };

    const TopicFilter = ({ topics, selectedTopic, onSelect, blogs }) => {
        const [openKey, setOpenKey] = useState(null);

        const handleTopicClick = (topicName) => {
            if (selectedTopic?.topic === topicName && !selectedTopic?.sub) {
                onSelect(null); // Deselect
            } else {
                onSelect({ topic: topicName }); // Select topic
            }
        };

        return (
            <div className="bg-gray-100 overflow-hidden mt-4">
                <div className="bg-[#155392] text-white px-4 py-2 font-semibold text-lg">
                    Filter by topic
                </div>
                <Collapse
                    accordion
                    activeKey={openKey}
                    onChange={(key) => setOpenKey(key)}
                    expandIconPosition="end"
                    className="bg-gray-100 border-none shadow-none"
                    expandIcon={({ isActive }) => (
                        <div
                            className={`w-4 h-4 flex items-center mt-3 justify-center rounded-full transition-all duration-300 ${isActive ? 'bg-gray-100' : 'bg-[#155392]'
                                }`}
                        >
                            {isActive ? (
                                <MinusOutlined style={{ fontSize: 10, color: '#155392' }} />
                            ) : (
                                <PlusOutlined style={{ fontSize: 10, color: 'white' }} />
                            )}
                        </div>
                    )}
                >
                    {topics.map((topic) => {
                        // Filter subtopics to only those present in blogs
                        const filteredSubtopics = topic.subtopics.filter((sub) =>
                            blogs.some((blog) => Array.isArray(blog.subtopic) && blog.subtopic.includes(sub))
                        );

                        // Only render the Panel if there are subtopics or the topic is tagged
                        if (
                            filteredSubtopics.length > 0 ||
                            blogs.some((blog) => Array.isArray(blog.topic) && blog.topic.includes(topic.name))
                        ) {
                            return (
                                <Panel
                                    key={topic.name}
                                    className="!bg-gray-100 !border-0"
                                    header={
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTopicClick(topic.name);
                                            }}
                                            className={`px-4 py-1 rounded-2xl cursor-pointer flex justify-between items-center ${selectedTopic?.topic === topic.name && !selectedTopic?.sub
                                                ? 'bg-[#155392] text-white font-semibold'
                                                : 'text-gray-800 font-semibold'
                                                }`}
                                        >
                                            {topic.name}
                                        </div>
                                    }
                                >
                                    <div className="bg-gray-100 p-0">
                                        {filteredSubtopics.map((sub, idx) => (
                                            <div
                                                key={idx}
                                                className="cursor-pointer px-8 py-1 hover:bg-gray-200 text-md text-gray-700"
                                                onClick={() => onSelect({ topic: topic.name, sub })}
                                            >
                                                {sub}
                                            </div>
                                        ))}
                                    </div>
                                </Panel>
                            );
                        }
                        return null;
                    })}
                </Collapse>
            </div>
        );
    };

    const BlogsGrid = ({ blogs, currentPage, setCurrentPage }) => {
        const blogsPerPage = 15;
        const start = (currentPage - 1) * blogsPerPage;
        const paginatedBlogs = blogs.slice(start, start + blogsPerPage);
        const { user, isLoading: userLoading } = useUser();
        const router = useRouter();
        const [savedArticles, setSavedArticles] = useState([]);

        useEffect(() => {
            if (!user) return;
            const fetchSavedArticles = async () => {
                try {
                    const res = await fetch('/api/saved-articles', {
                        headers: { Authorization: `Bearer ${user.token}` },
                    });
                    const data = await res.json();
                    if (data.success) {
                        setSavedArticles(data.data.map((item) => item.slug));
                    } else {
                        console.error('Failed to fetch saved articles:', data.message);
                        toast.error(data.message || 'Failed to fetch saved articles');
                    }
                } catch (error) {
                    console.error('Error fetching saved articles:', error);
                    toast.error('Error fetching saved articles');
                }
            };
            fetchSavedArticles();
        }, [user]);

        const handleSaveArticle = async (blog, e) => {
            e.preventDefault(); // Prevent any default behavior
            e.stopPropagation(); // Stop event bubbling to parent Link
            if (!user) {
                toast.error('Please log in to save articles');
                router.push('/login?callbackUrl=/view-point');
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

        return (
            <div className="w-full">
                <div className="grid grid-rows-1 md:grid-cols-3 gap-4">
                    {paginatedBlogs.map((blog, i) => {
                        const blogUrl = `https://pay-nxt360.vercel.app/blog-page/${blog.slug}`;
                        const linkedInShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                            blogUrl
                        )}&title=${encodeURIComponent(blog.title)}&summary=${encodeURIComponent(blog.summary)}`;
                        const isSaved = savedArticles.includes(blog.slug);

                        return (
                            <div key={i} className="h-full">
                                <div className="bg-white flex flex-col justify-between h-full overflow-hidden">
                                    <Link href={`/blog-page/${blog.slug}`} className="block">
                                        <div className="w-full h-40">
                                            {blog.tileTemplateId ? (
                                                <TileRenderer
                                                    tileTemplateId={blog.tileTemplateId}
                                                    fallbackIcon="FileText"
                                                    className="w-full h-40"
                                                />
                                            ) : (
                                                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg">
                                                    <span className="text-gray-500 text-sm">No template</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 flex flex-col justify-between">
                                            <div>
                                                <p className="text-sm leading-tight">
                                                    {blog.date
                                                        ? new Date(blog.date)
                                                            .toLocaleString('en-US', { month: 'long', year: 'numeric' })
                                                            .replace(',', '')
                                                        : ''}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {Array.isArray(blog.subcategory) ? blog.subcategory.join(', ') : blog.subcategory}
                                                </p>
                                                <div className="border-b border-gray-400 mb-4"></div>
                                                <h3 className="text-md font-bold">{blog.title}</h3>
                                                <p className="text-sm text-gray-700">
                                                    {blog.summary?.length > 100 ? `${blog.summary.slice(0, 100)}...` : blog.summary}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="p-4 pt-0 flex gap-2">
                                        <a
                                            href={linkedInShareUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-sm border border-[#0077B5] bg-[#0077B5] text-white text-sm font-medium transition hover:bg-[white] hover:text-[#0077B5]"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zm-9 19H7v-9h3v9zm-1.5-10.3c-.97 0-1.75-.78-1.75-1.75S7.53 5.2 8.5 5.2s1.75.78 1.75 1.75S9.47 8.2 8.5 8.2zM20 19h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39V19h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59V19z" />
                                            </svg>
                                            Share
                                        </a>
                                        <button
                                            onClick={(e) => handleSaveArticle(blog, e)}
                                            className={`inline-flex items-center justify-center gap-2 px-3 py-1 rounded-sm border text-sm font-medium transition ${isSaved
                                                ? 'border-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500'
                                                : 'border-green-500 bg-green-500 text-white hover:bg-white hover:text-green-500'
                                                }`}
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                                            </svg>
                                            {isSaved ? 'Remove' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4 flex justify-center">
                    <Pagination
                        current={currentPage}
                        pageSize={blogsPerPage}
                        total={blogs.length}
                        onChange={(page) => setCurrentPage(page)}
                    />
                </div>
                {paginatedBlogs.length === 0 && (
                    <p className="text-center text-gray-500">No articles found.</p>
                )}
            </div>
        );
    };

    const categoryOptions = useMemo(() => {
        const categories = new Set();
        blogs.forEach(blog => {
            if (blog.blogs) {
                blog.blogs.forEach(b => categories.add(b.category));
            }
        });
        return Array.from(categories);
    }, [blogs]);

    const filteredBlogs = useMemo(() => {
        let result = blogs;
        if (selectedCat) {
            if (selectedCat.sub) {
                result = result.filter(blog => Array.isArray(blog.subcategory) && blog.subcategory.includes(selectedCat.sub));
            } else {
                result = result.filter(blog => Array.isArray(blog.category) && blog.category.includes(selectedCat.cat));
            }
        }

        if (selectedTopic) {
            if (selectedTopic.sub) {
                result = result.filter(blog => Array.isArray(blog.subtopic) && blog.subtopic.includes(selectedTopic.sub));
            } else {
                result = result.filter(blog => Array.isArray(blog.topic) && blog.topic.includes(selectedTopic.topic));
            }
        }

        if (searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            result = result.filter(blog =>
                blog.title?.toLowerCase().includes(term) ||
                blog.summary?.toLowerCase().includes(term) ||
                (Array.isArray(blog.subcategory) && blog.subcategory.join(' ').toLowerCase().includes(term))
            );
        }

        return result;
    }, [blogs, selectedCat, selectedTopic, searchTerm]);

    // Only keep categories that are present in filteredBlogs
    const filteredCategories = useMemo(() => {
        return categories
            .map(cat => {
                const filteredSub = cat.subcategories.filter(sub =>
                    filteredBlogs.some(blog =>
                        Array.isArray(blog.subcategory) && blog.subcategory.includes(sub)
                    )
                );
                const hasCat = filteredBlogs.some(blog =>
                    Array.isArray(blog.category) && blog.category.includes(cat.name)
                );
                if (hasCat || filteredSub.length > 0) {
                    return {
                        ...cat,
                        subcategories: filteredSub
                    };
                }
                return null;
            })
            .filter(Boolean);
    }, [categories, blogs]);


    // Only keep topics that are present in filteredBlogs
    const filteredTopics = useMemo(() => {
        return topics
            .map(topic => {
                const filteredSub = topic.subtopics.filter(sub =>
                    filteredBlogs.some(blog =>
                        Array.isArray(blog.subtopic) && blog.subtopic.includes(sub)
                    )
                );
                const hasTopic = filteredBlogs.some(blog =>
                    Array.isArray(blog.topic) && blog.topic.includes(topic.name)
                );
                if (hasTopic || filteredSub.length > 0) {
                    return {
                        ...topic,
                        subtopics: filteredSub
                    };
                }
                return null;
            })
            .filter(Boolean);
    }, [topics, blogs]);


    const paginatedBlogs = useMemo(() => {
        const chunkSize = 3;
        const result = [];
        for (let i = 0; i < filteredBlogs.length; i += chunkSize) {
            result.push(filteredBlogs.slice(i, i + chunkSize));
        }
        return result;
    }, [filteredBlogs]);


    const handleSearch = () => {
        setSearchTerm(searchTerm);
    };

    // Show loading state while data is being fetched
    if (isLoading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#155392] mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading insights...</p>
                </div>
            </main>
        );
    }

    return (

        <main className="min-h-screen bg-gray-100">
            <PerformanceMonitor
                componentName="Insights Page"
                startTime={pageLoadStart}
            />
            <Toaster position="top-right" />
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

            <section className="w-full bg-[#155392] py-20 px-8">
                <div className="flex flex-row justify-between gap-8 max-w-7xl mx-auto items-start">
                    {/* Left Banner Section */}
                    <div className="w-2/3 text-left">
                        {banner ? (
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-6">{banner.bannerTitle}</h1>
                                {/* <div className="flex flex-wrap gap-2 mb-6">
                  {banner.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-white text-[#155392] text-sm font-semibold px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div> */}
                                <p className="text-md text-white mt-1 mb-8">
                                    {banner.bannerDescription}
                                </p>

                                <div className="mt-2 flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full max-w-md px-4 py-3 rounded-l-sm bg-white text-[#155392] placeholder-[#155392] border border-[white] focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className="px-6 py-3 rounded-r-sm bg-[#FF6B00] text-[white] border border-[white] hover:bg-[#155392] hover:text-white focus:outline-none focus:ring-2 focus:ring-white cursor-pointer duration-300"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-white">Loading banner...</p>
                        )}
                    </div>

                    {/* Right Slider Section */}
                    <div className="w-1/3 bg-white rounded-lg shadow-lg p-4 h-fit max-h-[500px]">
                        {Array.isArray(sliders) && sliders.length > 0 ? (
                            <Swiper
                                modules={[SwiperPagination]}
                                pagination={{
                                    el: '.custom-pagination',
                                    clickable: true,
                                }}
                                spaceBetween={16}
                                slidesPerView={1}
                            >
                                {sliders.map((slide, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="mb-4 border-b pb-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <p className="text-xs text-gray-500 uppercase">{slide.typeText}</p>
                                            </div>
                                            <h3 className="text-lg font-bold text-[#155392]">{slide.title}</h3>
                                            <p className="text-sm text-gray-700 mt-1 mb-2">
                                                {slide.shortDescription && slide.shortDescription.length > 100
                                                    ? `${slide.shortDescription.slice(0, 100)}...`
                                                    : slide.shortDescription}
                                            </p>
                                            <div className="flex justify-end">
                                                <a
                                                    href={slide.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-white bg-[#155392] hover:bg-[#0e3a6f] px-3 py-1 rounded"
                                                >
                                                    Read More
                                                </a>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <p>No featured content available</p>
                            </div>
                        )}

                        {/* Custom pagination container */}
                        <div className="custom-pagination flex justify-center gap-4 mt-4"></div>

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
            <section className="bg-gray-100 py-10">
                <div className="max-w-7xl mx-auto px-4 grid grid-rows-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 flex flex-col gap-4">
                        <button
                            onClick={() => {
                                setSelectedCat(null);
                                setSelectedTopic(null);
                                setSearchTerm('');
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-2 rounded transition ${!selectedCat && !selectedTopic && !searchTerm
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#155392] text-[white] hover:bg-[#0e3a6f]'
                                }`}
                            disabled={!selectedCat && !selectedTopic && !searchTerm}
                        >
                            Clear All Filters
                        </button>
                        <CategoryFilter
                            categories={filteredCategories}
                            selectedCat={selectedCat}
                            onSelect={(selection) => {
                                setSelectedCat(selection);
                                setCurrentPage(1);
                            }}
                            blogs={blogs}
                        />

                        <TopicFilter
                            topics={filteredTopics}
                            selectedTopic={selectedTopic}
                            onSelect={(selection) => {
                                setSelectedTopic(selection);
                                setCurrentPage(1);
                            }}
                            blogs={blogs}
                        />
                    </div>

                    <div className="col-span-3">
                        {Array.isArray(filteredBlogs) && filteredBlogs.length > 0 ? (
                            <BlogsGrid
                                blogs={filteredBlogs}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        ) : (
                            <div className="text-center text-gray-500 py-20">
                                <p className="text-xl">No articles found matching your criteria</p>
                                <button
                                    onClick={() => {
                                        setSelectedCat(null);
                                        setSelectedTopic(null);
                                        setSearchTerm('');
                                        setCurrentPage(1);
                                    }}
                                    className="mt-4 px-6 py-2 bg-[#155392] text-white rounded hover:bg-[#0e3a6f]"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}