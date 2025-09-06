"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Pagination as SwiperPagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { Pagination } from "antd";
import TileRenderer from "@/components/TileRenderer";
import "antd/dist/reset.css"; // if you use Ant Design v5+
import { useRouter } from 'next/navigation';
import DOMPurify from 'dompurify';

function ContactSection() {
  return (
    <div className="relative z-20">
      <div className="max-w-7xl mx-auto -mb-15">
        <div className="bg-[#FF6B00] shadow-xl rounded-2xl px-8 py-10 flex flex-row md:flex-row items-center md:justify-between">

          {/* Left side: Title + Description */}
          <div className="md:text-left md:max-w-xl">
            <h2 className="text-3xl font-extrabold text-white">
              Want to speak to us directly?
            </h2>
            <p className="text-white text-lg mt-2">
              Contact us on live chat or fill out a form with your enquiry
            </p>
          </div>

          {/* Right side: Contact Button */}
          <div className="mt-6 md:mt-0 md:ml-6">
            <Link
              href="/contact-us"
              className="bg-[#155392] text-[white] font-semibold px-6 py-3 rounded-tr-xl rounded-bl-xl shadow hover:bg-[white] hover:text-[#FF6B00] transition uppercase"
            >
              get in touch
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [banner, setBanner] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sliders, setSliders] = useState([]);
  const [stats, setStats] = useState([]);
  const [platformData, setPlatformData] = useState(null);
  const [strengths, setStrengths] = useState([]);
  const [technologyPlatformData, setTechnologyPlatformData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [featuredResearch, setFeaturedResearch] = useState([]);
  const [insights, setInsights] = useState([]);
  const [partnerLogos, setPartnerLogos] = useState([]);
  const { user } = useUser();
  const isLoggedIn = !!user;
  const [blogs, setBlogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const visibleBlogs = blogs.slice(0, visibleCount);
  const [viewBlogs, setViewBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const filteredBlogs = viewBlogs.filter(b => b.is_featured === true).slice(0, 6);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const router = useRouter();
  const handleTagClick = (tag) => {
    // Navigate to /report-store?search=tagName
    router.push(`/report-store?search=${encodeURIComponent(tag)}`);
  };


  useEffect(() => {
    const fetchBanner = async () => {
      const res = await fetch("/api/home-page/topbanner");
      const data = await res.json();
      setBanner(data);
    };

    const fetchSliders = async () => {
      const res = await fetch("/api/home-page/slider");
      const data = await res.json();
      setSliders(data);
    };

    const fetchStats = async () => {
      const res = await fetch("/api/home-page/stats");
      const data = await res.json();
      setStats(data);
    };

    const fetchPlatformData = async () => {
      const res = await fetch("/api/home-page/platsection");
      const data = await res.json();
      setPlatformData(Array.isArray(data) ? data : []); // ensure it's always an array
    };

    const fetchStrengths = async () => {
      try {
        const res = await fetch("/api/home-page/strength");
        const json = await res.json();
        if (json.success) setStrengths(json.data);
      } catch (err) {
        console.error("Error fetching strengths:", err);
      }
    };

    const fetchTechnologyPlatformData = async () => {
      try {
        const res = await fetch("/api/home-page/techplat");
        const data = await res.json();
        setTechnologyPlatformData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching technology platform data:", error);
        setTechnologyPlatformData([]);
      }
    };
    const fetchProducts = async () => {
      const res = await fetch("/api/home-page/prod");
      const data = await res.json();
      setProductsData(Array.isArray(data) ? data : []);
    };
    const fetchResearchInsights = async () => {
      try {
        const res = await fetch("/api/home-page/content");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setFeaturedResearch(data.featuredResearch || []);
        setInsights(data.insights || []);
      } catch (error) {
        console.error("Error fetching research insights:", error);
      }
    };
    const fetchPartnerLogos = async () => {
      try {
        const res = await fetch("/api/home-page/partner-logos");
        const json = await res.json();
        if (json.success) setPartnerLogos(json.data);
      } catch (error) {
        console.error("Error fetching partner logos:", error);
      }
    };

    const fetchBlogs = async () => {
      const res = await fetch("/api/report-store/repcontent");
      const data = await res.json();
      // filter on client side
      const featuredReports = data.filter(
        (report) => report.Featured_Report_Status === 1
      );
      setBlogs(featuredReports);
    };

    const fetchBlog = async () => {
      const res = await fetch("/api/View-point/ViewBlogs");
      const data = await res.json();
      setViewBlogs(data);
    };

    fetchBanner();
    fetchSliders();
    fetchStats();
    fetchPlatformData();
    fetchStrengths();
    fetchTechnologyPlatformData();
    fetchProducts();
    fetchPartnerLogos();
    fetchResearchInsights();
    fetchBlogs();
    fetchBlog();
  }, []);

  const stripHTML = (html) => {
    const div = document.createElement('div');
    div.innerHTML = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] }); // Remove all tags
    return div.textContent || div.innerText || '';
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    router.push(`/report-store?search=${encodeURIComponent(searchTerm)}`);
  };

  const BlogsGrid = ({ blogs, onLoadMore, canLoadMore }) => (
    <div className="w-full">
      <div className="grid grid-rows-1 md:grid-cols-3 gap-4">
        {blogs.map((blog, i) => {
          const reportUrl = `/report-store/${blog.seo_url}`;
          return (
            <div
              key={i}
              className="h-full">
              <Link
                href={reportUrl}
                className="bg-white flex flex-col justify-between h-full overflow-hidden block">
                {/* Tile Display - Outside padded container for full width */}
                <div className="w-full h-50">
                  {blog.tileTemplateId && blog.tileTemplateId !== null ? (
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

                {/* Report Button - Positioned between tile and text content */}
                <div className="px-4 -mt-2 mb-2">
                  <span className="inline-block px-4 py-2 bg-[#155392] text-white text-sm rounded hover:bg-[#0e3a6f] transition">
                    Report
                  </span>
                </div>

                <div className="p-4 flex flex-col justify-between h-full">
                  <div>
                    <p className="text-sm leading-tight">
                      {blog.report_publish_date
                        ? new Date(blog.report_publish_date)
                          .toLocaleString("en-US", {
                            month: "long",
                            year: "numeric",
                          })
                          .replace(",", "")
                        : ""}
                    </p>
                    <p className="text-sm text-gray-500">
                      {blog.Product_sub_Category}
                    </p>
                    <div className="border-b border-gray-400 mb-4"></div>
                    <h3 className="text-md font-bold">
                      {blog.report_title.split(" - ")[0]}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {blog.report_summary?.length > 100
                        ? `${blog.report_summary.slice(0, 100)}...`
                        : blog.report_summary}
                    </p>
                  </div>
                  <div className="-mt-8">
                    <span className="inline-block px-3 py-1 bg-[#155392] text-white text-sm rounded-full hover:bg-[#0e3a6f] transition">
                      View
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
            className="px-6 py-3 rounded bg-[#155392] text-[white] hover:bg-[#0e3a6f] focus:outline-none">
            Load More
          </button>
        </div>
      )}

      {blogs.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No reports found for this filter.
        </p>
      )}
    </div>
  );

  const BlogGrid = ({ blog = [] }) => {
    return (
      <div className="w-full">
        <div className="grid grid-rows-1 md:grid-cols-3 gap-4">
          {(blog || []).map((blo, i) => {
            const blogUrl = `https://pay-nxt360.vercel.app/view-point/${blo.slug}`;
            const linkedInShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
              blogUrl
            )}&title=${encodeURIComponent(
              blo.title
            )}&summary=${encodeURIComponent(blo.summary)}`;

            return (
              <div
                key={i}
                className="h-full">
                <Link
                  href={`/blog-page/${blo.slug}`}
                  className="bg-white flex flex-col justify-between h-full overflow-hidden block hover: transition">
                  <div className="w-full h-40">
                    {blo.tileTemplateId ? (
                      <TileRenderer
                        tileTemplateId={blo.tileTemplateId}
                        fallbackIcon="FileText"
                        className="w-full h-40"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg">
                        <span className="text-gray-500 text-sm">
                          No template
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col justify-between h-full">
                    <div>
                      <p className="text-sm leading-tight">
                        {blo.date
                          ? new Date(blo.date)
                            .toLocaleString("en-US", {
                              month: "long",
                              year: "numeric",
                            })
                            .replace(",", "")
                          : ""}
                      </p>
                      <p className="text-sm text-gray-500">
                        {Array.isArray(blo.subcategory)
                          ? blo.subcategory.join(", ")
                          : blo.subcategory}
                      </p>
                      <div className="border-b border-gray-400 mb-4"></div>
                      <h3 className="text-md font-bold">{blo.title}</h3>
                      <p className="text-sm text-gray-700">
                        {blo.summary
                          ? stripHTML(blo.summary).length > 100
                            ? `${stripHTML(blo.summary).slice(0, 100)}...`
                            : stripHTML(blo.summary)
                          : ''}
                      </p>
                    </div>
                    <div className="mt-2">
                      <a
                        href={linkedInShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-4 inline-flex items-center justify-center gap-2 px-1.5 py-1 rounded-xs border border-[#0077B5] bg-[#0077B5] text-white text-sm font-medium transition hover:bg-[white] hover:text-[#0077B5]">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24">
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

        {blog.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No blogs found for this category.
          </p>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-white">
      {isLoggedIn ? (
        <>
          {productsData.length > 0 && (
            <section className="w-full py-10 bg-white px-8 mt-8">
              <div className="max-w-7xl mx-auto space-y-6">
                <h2 className="text-black text-3xl text-center mb-8">
                  {productsData[0].mainTitle}
                </h2>

                <div className="grid grid-rows-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {productsData.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-6 text-center border border-gray-200 hover:shadow-xl transition-all duration-300 h-90 flex flex-col justify-between">
                      <div>
                        <img
                          src={item.imageIconurl}
                          alt={item.productName}
                          className="mx-auto h-9 mb-4 object-contain"
                        />
                        <h3 className="text-lg font-semibold text-black mb-6">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-gray-700">
                          {item.description}
                        </p>
                      </div>

                      <a
                        href={
                          item.url?.startsWith("/") ? item.url : `/${item.url}`
                        }
                        className="mt-4 inline-block w-24 py-1 text-white bg-[#155392] rounded text-center mx-auto transition-all duration-300 hover:bg-[white] hover:text-orange-500">
                        View
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="bg-gray-100 py-10">
            <div className="max-w-7xl mx-auto px-4 mb-6 mt-10">
              <p className="text-sm text-center uppercase text-[#FF6B00] tracking-wide">
                - latest research -
              </p>
              <h2 className="text-2xl text-center font-bold text-gray-800 mt-1">
                Market Opportunities in Fintech
              </h2>
            </div>
            <div className="max-w-7xl mx-auto px-4 grid grid-rows-1 md:grid-cols-4 gap-8">
              <div className="col-span-4">
                <BlogsGrid
                  blogs={visibleBlogs}
                  onLoadMore={() => setVisibleCount((prev) => prev + 15)}
                />
                <div className="mt-6 flex justify-center">
                  <Link
                    href="/report-store"
                    className="inline-block px-4 py-3 bg-[#FF6B00] text-white text-md font-medium rounded-tr-xl rounded-bl-xl hover:bg-[#155392] transition">
                    VIEW ALL
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gray-100 py-10">
            <div className="max-w-7xl mx-auto px-4 mb-6 mt-2">
              <p className="text-sm text-center uppercase text-[#FF6B00] tracking-wide">
                - Deeper Look -
              </p>
              <h2 className="text-2xl text-center font-bold text-gray-800 mt-1">
                Market Dynamics and Key Trends
              </h2>
            </div>
            <div className="max-w-7xl mx-auto px-4 grid grid-rows-1 md:grid-cols-4 gap-8">
              <div className="col-span-4">
                <BlogGrid blog={filteredBlogs || []} />
                <div className="mt-6 flex justify-center">
                  <Link
                    href="/insights"
                    className="inline-block px-4 py-3 bg-[#FF6B00] text-white text-md font-medium rounded-tr-xl rounded-bl-xl hover:bg-[#155392] transition">
                    VIEW ALL
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <ContactSection />
        </>
      ) : (
        <>
          <style
            jsx
            global>{`
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
              background: #ff6b00 !important;
            }
          `}</style>

          <section
            className="w-full py-55 px-8 bg-cover bg-center relative"
            style={{
              backgroundImage: banner?.image
                ? `url(${banner.image})`
                : undefined,
            }}>
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 flex flex-row justify-between gap-8 max-w-7xl mx-auto items-start">
              {/* Left Banner Section */}
              <div className="w-2/3 text-left">
                {banner ? (
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-6">
                      {banner.bannerHeading}
                    </h1>

                    <div className="mt-2 flex items-center">
                      <input
                        type="text"
                        placeholder="Search for market intelligence on fintech"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full max-w-md px-4 py-3 rounded-l-sm bg-white text-[#155392] placeholder-[#155392] border border-[white] focus:outline-none focus:ring-2 focus:ring-white"
                      />
                      <button
                        onClick={handleSearch}
                        className="px-6 py-3 rounded-r-sm bg-[#FF6B00] text-[white] border border-[white] hover:bg-[#155392] hover:text-white focus:outline-none focus:ring-2 focus:ring-white duration-300 cursor-pointer">
                        Search
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6 mt-4">
                      {banner.tags.map((tag, index) => (
                        <span
                          key={index}
                          onClick={() => handleTagClick(tag)}
                          className="bg-[#FF6B00] text-white text-sm font-semibold px-3 py-1 rounded-full cursor-pointer hover:opacity-80 duration-300">
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
                  modules={[SwiperPagination, Autoplay]}
                  pagination={{
                    el: ".custom-pagination",
                    clickable: true,
                  }}
                  spaceBetween={16}
                  slidesPerView={1}
                  autoplay={{
                    delay: 5000, // 5 seconds
                    disableOnInteraction: false, // keeps auto-rotating even after user interacts
                  }}>
                  {sliders.map((slide, index) => (
                    <SwiperSlide key={index}>
                      <div className="mb-4 border-b pb-4">
                        <p className="text-xs text-gray-500 uppercase mb-1">
                          {slide.typeText}
                        </p>
                        <h3 className="text-lg font-bold text-[#155392]">
                          {slide.title}
                        </h3>
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
                            className="text-sm text-white bg-[#155392] hover:bg-[#0e3a6f] px-3 py-1 rounded">
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
          <section className="w-full py-5 bg-[#FF6B00]">
            <div className="relative">
              {/* First Row - Stats */}
              <div className="grid grid-rows-1 md:grid-cols-4 text-center">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-[#FF6B00] px-6 py-2 min-h-[110px] flex flex-col justify-center relative"
                  >
                    {/* Manual divider */}
                    {index < stats.length - 1 && (
                      <div className="md:block absolute right-0 top-1/2 transform -translate-y-1 h-[70%] w-px bg-white/90 z-10" />
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {stat.title}
                      </h3>
                      <p className="text-1xl text-white mt-2 inline-block bg-[#155392] text-white px-3 py-1 rounded-tr-xl rounded-bl-xl">
                        {stat.statText}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Second Row - Descriptions */}
              <div className="grid grid-rows-1 md:grid-cols-4 text-center">
                {stats.map((stat, index) => (
                  <p key={index} className="text-sm text-white px-6">
                    {stat.description}
                  </p>
                ))}
              </div>
            </div>
          </section>


          <section className="w-full py-10 bg-gray-100">
            <div className="max-w-6xl mx-auto space-y-10">
              {strengths.map((item, idx) => (
                <div key={idx}>
                  {/* OUR STRENGTH Header */}
                  <p className="text-[#FF6B00] text-md text-center tracking-wide mb-1">
                    - OUR STRENGTH -
                  </p>

                  {/* Title aligned with section cards */}
                  <div className="grid grid-rows-1 md:grid-cols-3 items-start">
                    <h1 className="md:col-span-10 text-4xl text-black text-center">
                      {item.title}
                    </h1>

                    {item.sections.map((section, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 p-8 h-72">
                        <img
                          src={section.image}
                          alt={section.imageTitle}
                          className="mx-auto h-24 mb-4 object-contain"
                        />
                        <h3 className="text-lg font-semibold text-black mb-2 text-center">
                          {section.imageTitle}
                        </h3>
                        <p className="text-sm text-gray-600 text-center">
                          {section.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="w-full bg-gray-100">
            <div className="max-w-8xl mx-auto">
              <div className="grid grid-rows-2 md:grid-cols-4 lg:grid-cols-8">
                {partnerLogos.map((logo, index) => (
                  <div
                    key={index}
                    className="flex justify-center items-center">
                    <img
                      src={logo.imageUrl}
                      alt={logo.altText || `Logo ${index + 1}`}
                      className="w-45 h-23 object-contain grayscale hover:grayscale-0 transition duration-300 border border-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {productsData.length > 0 && (
            <section className="w-full py-10 bg-white px-8 mt-8">
              <div className="max-w-7xl mx-auto space-y-6">
                <h2 className="text-black text-3xl text-center mb-8">
                  {productsData[0].mainTitle}
                </h2>

                <div className="grid grid-rows-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {productsData.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-6 text-center border border-gray-200 hover:shadow-xl transition-all duration-300 h-90 flex flex-col justify-between">
                      <div>
                        <img
                          src={item.imageIconurl}
                          alt={item.productName}
                          className="mx-auto h-9 mb-4 object-contain"
                        />
                        <h3 className="text-lg font-semibold text-black mb-6">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-gray-700">
                          {item.description}
                        </p>
                      </div>

                      <a
                        href={
                          item.url?.startsWith("/") ? item.url : `/${item.url}`
                        }
                        className="mt-4 inline-block w-24 py-1 text-white bg-[#155392] rounded text-center mx-auto transition-all duration-300 hover:bg-[white] hover:text-orange-500">
                        View
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {technologyPlatformData.length > 0 && (
            <section className="w-full py-10 bg-gray-100 px-8">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-[#FF6B00] text-md text-center tracking-wide mb-2">
                  - TECHNOLOGY PLATFORM -
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  {technologyPlatformData.map((platform, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-100 h-180">
                      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-4xl text-black text-center mb-6">
                        {platform.title}
                      </h1>
                      <img
                        src={platform.image}
                        alt={platform.title}
                        className="mx-auto h-160 object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {platformData?.length > 0 && (
            <section className="w-full bg-white">
              <div className="relative">
                <div className="grid grid-rows-1 md:grid-cols-3">
                  {platformData.map((item, index) => {
                    const images = [
                      "/Images/paynxt360-knowledge-center.jpg",
                      "/Images/report-store.jpg",
                      "/Images/consulting.jpg"
                    ];

                    return (
                      <div
                        key={index}
                        className="relative w-full h-80 border-10 border-gray-200 hover:border-[#FF6B00] p-6 text-center transition-all duration-300 overflow-hidden"
                      >
                        {/* Background Image */}
                        <img
                          src={images[index]}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover z-0"
                        />

                        {/* Blue overlay */}
                        <div className="absolute inset-0 bg-[#155392] opacity-85 z-[1]"></div>

                        {/* Existing content */}
                        <div className="relative z-[2]">
                          <h3 className="text-lg font-semibold text-white mt-16 mb-2">
                            {item.title}
                          </h3>
                          <p className="text-sm text-white mb-2">
                            {item.description}
                          </p>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block font-semibold px-2 py-1 rounded text-[#FF6B00] hover:text-[white] transition-colors duration-300"
                          >
                            {item.clickText || "Learn More"}
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          <section className="flex justify-around max-w-7xl mx-auto py-10 px-20 md:px-8 lg:px-3">
            <div className="w-full">
              <div className="grid grid-rows-1 md:grid-cols-3 items-stretch gap-y-12 md:gap-y-0 md:gap-x-2">
                {/* Featured Research */}
                <div className="flex-col items-center justify-items-center space-y-5 md:space-y-12 md:block">
                  <div className="flex justify-around items-center mb-4 w-full">
                    <h2 className="text-xl font-semibold text-gray-700 pl-14 lg:pl-0 lg:ml-[-40px]">
                      Featured
                    </h2>
                    <a
                      href="/report-store"
                      className="text-[#FF6B00] hover:text-[#155392] text-sm font-semibold transition-colors duration-200">
                      View All →
                    </a>
                  </div>

                  {featuredResearch.slice(0, 5).map((item, idx) => (
                    <div
                      key={idx}
                      className="relative flex items-center h-20 w-5/6 py-4 bg-white pl-14">
                      <img
                        src={item.content.imageurl}
                        alt={item.content.title}
                        className="absolute left-0 h-20 w-20 bg-gray-100 object-cover -translate-x-1/2 z-20"
                      />
                      <a
                        href={`/${item.content.url}`}
                        className="font-bold text-gray-800 hover:text-[#FF6B00] transition-colors duration-200 md:text-base">
                        {item.content.title}
                      </a>
                    </div>
                  ))}
                </div>

                {/* Middle Orange Bar */}
                <div className="flex justify-center items-center relative">
                  <div className="w-100 md:w-60 bg-[#FF6B00] md:h-full relative flex flex-col items-center justify-center space-y-2 py-10">
                    <span className="text-white text-xl md:text-2xl font-bold">
                      Insight.
                    </span>
                    <span className="text-white text-xl md:text-2xl font-bold">
                      Innovation.
                    </span>
                    <span className="text-white text-xl md:text-2xl font-bold">
                      Impact.
                    </span>
                  </div>
                </div>

                {/* Insights */}
                <div className="flex-col items-center justify-items-center space-y-5 md:space-y-12 md:block">
                  <div className="flex justify-around items-center mb-4 w-full">
                    <h2 className="text-xl font-semibold text-gray-700 pl-14 lg:pl-0 lg:ml-[-40px]">
                      Insights
                    </h2>
                    <a
                      href="/report-store"
                      className="text-[#FF6B00] hover:text-[#155392] text-sm font-semibold transition-colors duration-200">
                      View All →
                    </a>
                  </div>

                  {insights.slice(0, 5).map((item, idx) => (
                    <div
                      key={idx}
                      className="relative flex items-center h-20 w-5/6 pr-4 py-4 bg-white pl-14">
                      <img
                        src={item.content.imageurl}
                        alt={item.content.title}
                        className="absolute left-0 h-20 w-20 bg-gray-100 object-cover -translate-x-1/2"
                      />
                      <a
                        href={`/${item.content.url}`}
                        className="font-bold text-gray-800 hover:text-[#FF6B00] transition-colors duration-200">
                        {item.content.title}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="w-full bg-white h-160 py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-rows-1 md:grid-cols-[30%_70%] items-center gap-4">
              {/* Left Section: Text and Button */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  PayNXT360 Insights
                </h2>
                <p className="text-gray-600 text-lg">
                  Sign up for The PayNXT360 Insights, and get a weekly roundup
                  of market events, innovations and data you can trust and use.
                </p>
                <a href="/login">
                  <button className="px-6 py-3 bg-[#FF6B00] text-[white] font-semibold rounded-tr-xl rounded-bl-xl hover:bg-[#155392] transition duration-300 cursor-pointer">
                    SIGN UP NOW
                  </button>
                </a>
              </div>

              {/* Right Section: Image */}
              <div className="flex justify-center">
                <img
                  src="/Images/whypay.svg" // make sure your image is at public/images/your-image.jpg
                  alt="Newsletter"
                  className="w-full max-w-4xl"
                />
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
