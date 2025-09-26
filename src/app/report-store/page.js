'use client';
import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { Select, Typography, Collapse, Pagination } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper/modules";
import { Pagination as SwiperPagination } from 'swiper/modules';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import TileRenderer from '@/components/TileRenderer';
import { useSearchParams, useRouter } from 'next/navigation';

const { Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

export default function ViewPointPage() {
    const [banner, setBanner] = useState(null);
    const [sliders, setSliders] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [selectedCat, setSelectedCat] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [country, setCon] = useState([]);
    const [selectedCon, setSelectedCon] = useState(null);
    const [region, setRegion] = useState([]);
    const [selectedReg, setSelectedReg] = useState(null);
    const [visibleCount, setVisibleCount] = useState(15);
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('search') || '';
    const initialCategory = searchParams.get('category') || '';
    const [searchInput, setSearchInput] = useState(initialSearch); // Keep raw input for display
    const [searchTerm, setSearchTerm] = useState(initialSearch); // Normalized for filtering
    const router = useRouter();

    const handleTagClick = (tag) => {
        setSearchInput(tag); // Set raw tag for display
        setSearchTerm(tag.trim().replace(/\s+/g, ' ').toLowerCase()); // Normalize for filtering
        router.push(`/report-store?search=${encodeURIComponent(tag)}`);
    };

    useEffect(() => {
        const fetchBanner = async () => {
            const res = await fetch('/api/report-store/repbanner');
            const data = await res.json();
            setBanner(data);
        };

        const fetchSliders = async () => {
            const res = await fetch('/api/report-store/repslider');
            const data = await res.json();
            setSliders(data);
        };

        const fetchBlogs = async () => {
            const res = await fetch("/api/report-store/repcontent");
            const data = await res.json();

            if (initialSearch) {
                const normalizedSearch = initialSearch.trim().replace(/\s+/g, ' ').toLowerCase();
                const tokens = normalizedSearch.split(/\s+/).filter(Boolean);
                console.log('Initial Search:', normalizedSearch, 'Tokens:', tokens);
                const filtered = data.filter((report) => {
                    const hay = `${report.report_title || ''} ${report.report_summary || ''}`
                        .toLowerCase()
                        .replace(/[^\p{L}\p{N}\s]/gu, ' ');
                    return tokens.every((t) => hay.includes(t));
                });
                console.log('Filtered Blogs:', filtered.map(report => report.report_title), 'Count:', filtered.length);
                setBlogs(filtered);
            } else {
                setBlogs(data);
            }
        };

        const fetchCategories = async () => {
            const res = await fetch('/api/report-store/repcat');
            const data = await res.json();
            setCategories(data);
        };

        const fetchcountry = async () => {
            const res = await fetch('/api/report-store/repcon');
            const data = await res.json();
            setCon(data);
        };

        const fetchregion = async () => {
            const res = await fetch('/api/report-store/repreg');
            const data = await res.json();
            setRegion(data);
        };

        fetchcountry();
        fetchCategories();
        fetchBanner();
        fetchSliders();
        fetchBlogs();
        fetchregion();

        // Set initial category and search from URL
        if (initialCategory) {
            setSelectedCat({ cat: decodeURIComponent(initialCategory) });
        }
        setSearchInput(initialSearch); // Keep raw input for display
        setSearchTerm(initialSearch.trim().replace(/\s+/g, ' ').toLowerCase()); // Normalize for filtering
    }, [searchParams]);

    const CategoryFilter = ({ categories, selectedCat, onSelect, blogs }) => {
        const [openKey, setOpenKey] = useState(null);

        const handleCategoryClick = (catName) => {
            if (selectedCat?.cat === catName && !selectedCat?.sub) {
                onSelect(null);
                router.push('/report-store');
            } else {
                onSelect({ cat: catName });
                router.push(`/report-store?category=${encodeURIComponent(catName)}`);
            }
        };

        return (
            <div className="bg-white overflow-hidden">
                {/* Title */}
                <div className="bg-themeBlueColor text-white px-4 py-2 font-medium text-lg">
                    Filter by category
                </div>
                <Collapse
                    accordion
                    activeKey={openKey}
                    onChange={(key) => setOpenKey(key)}
                    expandIconPosition="end"
                    className="border-none shadow-none"
                    expandIcon={({ isActive }) => (
                        <div
                            className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 ${isActive ? 'bg-themeOrangeColor' : 'bg-themeBlueColor'}`}
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
                        const filteredSubcategories = cat.subcategories.filter((sub) =>
                            blogs.some((blog) => blog.Product_sub_Category === sub)
                        );
                        if (
                            filteredSubcategories.length > 0 ||
                            blogs.some((blog) => blog.Product_category === cat.name)
                        ) {
                            return (
                                <Panel
                                    key={cat.name}
                                    className="!bg-gray-100 !border-0"
                                    header={
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCategoryClick(cat.name);
                                            }}
                                            className={`px-0 py-1 rounded-2xl cursor-pointer flex justify-between items-center ${selectedCat?.cat === cat.name && !selectedCat?.sub
                                                ? 'bg-[#155392] text-white font-semibold'
                                                : 'text-slate-800 font-medium'
                                                }`}
                                        >
                                            {cat.name}
                                        </div>
                                    }
                                >
                                    <div className="bg-slate-100 p-0">
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
                <style jsx global>{`
                    .ant-collapse-content {
                        background-color: #f3f4f6 !important;
                    }
                    .ant-collapse-content-box {
                        padding: 0 !important;
                        background-color: #f3f4f6 !important;
                    }
                `}</style>
            </div>
        );
    };

    const CountryFilter = ({ country, selectedCon, onSelect, blogs }) => {
        const [openKey, setOpenKey] = useState(null);

        const handleCountryClick = (conName) => {
            if (selectedCon?.con === conName && !selectedCon?.sub) {
                onSelect(null);
            } else {
                onSelect({ con: conName });
            }
        };

        return (
            <div className="bg-white overflow-hidden">
                <div className="bg-themeBlueColor text-white px-4 py-2 font-medium text-lg">
                    Filter by country
                </div>
                <Collapse
                    accordion
                    activeKey={openKey}
                    onChange={(key) => setOpenKey(key)}
                    expandIconPosition="end"
                    className="border-none shadow-none"
                    expandIcon={({ isActive }) => (
                        <div
                            className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 ${isActive ? 'bg-themeOrangeColor' : 'bg-themeBlueColor'}`}
                        >
                            {isActive ? (
                                <MinusOutlined style={{ fontSize: 12, color: 'themeOrangeColor' }} />
                            ) : (
                                <PlusOutlined style={{ fontSize: 12, color: 'white' }} />
                            )}
                        </div>
                    )}
                >
                    {country.map((con) => {
                        const filteredSubcategories = (con.subcategories || []).filter((sub) =>
                            blogs.some((blog) => blog.Report_Geography_Region === sub)
                        );
                        if (
                            filteredSubcategories.length > 0 ||
                            blogs.some((blog) => blog.Report_Geography_Country === con.name)
                        ) {
                            return (
                                <Panel
                                    key={con.name}
                                    className="!bg-gray-100 !border-0"
                                    header={
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCountryClick(con.name);
                                            }}
                                            className={`px-0 py-1 rounded cursor-pointer flex justify-between items-center ${selectedCon?.con === con.name && !selectedCon?.sub
                                                ? 'bg-themeBlueColor text-white font-semibold'
                                                : 'text-slate-800 font-medium'
                                                }`}
                                        >
                                            {con.name}
                                        </div>
                                    }
                                >
                                    <div className="bg-gray-100 p-0">
                                        {filteredSubcategories.map((sub, idx) => (
                                            <div
                                                key={idx}
                                                className="cursor-pointer px-8 py-1 hover:bg-gray-200 text-md text-gray-700"
                                                onClick={() => onSelect({ con: con.name, sub })}
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
                <style jsx global>{`
                .ant-collapse-content {
                    background-color: #f3f4f6 !important;
                }
                .ant-collapse-content-box {
                    padding: 0 !important;
                    background-color: #f3f4f6 !important;
                }
            `}</style>
            </div>
        );
    };

    const RegionFilter = ({ region, selectedReg, onSelect, blogs }) => {
        const [openKey, setOpenKey] = useState(null);

        const handleRegionClick = (regName) => {
            if (selectedReg?.reg === regName && !selectedReg?.sub) {
                onSelect(null);
            } else {
                onSelect({ reg: regName });
            }
        };

        return (
            <div className="bg-white overflow-hidden">
                <div className="bg-themeBlueColor text-white px-4 py-2 font-semibold text-lg">
                    Filter by region
                </div>
                <Collapse
                    accordion
                    activeKey={openKey}
                    onChange={(key) => setOpenKey(key)}
                    expandIconPosition="end"
                    className="border-none shadow-none"
                    expandIcon={({ isActive }) => (
                        <div
                            className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 ${isActive ? 'bg-themeOrangeColor' : 'bg-themeBlueColor'}`}
                        >
                            {isActive ? (
                                <MinusOutlined style={{ fontSize: 12, color: 'themeOrangeColor' }} />
                            ) : (
                                <PlusOutlined style={{ fontSize: 12, color: 'white' }} />
                            )}
                        </div>
                    )}
                >
                    {(region || []).map((reg) => {
                        const filteredSubcategories = reg.subcategories || [];
                        if (!blogs.some((blog) => blog.Report_Geography_Region === reg.name)) {
                            return null;
                        }
                        return (
                            <Panel
                                key={reg.name}
                                className="!bg-gray-100 !border-0"
                                header={
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRegionClick(reg.name);
                                        }}
                                        className={`px-0 py-1 rounded cursor-pointer flex justify-between items-center ${selectedReg?.reg === reg.name && !selectedReg?.sub
                                            ? 'bg-themeBlueColor text-white font-semibold'
                                            : 'text-slate-800 font-semibold'
                                            }`}
                                    >
                                        {reg.name}
                                    </div>
                                }
                            >
                                <div className="bg-gray-100 p-0">
                                    {filteredSubcategories.map((sub, idx) => (
                                        <div
                                            key={idx}
                                            className="cursor-pointer px-8 py-1 hover:bg-gray-200 text-md text-gray-700"
                                            onClick={() => onSelect({ reg: reg.name, sub })}
                                        >
                                            {sub}
                                        </div>
                                    ))}
                                </div>
                            </Panel>
                        );
                    })}
                </Collapse>
                <style jsx global>{`
                .ant-collapse-content {
                    background-color: #f3f4f6 !important;
                }
                .ant-collapse-content-box {
                    padding: 0 !important;
                    background-color: #f3f4f6 !important;
                }
            `}</style>
            </div>
        );
    };

    const BlogsGrid = memo(({ blogs, onLoadMore, canLoadMore }) => (
        <div className="w-full">
            <div className="grid grid-rows-1 md:grid-cols-3 gap-4">
                {blogs.map((blog, i) => {
                    const reportUrl = `/reportstore/view/${blog.seo_url}`;
                    return (
                        <div key={blog.seo_url || i} className="h-full">
                            <Link
                                href={reportUrl}
                                className="bg-white flex flex-col justify-between overflow-hidden block"
                            >
                                <div className="w-full">
                                    {(blog.tileTemplateId && blog.tileTemplateId !== null) ? (
                                        <TileRenderer
                                            tileTemplateId={blog.tileTemplateId}
                                            fallbackIcon="FileText"
                                            className="w-full h-40"
                                        />
                                    ) : (
                                        <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500 text-sm">No template</span>
                                        </div>
                                    )}
                                </div>
                                <div className="px-4 -mt-4 -mb-4">
                                    <span className="inline-block px-4 py-2 bg-themeBlueColor text-white text-sm rounded hover:bg-themeOrangeColor transition">
                                        Report
                                    </span>
                                </div>
                                <div className="p-4 flex flex-col justify-between">
                                    <div>
                                        <p className="text-sm leading-tight">
                                            {blog.report_publish_date
                                                ? new Date(blog.report_publish_date).toLocaleString('en-US', { month: 'long', year: 'numeric' }).replace(',', '')
                                                : ''}
                                        </p>
                                        <p className="text-sm text-slate-500">{blog.Product_sub_Category}</p>
                                        <div className="border-b border-borderColor mb-4"></div>
                                        <h3 className="text-md font-semibold leading-6">
                                            {blog.report_title.split(' - ')[0]}
                                        </h3>
                                        <p className="text-sm text-slate-700">
                                            {blog.report_summary?.length > 100
                                                ? `${blog.report_summary.slice(0, 100)}...`
                                                : blog.report_summary}
                                        </p>
                                    </div>
                                    <div className="">
                                        <span className="inline-block px-3 py-1 bg-themeOrangeColor text-white text-sm rounded-full hover:bg-themeBlueColor transition">
                                            View Details
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
            {canLoadMore && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={onLoadMore}
                        className="px-6 py-3 rounded bg-themeBlueColor text-[white] hover:bg-themeOrangeColor cursor-pointer transition duration-500 focus:outline-none"
                    >
                        Load More
                    </button>
                </div>
            )}
            {blogs.length === 0 && (
                <p className="text-center text-gray-500 mt-4">No reports found for this filter.</p>
            )}
        </div>
    ));

    // Add display name for debugging
    BlogsGrid.displayName = 'BlogsGrid';

    const finalFilteredBlogs = useMemo(() => {
        let data = blogs;

        if (selectedCat) {
            if (selectedCat.sub) {
                data = data.filter(report => report.Product_sub_Category === selectedCat.sub);
            } else {
                data = data.filter(report => report.Product_category === selectedCat.cat);
            }
        }

        if (selectedCon) {
            if (selectedCon.sub) {
                data = data.filter(report => report.Report_Geography_Region === selectedCon.sub);
            } else {
                data = data.filter(report => report.Report_Geography_Country === selectedCon.con);
            }
        }

        if (selectedReg) {
            if (selectedReg.sub) {
                data = data.filter(report => report.Report_Geography_Region === selectedReg.sub);
            } else {
                data = data.filter(report => report.Report_Geography_Region === selectedReg.reg);
            }
        }

        if (searchTerm.trim()) {
            const normalizedSearch = searchTerm.trim().replace(/\s+/g, ' ').toLowerCase();
            console.log('Normalized Search Term:', normalizedSearch);
            const tokens = normalizedSearch.split(/\s+/).filter(Boolean);
            console.log('Search Tokens:', tokens);

            data = data.filter((report) => {
                const hay = `${report.report_title || ''} ${report.report_summary || ''}`
                    .toLowerCase()
                    .replace(/[^\p{L}\p{N}\s]/gu, ' ');
                const matches = tokens.every((t) => {
                    const tokenMatch = hay.includes(t);
                    console.log(`Token: ${t}, In Hay: ${tokenMatch}, Hay: ${hay}`);
                    return tokenMatch;
                });
                console.log(`Report: ${report.report_title}, Matches: ${matches}`);
                return matches;
            });

            console.log('Filtered Blogs:', data.map(report => report.report_title));
            console.log('Filtered Blogs Count:', data.length);
        }

        return data
            .slice()
            .sort((a, b) => {
                if (a.Featured_Report_Status === b.Featured_Report_Status) {
                    return new Date(b.report_publish_date) - new Date(a.report_publish_date);
                }
                return b.Featured_Report_Status - a.Featured_Report_Status;
            });
    }, [blogs, selectedCat, selectedCon, selectedReg, searchTerm]);

    const filteredCategories = useMemo(() => {
        return categories.filter(cat =>
            blogs.some(blog => blog.Product_category === cat.name)
        );
    }, [categories, blogs]);

    const filteredCountries = useMemo(() => {
        return country.filter(con =>
            blogs.some(blog => blog.Report_Geography_Country === con.name)
        );
    }, [country, blogs]);

    const filteredRegions = useMemo(() => {
        return region.filter(reg =>
            blogs.some(blog => blog.Report_Geography_Region === reg.name)
        );
    }, [region, blogs]);

    const visibleBlogs = useMemo(() => {
        return finalFilteredBlogs.slice(0, visibleCount);
    }, [finalFilteredBlogs, visibleCount]);

    useEffect(() => {
        setVisibleCount(15);
    }, [selectedCat, selectedCon, selectedReg, searchTerm]);

    const handleSearch = (value) => {
        console.log('handleSearch called with value:', value);
        const normalizedSearch = value.trim().replace(/\s+/g, ' ').toLowerCase();
        console.log('Normalized Search:', normalizedSearch);
        setSearchTerm(normalizedSearch);
        setCurrentPage(1);
        setVisibleCount(15);
        const params = new URLSearchParams();
        if (value.trim()) {
            params.set('search', value); // Use raw value for URL
        }
        if (selectedCat?.cat) {
            params.set('category', selectedCat.cat);
        }
        const newUrl = `/report-store?${params.toString()}`;
        console.log('Navigating to:', newUrl);
        router.push(newUrl, { scroll: false });
    };

    useEffect(() => {
        handleSearch(searchInput); // Directly use searchInput
    }, [searchInput, selectedCat, router]);

    // Memoize the onLoadMore function to prevent unnecessary re-renders
    const handleLoadMore = useCallback(() => {
        setVisibleCount(prev => prev + 15);
    }, []);

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
            {banner && (
            <section className="w-full bg-darkBorderColor py-20 px-8">
                <div className="flex flex-col md:!flex-row items-center justify-between gap-8 appContainer mx-auto">
                    <div className="w-full md:!w-2/3 text-left">
                        {banner ? (
                            <div>
                                <div className="font-playfair text-4xl font-bold text-themeBlueColor mb-6">{banner.bannerTitle}</div>
                                <p className="text-lg text-salte-800 mb-6">{banner.bannerDescription}</p>
                                <div className="mt-2 flex items-center relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchInput}
                                        onChange={(e) => {
                                            setSearchInput(e.target.value); // Keep raw input
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                console.log('Enter pressed with:', searchInput);
                                                handleSearch(searchInput);
                                            }
                                        }}
                                        className="w-full max-w-md px-4 py-3 rounded-l-sm bg-white text-slate-700 placeholder-slate-400 focus:outline-none"
                                    />
                                    <button
                                        onClick={() => handleSearch(searchInput)}
                                        className="px-6 py-3 rounded-r-sm bg-themeOrangeColor hover:bg-themeBlueColor focus:outline-none cursor-pointer duration-300 font-medium"
                                    >
                                        <span className='text-white'>Search</span>
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-4 mb-6">
                                    {banner.tags?.map((tag, index) => (
                                        <span
                                            key={index}
                                            onClick={() => handleTagClick(tag)}
                                            className="bg-themeOrangeColor text-white uppercase text-sm font-medium px-3 py-1 rounded-full cursor-pointer hover:opacity-80 duration-300"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-white">Loading banner...</p>
                        )}
                    </div>
                    <div className="w-full md:!w-1/3 bg-white rounded-lg shadow-lg p-4 h-fit">
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
                        <div className="custom-pagination flex justify-center gap-2 mt-4"></div>
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
                                setSelectedCon(null);
                                setSelectedReg(null);
                                setSearchTerm('');
                                setSearchInput('');
                                setCurrentPage(1);
                                setVisibleCount(15);
                                router.push('/report-store');
                            }}
                            className={`px-4 py-2 rounded duration-500 transition ${!selectedCat && !selectedCon && !selectedReg && !searchTerm && !searchInput
                                ? 'bg-darkBorderColor !text-slate-700 cursor-not-allowed'
                                : 'bg-themeBlueColor !text-white hover:bg-themeOrangeColor cursor-pointer'
                                }`}
                            disabled={!selectedCat && !selectedCon && !selectedReg && !searchTerm && !searchInput}
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
                        <CountryFilter
                            country={filteredCountries}
                            selectedCon={selectedCon}
                            onSelect={(selection) => {
                                setSelectedCon(selection);
                                setCurrentPage(1);
                            }}
                            blogs={blogs}
                        />
                        <RegionFilter
                            region={filteredRegions}
                            selectedReg={selectedReg}
                            onSelect={(selection) => {
                                setSelectedReg(selection);
                                setCurrentPage(1);
                            }}
                            blogs={blogs}
                        />
                    </div>
                    <div className="col-span-3">
                        <BlogsGrid
                            blogs={visibleBlogs}
                            onLoadMore={handleLoadMore}
                            canLoadMore={visibleCount < finalFilteredBlogs.length}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}