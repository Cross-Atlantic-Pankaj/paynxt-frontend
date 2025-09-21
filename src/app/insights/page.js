'use client';
import { useEffect, useState, useMemo } from 'react';
import { Select, Typography, Collapse, Pagination } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper/modules";
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
import DOMPurify from 'dompurify';
import { FaLinkedin } from 'react-icons/fa6';

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

    const stripHTML = (html) => {
        const div = document.createElement('div');
        div.innerHTML = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] }); // Remove all tags
        return div.textContent || div.innerText || '';
    };

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
            <div className="bg-white overflow-hidden">
                {/* Title */}
                <div className="bg-themeBlueColor text-white px-4 py-2 font-medium text-lg">
                    Filter by category
                </div>

                {/* Categories */}
                <Collapse
                    accordion
                    activeKey={openKey}
                    onChange={(key) => setOpenKey(key)}
                    expandIconPosition="end"
                    className="border-none shadow-none"
                    expandIcon={({ isActive }) => (
                        <div
                            className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 ${isActive ? 'bg-themeOrangeColor' : 'bg-themeBlueColor'
                                }`}
                        >
                            {isActive ? (
                                <MinusOutlined style={{ fontSize: 12, color: 'themeOrangeColor' }} />
                            ) : (
                                <PlusOutlined style={{ fontSize: 12, color: 'white' }} />
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
                                            className={`px-0 py-1 rounded cursor-pointer flex justify-between items-center ${selectedCat?.cat === cat.name && !selectedCat?.sub
                                                ? 'bg-themeBlueColor text-white font-semibold'
                                                : 'font-medium text-slate-700'
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
                                                className="cursor-pointer px-4 py-1 hover:bg-slate-200 text-md text-slate-700"
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
            <div className="bg-white overflow-hidden">
                <div className="bg-themeBlueColor text-white px-4 py-2 font-medium text-lg">
                    Filter by topic
                </div>
                <Collapse
                    accordion
                    activeKey={openKey}
                    onChange={(key) => setOpenKey(key)}
                    expandIconPosition="end"
                    className="border-none shadow-none"
                    expandIcon={({ isActive }) => (
                        <div
                            className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 ${isActive ? 'bg-themeOrangeColor' : 'bg-themeBlueColor'
                                }`}
                        >
                            {isActive ? (
                                <MinusOutlined style={{ fontSize: 12, color: 'themeOrangeColor' }} />
                            ) : (
                                <PlusOutlined style={{ fontSize: 12, color: 'white' }} />
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
                                            className={`rounded cursor-pointer flex justify-between items-center ${selectedTopic?.topic === topic.name && !selectedTopic?.sub
                                                ? 'bg-[#155392] text-white font-semibold'
                                                : 'text-gray-800 font-semibold'
                                                }`}
                                        >
                                            {topic.name}
                                        </div>
                                    }
                                >
                                    <div className="bg-slate-100 p-0">
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
                router.push('/login?callbackUrl=/insights');
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
                        const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
                        const blogUrl = `${base}/${blog.slug}`;
                        const linkedInShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                            blogUrl
                        )}&title=${encodeURIComponent(blog.title)}&summary=${encodeURIComponent(blog.summary)}`;
                        const isSaved = savedArticles.includes(blog.slug);

                        return (
                            <div key={i} className="h-full">
                                <div className="bg-white flex flex-col justify-between h-full overflow-hidden">
                                    <Link href={`/view-point/${blog.slug}`} className="block">
                                        <div className="w-full h-40">
                                            {blog.tileTemplateId ? (
                                                <TileRenderer
                                                    tileTemplateId={blog.tileTemplateId}
                                                    fallbackIcon="FileText"
                                                    className="w-full h-40"
                                                />
                                            ) : (
                                                <div className="w-full h-40 bg-slate-200 flex items-center justify-center rounded">
                                                    <span className="text-slate-500 text-sm">No template</span>
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
                                                <p className="text-sm text-slate-500">
                                                    {Array.isArray(blog.subcategory) ? blog.subcategory.join(', ') : blog.subcategory}
                                                </p>
                                                <div className="border-b border-darkBorderColor mb-4"></div>
                                                <h3 className="text-md font-bold">{blog.title}</h3>
                                                <p className="text-sm text-slate-700">
                                                    {blog.summary
                                                        ? stripHTML(blog.summary).length > 100
                                                            ? `${stripHTML(blog.summary).slice(0, 100)}...`
                                                            : stripHTML(blog.summary)
                                                        : ''}
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
            {banner && (
            <section className="w-full bg-darkBorderColor py-20 px-8">
                <div className="flex flex-col md:!flex-row items-center justify-between gap-8 appContainer mx-auto">
                    {/* Left Banner Section */}
                    <div className="w-full md:!w-2/3 text-left">
                        {banner ? (
                            <div>
                                <div className="font-playfair text-4xl font-bold text-themeBlueColor mb-6">{banner.bannerTitle}</div>

                                <p className="text-lg text-salte-800 mb-6">
                                    {banner.bannerDescription}
                                </p>

                                <div className="mt-2 flex items-center relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full max-w-md px-4 py-3 rounded-l-sm bg-white text-slate-700 placeholder-slate-400 focus:outline-none"
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className="px-6 py-3 rounded-r-sm bg-themeOrangeColor hover:bg-themeBlueColor focus:outline-none cursor-pointer duration-300 font-medium"
                                    >
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
                        {Array.isArray(sliders) && sliders.length > 0 ? (
                            <Swiper
                                modules={[SwiperPagination, Autoplay]}
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
                                        <div>
                                            <p className="text-xs text-themeOrangeColor uppercase mb-1">{slide.typeText}</p>
                                            <h3 className="text-xl font-semibold text-themeBlueColor">{slide.title}</h3>
                                            <p className="text-sm text-slate-800 mt-1 mb-2">
                                                {slide.shortDescription && slide.shortDescription.length > 100
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
                        ) : (
                            <div className="text-center text-slate-500 py-8">
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
            )}
            <section className="py-16 md:py-24">
                <div className="appContainer grid grid-rows-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 flex flex-col gap-4">
                        <button
                            onClick={() => {
                                setSelectedCat(null);
                                setSelectedTopic(null);
                                setSearchTerm('');
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-2 rounded duration-500 transition ${!selectedCat && !selectedTopic && !searchTerm
                                ? 'bg-darkBorderColor !text-slate-700 cursor-not-allowed'
                                : 'bg-themeBlueColor !text-white hover:bg-themeOrangeColor cursor-pointer'
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