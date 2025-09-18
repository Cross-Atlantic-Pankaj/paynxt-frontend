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
import { FaArrowRightLong, FaLinkedin } from "react-icons/fa6";

function ContactSection() {
  return (
    <div className="relative z-20">
      <div className="appContainer -m-4">
        <div className="bg-themeOrangeColor shadow-xl rounded-2xl p-12 flex flex-row md:flex-row items-center md:justify-between">

          {/* Left side: Title + Description */}
          <div className="md:text-left md:max-w-xl">
            <h2 className="text-3xl font-extrabold text-white !mb-2">
              Want to speak to us directly?
            </h2>
            <p className="text-white text-lg !mb-0">
              Contact us on live chat or fill out a form with your enquiry
            </p>
          </div>

          {/* Right side: Contact Button */}
          <div className="mt-6 md:mt-0 md:ml-6">
            <Link
              href="/contact-us"
              className="bg-themeBlueColor text-white font-semibold px-8 py-3 rounded-tr-xl rounded-bl-xl shadow hover:bg-white hover:text-themeOrangeColor transition uppercase"
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
                className="bg-white flex flex-col justify-between h-full overflow-hidden block hover:shadow-sm transition duration-500">
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
                <div className="px-4 -mt-4">
                  <span className="inline-block px-4 py-2 bg-themeBlueColor text-white text-sm rounded hover:bg-themeOrangeColor transition">
                    Report
                  </span>
                </div>

                <div className="p-4 flex flex-col justify-between">
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
                    <p className="text-sm text-slate-700">
                      {blog.Product_sub_Category}
                    </p>
                    <div className="border-b border-borderColor mb-4"></div>
                    <h3 className="text-md font-semibold leading-6">
                      {blog.report_title.split(" - ")[0]}
                    </h3>
                    <p className="text-sm text-slate-700">
                      {blog.report_summary?.length > 100
                        ? `${blog.report_summary.slice(0, 100)}...`
                        : blog.report_summary}
                    </p>
                  </div>
                  <div>
                    <span className="inline-block px-6 py-2 bg-themeBlueColor text-white text-sm rounded-sm hover:bg-themeOrangeColor transition duration-500">
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
        <div className="mt-8 flex justify-center">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 rounded bg-themeOrangeColor text-[white] hover:bg-themeBlueColor focus:outline-none">
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
            const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            const blogUrl = `${base}/view-point/${blo.slug}`;
            const linkedInShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
              blogUrl
            )}&title=${encodeURIComponent(
              blo.title
            )}&summary=${encodeURIComponent(blo.summary)}`;

            return (
              <div
                key={i} >
                <Link
                  href={`/blog-page/${blo.slug}`}
                  className="bg-slate-50 flex flex-col justify-between overflow-hidden block hover:bg-white transition duration-500">
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
                  <div className="p-4 flex flex-col justify-between">
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
                      <p className="text-sm text-slate-500">
                        {Array.isArray(blo.subcategory)
                          ? blo.subcategory.join(", ")
                          : blo.subcategory}
                      </p>
                      <div className="border-b border-borderColor mb-4"></div>
                      <h3 className="text-md font-semibold leading-6">{blo.title}</h3>
                      <p className="text-sm text-slate-700">
                        {blo.summary
                          ? stripHTML(blo.summary).length > 100
                            ? `${stripHTML(blo.summary).slice(0, 100)}...`
                            : stripHTML(blo.summary)
                          : ''}
                      </p>
                    </div>
                    <div className="mt-2">
                      <a href={linkedInShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center gap-2 px-2 py-1 rounded-xs border border-[#0077B5] bg-[#0077B5] text-white text-sm font-medium transition hover:bg-[white] hover:text-[#0077B5]">
                          <FaLinkedin />
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
          <p className="text-center text-slate-500 mt-4">
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
            <section className="w-full py-16 md:py-24">
              <div className="appContainer">
                <div className="text-4xl font-light text-center mb-8">
                  {productsData[0].mainTitle}
                </div>

                <div className="grid grid-rows-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {productsData.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-6 text-center border border-borderColor hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <img
                          src={item.imageIconurl}
                          alt={item.productName}
                          className="mx-auto h-9 mb-4 object-contain"
                        />
                        <h3 className="text-lg font-semibold text-black mb-6">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-slate-700">
                          {item.description}
                        </p>
                      </div>

                      <a
                        href={
                          item.url?.startsWith("/") ? item.url : `/${item.url}`
                        }
                        className="mt-4 inline-block px-6 py-2 font-light text-white bg-themeBlueColor rounded-xs text-center mx-auto transition duration-300 hover:bg-themeOrangeColor">
                        View
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="w-full py-16 md:py-24 bg-slate-50">
            <div className="appContainer">
              <p className="text-themeOrangeColor uppercase text-md font-thin text-center mb-1">
                - latest research -
              </p>
              <div className="text-4xl font-light text-center mb-8">
                Market Opportunities in Fintech
              </div>
            </div>
            <div className="appContainer px-4 grid grid-rows-1 md:grid-cols-4 gap-8">
              <div className="col-span-4">
                <BlogsGrid
                  blogs={visibleBlogs}
                  onLoadMore={() => setVisibleCount((prev) => prev + 15)}
                />
                <div className="mt-6 flex justify-center">
                  <Link
                    href="/report-store"
                    className="inline-block px-4 py-3 bg-themeOrangeColor text-white text-md font-medium rounded-tr-xl rounded-bl-xl hover:bg-themeBlueColor transition">
                    VIEW ALL
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-16 md:py-24">
            <div className="appContainer">
              <p className="text-themeOrangeColor uppercase text-md font-thin text-center mb-1">
                - Deeper Look -
              </p>
              <div className="text-4xl font-light text-center mb-8">
                Market Dynamics and Key Trends
              </div>
            </div>
            <div className="appContainer px-4 grid grid-rows-1 md:grid-cols-4 gap-8">
              <div className="col-span-4">
                <BlogGrid blog={filteredBlogs || []} />
                <div className="mt-8 flex justify-center">
                  <Link
                    href="/insights"
                    className="inline-block px-4 py-3 bg-themeOrangeColor text-white text-md font-medium rounded-tr-xl rounded-bl-xl hover:bg-themeBlueColor transition">
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
              background: #014478 !important;
              opacity: 1;
            }

            .swiper-pagination-bullet-active {
              background: #FB7540 !important;
            }
          `}</style>

          {banner && (
            <section
              className="w-full bg-cover bg-center relative py-16 md:py-24"
              style={{
                backgroundImage: banner?.image
                  ? `url(${banner.image})`
                  : undefined,
              }}>
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative z-10 flex flex-col lg:flex-row lg:!flex-row justify-between gap-8 appContainer mx-auto items-center">
                {/* Left Banner Section */}
                <div className="w-full lg:w-2/3 min-w-0">
                  {banner ? (
                    <div>
                      <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold font-playfair text-white mb-6">
                        {banner.bannerHeading}
                      </h1>

                      <div className="mt-2 mb-6 md:flex items-center">
                        <div className="bg-white rounded flex p-1 getInsights relative">
                          <input
                            type="text"
                            placeholder="Search for market intelligence on fintech"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full md:min-w-lg px-4 py-3 text-themeBlueColor placeholder-themeBlueColor/60 focus:outline-none"
                          />
                          <button
                            onClick={handleSearch}
                            className="px-6 py-3 rounded-xs bg-themeOrangeColor border-0 hover:bg-themeBlueColor focus:outline-none transition duration-300 cursor-pointer">
                            <span className="text-white">Search</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-6 mt-4">
                        {banner.tags.map((tag, index) => (
                          <span
                            key={index}
                            onClick={() => handleTagClick(tag)}
                            className="bg-themeOrangeColor text-white text-sm font-medium px-3 py-1 rounded-full cursor-pointer hover:bg-themeBlueColor duration-300 uppercase">
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
                <div className="w-full lg:w-1/3 min-w-0 md:max-w-md bg-white rounded p-4 sm:p-6">
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
                        <div className="">
                          <p className="text-xs text-themeOrangeColor uppercase mb-1">
                            {slide.typeText}
                          </p>
                          <h3 className="text-xl font-semibold text-themeBlueColor">
                            {slide.title}
                          </h3>
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
                              className="text-sm text-white bg-themeBlueColor hover:bg-themeOrangeColor uppercase transition duration-500 px-3 py-1 rounded">
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
                      background-color: #014478;
                    }
                  `}</style>
                </div>
              </div>
            </section>
          )}

          {stats && (
          <section className="w-full">
            <div className="relative">
              {/* First Row - Stats */}
              <div className="grid grid-rows-1 md:grid-cols-4 text-center items-start">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-themeOrangeColor px-8 py-12 h-full flex flex-col justify-center relative"
                  >
                    {/* Manual divider */}
                    {index < stats.length - 1 && (
                      <div className="hidden md:!block absolute right-0 top-12 h-[70%] w-px bg-lightColor z-10" />
                    )}

                    <div>
                      <h3 className="text-xl font-bold text-white">{stat.title}</h3>
                      <p className="text-md text-white mt-2 inline-block bg-themeBlueColor px-5 py-3 rounded-tr-xl rounded-bl-xl">{stat.statText}</p>
                        <p className="text-sm leading-6 text-white px-6">
                          {stat.description}
                        </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Second Row - Descriptions */}
            </div>
          </section>
          )}

          {strengths.length > 0 && (
            <section className="w-full py-16 md:py-24 bg-slate-50">
              <div className="appContainer">
                {strengths.map((item, idx) => (
                  <div key={idx}>
                    {/* OUR STRENGTH Header */}
                    <p className="text-themeOrangeColor text-md font-thin text-center mb-1">
                      - OUR STRENGTH -
                    </p>
                    <div className="text-4xl font-light text-center">
                        {item.title}
                    </div>

                    {/* Title aligned with section cards */}
                    <div className="grid grid-rows-1 md:grid-cols-3 items-start">

                      {item.sections.map((section, index) => (
                        <div
                          key={index}
                          className="p-8">
                          <img
                            src={section.image}
                            alt={section.imageTitle}
                            width={100}
                            height={100}
                            className="mx-auto mb-4 object-contain"
                          />
                          <h3 className="text-xl font-semibold text-black mb-2 text-center">
                            {section.imageTitle}
                          </h3>
                          <p className="text-md text-slate-800 leading-7 font-light text-center">
                            {section.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {partnerLogos && (
          <section className="w-full bg-slate-50">
            <div className="w-full px-4 sm:px-0">
              <div className="grid [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))] gap-1 place-items-center">
                {partnerLogos.map((logo, i) => (
                  <div key={i} className="flex w-full items-center justify-center">
                    <img
                      src={logo.imageUrl}
                      alt={logo.altText || `Logo ${i + 1}`}
                      className="max-h-full w-auto object-contain grayscale hover:grayscale-0 transition duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>

          </section>
          )}

          {productsData.length > 0 && (
            <section className="w-full py-16 md:py-24">
              <div className="appContainer">
                <div className="text-4xl font-light text-center mb-8">
                  {productsData[0].mainTitle}
                </div>

                <div className="grid grid-rows-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {productsData.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-6 text-center border border-borderColor hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <img
                          src={item.imageIconurl}
                          alt={item.productName}
                          className="mx-auto h-9 mb-4 object-contain"
                        />
                        <h3 className="text-lg font-semibold text-black mb-6">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-slate-700">
                          {item.description}
                        </p>
                      </div>

                      <a
                        href={
                          item.url?.startsWith("/") ? item.url : `/${item.url}`
                        }
                        className="mt-4 inline-block px-6 py-2 font-light text-white bg-themeBlueColor rounded-xs text-center mx-auto transition duration-300 hover:bg-themeOrangeColor">
                        View
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {technologyPlatformData.length > 0 && (
            <section className="w-full py-16 md:py-24 bg-slate-50">
              <div className="appContainer">
                <p className="text-themeOrangeColor text-md font-thin text-center mb-1">
                  - TECHNOLOGY PLATFORM -
                </p>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  {technologyPlatformData.map((platform, idx) => (
                    <div
                      key={idx}
                      className="bg-slte-50">
                      <div className="text-4xl font-light text-center mb-8">
                        {platform.title}
                      </div>
                      <img
                        src={platform.image}
                        alt={platform.title}
                        className="mx-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {platformData?.length > 0 && (
            <section>
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
                        className="relative w-full p-6 text-center transition duration-300 overflow-hidden group"
                      >
                        {/* Background Image */}
                        <img
                          src={images[index]}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover z-0"
                        />

                        {/* Blue overlay */}
                        <div className="absolute inset-0 border-12 border-white opacity-85 z-[0] group-hover:border-themeOrangeColor transition duration-500"></div>
                        <div className="absolute inset-3 bg-themeBlueColor opacity-85 z-[1]"></div>

                        {/* Existing content */}
                        <div className="relative z-[2] py-16">
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {item.title}
                          </h3>
                          <p className="text-md text-white mb-2 leading-6">
                            {item.description}
                          </p>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block font-medium uppercase px-2 py-1 rounded text-themeOrangeColor hover:text-white transition-colors duration-300"
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

          {featuredResearch?.length > 0 && (
            <section className="w-full py-16 md:py-24 bg-slate-50">
              <div className="appContainer">
                <div className="grid grid-rows-1 md:grid-cols-3 items-stretch gap-y-12 md:gap-y-0">
                  {/* Featured Research */}
                  <div className="flex-col items-center justify-items-center">
                    <div className="flex justify-between items-center mb-6 w-full">
                      <div className="text-xl font-semibold text-slate-800">Featured Research</div>
                      <div>
                        <a href="/report-store" className="text-themeOrangeColor hover:text-themeBlueColor text-sm font-semibold transition duration-500 flex gap-2 items-center"><span>View All</span> <FaArrowRightLong /></a>
                      </div>
                    </div>

                    {featuredResearch.slice(0, 5).map((item, idx) => (
                      <div
                        key={idx}
                        className="relative flex items-center gap-4 bg-white p-2 mb-3 rounded hover:shadow-sm transition duration-500">
                        <img
                          src={item.content.imageurl}
                          alt={item.content.title}
                          className="object-cover w-[100px]"
                        />
                        <a
                          href={`/${item.content.url}`}
                          className="font-medium text-slate-800 hover:text-themeOrangeColor transition-colors duration-200 md:text-sm">
                          {item.content.title}
                        </a>
                      </div>
                    ))}
                  </div>

                  {/* Middle Orange Bar */}
                  <div className="flex justify-center items-center relative">
                    <div className="w-100 md:w-60 bg-themeOrangeColor rounded md:h-full relative flex flex-col items-center justify-center space-y-2 py-10">
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
                  <div className="flex-col items-center justify-items-center">
                    <div className="flex justify-between items-center mb-6 w-full">
                      <div className="text-xl font-semibold text-slate-800">Insights</div>
                      <a
                        href="/report-store"
                        className="text-themeOrangeColor hover:text-themeBlueColor text-sm font-semibold transition duration-500 flex gap-2 items-center"><span>View All</span> <FaArrowRightLong /></a>
                    </div>

                    {insights.slice(0, 5).map((item, idx) => (
                      <div
                        key={idx}
                        className="relative flex items-center gap-4 bg-white p-2 mb-3 rounded hover:shadow-sm transition duration-500">
                        <img
                          src={item.content.imageurl}
                          alt={item.content.title}
                          className="object-cover w-[100px]"
                        />
                        <a
                          href={`/${item.content.url}`}
                          className="font-medium text-slate-800 hover:text-themeOrangeColor transition-colors duration-200 md:text-sm">
                          {item.content.title}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="w-full py-16 md:py-24">
            <div className="appContainer mx-auto grid grid-rows-1 md:grid-cols-[30%_70%] items-center gap-4">
              {/* Left Section: Text and Button */}
              <div className="space-y-6">
                <h2 className="text-5xl font-bold text-slate-800">PayNXT360 Insights</h2>
                <p className="text-slate-700 text-lg">
                  Sign up for The PayNXT360 Insights, and get a weekly roundup
                  of market events, innovations and data you can trust and use.
                </p>
                <a href="/login">
                  <button className="px-6 py-3 bg-themeOrangeColor text-[white] font-semibold rounded-tr-xl rounded-bl-xl hover:bg-themeBlueColor transition duration-300 cursor-pointer">
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
