'use client';
import { useEffect, useState, useMemo } from 'react';
import { Select, Typography, Collapse, Pagination } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination as SwiperPagination } from 'swiper/modules';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

export default function ViewPointPage() {
    const [banner, setBanner] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sliders, setSliders] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [selectedCat, setSelectedCat] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null); // { topic: string, sub: string }
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        const fetchBanner = async () => {
            const res = await fetch('/api/View-point/ViewBanner');
            const data = await res.json();
            setBanner(data);
        };

        const fetchSliders = async () => {
            const res = await fetch('/api/View-point/ViewSlider');
            const data = await res.json();
            setSliders(data);
        };
        const fetchBlogs = async () => {
            const res = await fetch('/api/View-point/ViewBlogs');
            const data = await res.json();
            setBlogs(data);
        };
        const fetchCategories = async () => {
            const res = await fetch('/api/View-point/ViewCategories');
            const data = await res.json();
            setCategories(data);
        };
        const fetchTopics = async () => {
            const res = await fetch('/api/View-point/ViewTopics'); // adjust path
            const data = await res.json();
            setTopics(data);
        };

        fetchTopics();
        fetchCategories();
        fetchBanner();
        fetchSliders();
        fetchBlogs();
    }, []);

    const CategoryFilter = ({ categories, selectedCat, onSelect }) => {
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
                    {categories.map((cat) => (
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
                                {cat.subcategories.map((sub, idx) => (
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
                    ))}
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

    const TopicFilter = ({ topics, selectedTopic, onSelect }) => {
        const [openKey, setOpenKey] = useState(null);

        const handleTopicClick = (topicName) => {
            if (selectedTopic?.topic === topicName && !selectedTopic?.sub) {
                onSelect(null); // deselect
            } else {
                onSelect({ topic: topicName }); // select topic
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
                    {topics.map((topic) => (
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
                                {topic.subtopics.map((sub, idx) => (
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
                    ))}
                </Collapse>
            </div>
        );
    };

    const BlogsGrid = ({ blogs, currentPage, setCurrentPage }) => {
        const blogsPerPage = 15;
        const start = (currentPage - 1) * blogsPerPage;
        const paginatedBlogs = blogs.slice(start, start + blogsPerPage);

        return (
            <div className="w-full">
                <div className="grid grid-rows-1 md:grid-cols-3 gap-4">
                    {paginatedBlogs.map((blog, i) => {
                        const blogUrl = `https://pay-nxt360.vercel.app/blog-page/${blog.slug}`; // Replace with actual URL or dynamic slug
                        const linkedInShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(blogUrl)}&title=${encodeURIComponent(blog.title)}&summary=${encodeURIComponent(blog.summary)}`;

                        return (
                            <div key={i} className='h-full'>
                                <Link
                                    key={i}
                                    href={`/blog-page/${blog.slug}`} // Replace with dynamic route if available
                                    className="bg-white flex flex-col justify-between h-full overflow-hidden block hover: transition"
                                >
                                    <img
                                        src={blog.imageIconurl}
                                        alt={blog.title}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-4 flex flex-col justify-between h-full">
                                        <div>
                                            <p className="text-sm leading-tight">
                                                {blog.date ? new Date(blog.date).toLocaleString('en-US', { month: 'long', year: 'numeric' }).replace(',', '') : ''}
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
                                        <div className='mt-2'>
                                            {/* LinkedIn Share Button */}
                                            <a
                                                href={linkedInShareUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()} // Prevent Link navigation
                                                className="mt-4 inline-flex items-center justify-center gap-2 px-1.5 py-1 rounded-xs border border-[#0077B5] bg-[#0077B5] text-white text-sm font-medium transition hover:bg-[white] hover:text-[#0077B5]"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zm-9 19H7v-9h3v9zm-1.5-10.3c-.97 0-1.75-.78-1.75-1.75S7.53 5.2 8.5 5.2s1.75.78 1.75 1.75S9.47 8.7 8.5 8.7zM20 19h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39V19h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59V19z" />
                                                </svg>
                                                Share
                                            </a>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 flex justify-center">
                    <Pagination
                        current={currentPage}
                        pageSize={blogsPerPage}
                        total={filteredBlogs.length}
                        onChange={page => setCurrentPage(page)}
                    />
                </div>
                {paginatedBlogs.length === 0 ? (
                    <p className="text-center text-gray-500">No blogs found for this category.</p>
                ) : (
                    <div className="grid grid-rows-1 md:grid-cols-3 gap-4">
                        {/* blog cards */}
                    </div>
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

        return result;
    }, [blogs, selectedCat, selectedTopic]);

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
    }, [categories, filteredBlogs]);


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
    }, [topics, filteredBlogs]);



    const paginatedBlogs = useMemo(() => {
        const chunkSize = 3;
        const result = [];
        for (let i = 0; i < filteredBlogs.length; i += chunkSize) {
            result.push(filteredBlogs.slice(i, i + chunkSize));
        }
        return result;
    }, [filteredBlogs]);


    const handleSearch = () => {
        console.log('Search Term:', searchTerm);
    };

    return (

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
                                        className="px-6 py-3 rounded-r-sm bg-[#FF6B00] text-[white] border border-[white] hover:bg-[#155392] hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
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
                                        <p className="text-xs text-gray-500 uppercase mb-1">{slide.typeText}</p>
                                        <h3 className="text-lg font-bold text-[#155392]">{slide.title}</h3>
                                        <p className="text-sm text-gray-700 mt-1 mb-2">
                                            {slide.shortDescription.length > 100
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
                    <div className="col-span-1">
                        <CategoryFilter
                            categories={filteredCategories}
                            selectedCat={selectedCat}
                            onSelect={(selection) => {
                                setSelectedCat(selection);
                                setCurrentPage(1);
                            }}
                        />

                        <TopicFilter
                            topics={filteredTopics}
                            selectedTopic={selectedTopic}
                            onSelect={(selection) => {
                                setSelectedTopic(selection);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    <div className="col-span-3">
                        <BlogsGrid
                            blogs={filteredBlogs}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}