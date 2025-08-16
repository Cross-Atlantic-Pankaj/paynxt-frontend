'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Select, Typography, Collapse, Pagination } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination as SwiperPagination } from 'swiper/modules';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import toast, { Toaster } from 'react-hot-toast';
import 'swiper/css';
import 'swiper/css/pagination';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
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
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [country, setCon] = useState([]);
    const [selectedCon, setSelectedCon] = useState(null);
    const [region, setRegion] = useState([]);
    const [selectedReg, setSelectedReg] = useState(null);
    const [visibleCount, setVisibleCount] = useState(15); // initially show 9 blogs
    const [searchInput, setSearchInput] = useState('');
    const [wishlist, setWishlist] = useState([]);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);
    const [wishlistError, setWishlistError] = useState(null);
    const [pageLoadStart, setPageLoadStart] = useState(performance.now());

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            toast.error('Please log in to view your wishlist');
            router.push(`/login?callbackUrl=/wishlist`);
            return;
        }
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
            const res = await fetch('/api/report-store/repcontent');
            const data = await res.json();
            setBlogs(data);
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
        const fetchWishlist = async () => {
            setIsWishlistLoading(true);
            setWishlistError(null);
            try {
                // Fetch wishlist items with full data and tile templates
                const res = await fetch('/api/wishlist/items', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (res.ok) {
                    const response = await res.json();
                    if (response.success) {
                        const wishlistReports = response.data || [];
                        setBlogs(wishlistReports); // Set the blogs directly from wishlist API
                        setWishlist(wishlistReports.map(item => item.seo_url));
                    } else {
                        setWishlist([]);
                        setBlogs([]);
                        setWishlistError(response.message || 'Failed to load wishlist');
                    }
                } else {
                    setWishlist([]);
                    setBlogs([]);
                    setWishlistError('Failed to load wishlist');
                    toast.error('Failed to load wishlist');
                }
            } catch (error) {
                console.error('Error fetching wishlist:', error);
                setWishlist([]);
                setBlogs([]);
                setWishlistError('An error occurred while loading your wishlist');
                toast.error('An error occurred while loading your wishlist');
            } finally {
                setIsWishlistLoading(false);
            }
        };

        fetchcountry();
        fetchCategories();
        fetchBanner();
        fetchSliders();
        fetchWishlist(); // This now fetches both wishlist and blog data with tile templates
        fetchregion();
    }, [user, isLoading, router]);

    const toggleWishlist = async (seo_url) => {
        if (!user) {
            toast.error('Please log in to modify your wishlist');
            router.push(`/login?callbackUrl=/wishlist`);
            return;
        }

        const isInWishlist = wishlist.includes(seo_url);
        const toastId = toast.loading(isInWishlist ? 'Removing from wishlist...' : 'Adding to wishlist...');
        try {
            const res = await fetch('/api/wishlist', {
                method: isInWishlist ? 'DELETE' : 'POST',
                body: JSON.stringify({ seo_url }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (res.ok) {
                setWishlist(prev =>
                    isInWishlist ? prev.filter(id => id !== seo_url) : [...prev, seo_url]
                );
                toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist', { id: toastId });
            } else {
                toast.error('Failed to update wishlist', { id: toastId });
            }
        } catch (error) {
            console.error('Error updating wishlist:', error);
            toast.error('An error occurred while updating your wishlist', { id: toastId });
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/login');
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
                            blogs.some((blog) => blog.Product_sub_Category === sub)
                        );

                        // Only render the Panel if there are subcategories or the category is tagged
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
    const CountryFilter = ({ country, selectedCon, onSelect, blogs }) => {
        const [openKey, setOpenKey] = useState(null);

        const handleCountryClick = (conName) => {
            if (selectedCon?.con === conName && !selectedCon?.sub) {
                onSelect(null); // Deselect
            } else {
                onSelect({ con: conName }); // Select country
            }
        };

        return (
            <div className="bg-gray-100 overflow-hidden">
                {/* Title */}
                <div className="bg-[#155392] text-white px-4 py-2 font-semibold text-lg">
                    Filter by country
                </div>

                {/* Countries */}
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
                    {country.map((con) => {
                        // Filter subcategories to only those present in blogs
                        const filteredSubcategories = (con.subcategories || []).filter((sub) =>
                            blogs.some((blog) => blog.Report_Geography_Region === sub)
                        );

                        // Only render the Panel if there are subcategories or the country is tagged
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
                                                e.stopPropagation(); // Prevent collapse toggle
                                                handleCountryClick(con.name);
                                            }}
                                            className={`px-4 py-1 rounded-2xl cursor-pointer flex justify-between items-center ${selectedCon?.con === con.name && !selectedCon?.sub
                                                ? 'bg-[#155392] text-white font-semibold'
                                                : 'text-gray-800 font-semibold'
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
    const RegionFilter = ({ region, selectedReg, onSelect, blogs }) => {
        const [openKey, setOpenKey] = useState(null);

        const handleRegionClick = (regName) => {
            if (selectedReg?.reg === regName && !selectedReg?.sub) {
                onSelect(null); // Deselect
            } else {
                onSelect({ reg: regName }); // Select country
            }
        };

        return (
            <div className="bg-gray-100 overflow-hidden">
                {/* Title */}
                <div className="bg-[#155392] text-white px-4 py-2 font-semibold text-lg">
                    Filter by region
                </div>

                {/* Countries */}
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

                    {console.log("Region in component:", region)}
                    {(region || []).map((reg) => {
                        const filteredSubcategories = reg.subcategories || [];
                        // Filter subcategories to only those present in blogs
                        // Only render the Panel if there are subcategories or the country is tagged
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
                                            e.stopPropagation(); // Prevent collapse toggle
                                            handleRegionClick(reg.name);
                                        }}
                                        className={`px-4 py-1 rounded-2xl cursor-pointer flex justify-between items-center ${selectedReg?.reg === reg.name && !selectedReg?.sub
                                            ? 'bg-[#155392] text-white font-semibold'
                                            : 'text-gray-800 font-semibold'
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

    const BlogsGrid = ({ blogs, wishlist, onLoadMore, canLoadMore }) => {
        const wishlistBlogs = blogs.filter(blog => wishlist.includes(blog.seo_url));

        return (
            <div className="w-full">
                {isWishlistLoading ? (
                    <p className="text-center text-gray-500 mt-4">Loading wishlist...</p>
                ) : wishlistError ? (
                    <p className="text-center text-red-500 mt-4">{wishlistError}</p>
                ) : wishlistBlogs.length === 0 ? (
                    <p className="text-center text-gray-500 mt-4">No reports in your wishlist.</p>
                ) : (
                    <div className="grid grid-rows-1 md:grid-cols-3 gap-4">
                        {wishlistBlogs.map((blog, i) => {
                            const reportUrl = `/report-store/${blog.seo_url}`;
                            return (
                                <div key={i} className="h-full">
                                    <Link
                                        href={reportUrl}
                                        className="bg-white flex flex-col justify-between h-full overflow-hidden block"
                                    >
                                        {/* Tile Display - Outside padded container for full width */}
                                        <div className="w-full h-40">
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
                                        
                                        <div className="p-4 flex flex-col justify-between">
                                            <div>
                                                <p className="text-sm leading-tight">
                                                    {blog.report_publish_date
                                                        ? new Date(blog.report_publish_date).toLocaleString('en-US', {
                                                            month: 'long',
                                                            year: 'numeric',
                                                        }).replace(',', '')
                                                        : ''}
                                                </p>
                                                <p className="text-sm text-gray-500">{blog.Product_sub_Category}</p>
                                                <div className="border-b border-gray-400 mb-4"></div>
                                                <h3 className="text-md font-bold">{blog.report_title.split(' - ')[0]}</h3>
                                                <p className="text-sm text-gray-700">
                                                    {blog.report_summary?.length > 100
                                                        ? `${blog.report_summary.slice(0, 100)}...`
                                                        : blog.report_summary}
                                                </p>
                                            </div>
                                            <div className="mt-4 flex gap-2">
                                                <span className="inline-block px-4 py-2 bg-[#155392] text-white text-sm rounded hover:bg-[#0e3a6f] transition">
                                                    View
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleWishlist(blog.seo_url);
                                                    }}
                                                    className={`px-4 py-2 text-sm rounded ${wishlist.includes(blog.seo_url)
                                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                >
                                                    {wishlist.includes(blog.seo_url) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}

                {canLoadMore && wishlistBlogs.length > 0 && (
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={onLoadMore}
                            className="px-6 py-3 rounded bg-[#155392] text-[white] hover:bg-[#0e3a6f] focus:outline-none"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const filteredReports = useMemo(() => {
        if (!selectedCat) return blogs;
        if (selectedCat.sub) {
            return blogs.filter(report => report.Product_sub_Category === selectedCat.sub);
        }
        return blogs.filter(report => report.Product_category === selectedCat.cat);
    }, [blogs, selectedCat]);

    const filterReports = useMemo(() => {
        if (!selectedCon) return blogs;
        if (selectedCon.sub) {
            return blogs.filter(report => report.Report_Geography_Region === selectedCon.sub);
        }
        return blogs.filter(report => report.Report_Geography_Country === selectedCon.con);
    }, [blogs, selectedCon]);

    const filterregReports = useMemo(() => {
        if (!selectedReg) return blogs;
        if (selectedReg.sub) {
            return blogs.filter(report => report.Report_Geography_Region === selectedReg.sub);
        }
        return blogs.filter(report => report.Report_Geography_Region === selectedReg.reg);
    }, [blogs, selectedReg]);

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
            const lowerTerm = searchTerm.toLowerCase();
            data = data.filter(
                report =>
                    report.report_title?.toLowerCase().includes(lowerTerm) ||
                    report.report_summary?.toLowerCase().includes(lowerTerm)
            );
        }

        data = data.filter(blog => wishlist.includes(blog.seo_url));

        return data
            .slice()
            .sort((a, b) => {
                if (a.Featured_Report_Status === b.Featured_Report_Status) {
                    return new Date(b.report_publish_date) - new Date(a.report_publish_date);
                }
                return b.Featured_Report_Status - a.Featured_Report_Status;
            });
    }, [blogs, selectedCat, selectedCon, selectedReg, searchTerm, wishlist]);


    const filteredCategories = useMemo(() => {
        // For each category, check if at least one blog has matching Product_category
        return categories.filter(cat =>
            finalFilteredBlogs.some(blog => blog.Product_category === cat.name)
        );
    }, [categories, blogs]);

    const filteredCountries = useMemo(() => {
        return country.filter(con =>
            finalFilteredBlogs.some(blog => blog.Report_Geography_Country === con.name)
        );
    }, [country, blogs]);

    const filteredRegions = useMemo(() => {
        return region.filter(reg =>
            finalFilteredBlogs.some(blog => blog.Report_Geography_Region === reg.name)
        );
    }, [region, blogs]);

    const visibleBlogs = useMemo(() => {
        return finalFilteredBlogs.slice(0, visibleCount);
    }, [finalFilteredBlogs, visibleCount]);

    useEffect(() => {
        setVisibleCount(15);
    }, [selectedCat, selectedCon, selectedReg, searchTerm, wishlist]);

    const handleSearch = () => {
        setSearchTerm(searchInput);
        setCurrentPage(1);
        setVisibleCount(15);
        console.log('Search Term:', searchTerm);
    };

    return (

        <main className="min-h-screen bg-gray-100">
            <PerformanceMonitor 
                componentName="Wishlist Page" 
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
                                <p className="text-md text-white mt-1 mb-8">
                                    {banner.bannerDescription}
                                </p>

                                <div className="mt-2 flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                                        className="w-full max-w-md px-4 py-3 rounded-l-sm bg-white text-[#155392] placeholder-[#155392] border border-[white] focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className="px-6 py-3 rounded-r-sm bg-[#FF6B00] text-[white] border border-[white] hover:bg-[#155392] hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                    >
                                        Search
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-6 mt-4">
                                    {banner.tags?.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-[#FF6B00] text-white text-sm font-semibold px-3 py-1 rounded-full"
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
            <section className="bg-gray-100 py-10">
                <div className="max-w-7xl mx-auto px-4 grid grid-rows-1 md:grid-cols-4 gap-8">
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
                            }}
                            className={`px-4 py-2 rounded transition ${!selectedCat && !selectedCon && !selectedReg && !searchTerm
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#155392] text-[white] hover:bg-[#0e3a6f]'
                                }`}
                            disabled={!selectedCat && !selectedCon && !selectedReg && !searchTerm}
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
                            wishlist={wishlist}
                            onLoadMore={() => setVisibleCount(prev => prev + 15)}
                            canLoadMore={visibleCount < finalFilteredBlogs.length}
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}