'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import TileRenderer from "@/components/TileRenderer";

export default function B2CPaymentIntelligencePage() {
  const { slug } = useParams();

  const [banner, setBanner] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [sectionThree, setSectionThree] = useState(null);
  const [whyPayNxt, setWhyPayNxt] = useState(null);
  const [sectorDynamics, setSectorDynamics] = useState([]);
  const [stats, setStats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const visibleBlogs = blogs.slice(0, visibleCount);
  const [viewBlogs, setViewBlogs] = useState([]);
  const filteredBlogs = viewBlogs.filter(b => b.is_featured === true).slice(0, 3);

  const handleTagClick = (tag) => {
    // Navigate to /report-store?search=tagName
    router.push(`/report-store?search=${encodeURIComponent(tag)}`);
  };

  useEffect(() => {
    if (!slug) return;

    const fetchBanner = async () => {
      const res = await fetch(`/api/category/${slug}/topbanner`);
      const data = await res.json();
      setBanner(data);
    };

    const fetchSliders = async () => {
      const res = await fetch(`/api/category/${slug}/slider`);
      const data = await res.json();
      if (Array.isArray(data)) setSliders(data);
      else setSliders([]); // fallback to empty array
    };


    const fetchSectionThree = async () => {
      const res = await fetch(`/api/category/${slug}/sectionthree`);
      const data = await res.json();
      setSectionThree(data[0]);
    };

    const fetchBlogs = async () => {
      const res = await fetch("/api/report-store/repcontent");
      const data = await res.json();

      // filter + sort on client side
      const featuredReports = data
        .filter((report) => report.Featured_Report_Status === 1)
        .sort((a, b) => (b.single_user_dollar_price || 0) - (a.single_user_dollar_price || 0));

      setBlogs(featuredReports);
    };

    const fetchBlog = async () => {
      const res = await fetch("/api/View-point/ViewBlogs");
      const data = await res.json();
      setViewBlogs(data);
    };

    const fetchWhyPayNxt = async () => {
      const res = await fetch(`/api/category/${slug}/whypaynxt`);
      const data = await res.json();
      setWhyPayNxt(data);
    };

    const fetchSectorDynamics = async () => {
      const res = await fetch(`/api/category/${slug}/sectordynamics`);
      const data = await res.json();
      setSectorDynamics(data);
    };

    const fetchStats = async () => {
      const res = await fetch(`/api/category/${slug}/keystatistics`);
      const data = await res.json();
      setStats(data);
    };

    fetchBanner();
    fetchSliders();
    fetchSectionThree();
    fetchBlogs();
    fetchWhyPayNxt();
    fetchSectorDynamics();
    fetchStats();
    fetchBlog();

  }, [slug]);

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
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-rows-1 md:grid-cols-3 gap-6">
          {(blog || []).map((blo, i) => {
            const blogUrl = `https://pay-nxt360.vercel.app/blog-page/${blo.slug}`;
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
                      {/* <p className="text-sm text-gray-500">
                        {Array.isArray(blo.subcategory)
                          ? blo.subcategory.join(", ")
                          : blo.subcategory}
                      </p> */}
                      <div className="border-b border-gray-400 mb-4"></div>
                      <h3 className="text-md font-bold">{blo.title}</h3>
                      <p className="text-sm text-gray-700">
                        {blo.summary?.length > 100
                          ? `${blo.summary.slice(0, 100)}...`
                          : blo.summary}
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

  if (!whyPayNxt) return null;

  const sections = [
    whyPayNxt.subSection1,
    whyPayNxt.subSection2,
    whyPayNxt.subSection3,
    whyPayNxt.subSection4,
  ];

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
                <div className="flex flex-wrap gap-2 mb-6 mt-4">
                  {(banner.tags || []).map((tag, index) => (
                    <span
                      key={index}
                      onClick={() => handleTagClick(tag)}
                      className="bg-[#FF6B00] text-white text-sm font-semibold px-3 py-1 rounded-full cursor-pointer hover:opacity-90 duration-300"
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
              modules={[Pagination]}
              pagination={{
                el: '.custom-pagination',
                clickable: true,
              }}
              spaceBetween={16}
              slidesPerView={1}
            >
              {(sliders || []).map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="mb-4 border-b pb-4">
                    <p className="text-xs text-gray-500 uppercase mb-1">{slide.typeText}</p>
                    <h3 className="text-lg font-bold text-[#155392]">{slide.title}</h3>
                    <p className="text-sm text-gray-700 mt-1 mb-2">
                      {slide.shortDescription
                        ? (slide.shortDescription.length > 100
                          ? `${slide.shortDescription.slice(0, 100)}...`
                          : slide.shortDescription)
                        : ''}
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

      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-rows-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, index) => (
              <div
                key={index}
                className="border-t-12 border-[#155392] bg-gray-100 p-6 text-[#155392]"
              >
                <h3 className="text-3xl text-[#155392] text-center font-extrabold mb-2">{item.title}</h3>
                <p className="text-md text-center">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="">
        {sectionThree && (
          <div className="grid grid-rows-1 md:grid-cols-2 bg-gray-100 p-20 items-center">
            {/* Left Column: Title and Description */}
            <div>
              <h2 className="text-3xl text-black mb-6">{sectionThree.title}</h2>
              <div
                className="text-gray-500 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sectionThree.description }}
              />
            </div>

            {/* Right Column: Image */}
            <div className="flex justify-center">
              <img
                src={sectionThree.image}
                alt={sectionThree.title}
                className="max-w-full h-auto"
              />
            </div>
          </div>
        )}
      </div>

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
                VIEW MORE
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-15 px-4 sm:px-8 lg:px-16">
        <p className="text-[#FF6B00] text-sm text-center tracking-wide mb-2">
          - BENEFITS -
        </p>
        <h2 className="text-3xl text-center mb-10">{whyPayNxt.heading}</h2>

        <div className="grid grid-rows-2 md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <div key={index} className="flex bg-white border border-gray-200 hover:shadow-lg transition-all duration-400 h-70">
              <img
                src={section.image}
                alt={section.title}
                className="w-17 h-17 ml-9 mt-10 my-auto object-cover"
              />
              <div className="p-9 ml-2">
                <h3 className="text-lg font-semibold mb-10">{section.title}</h3>
                <p className="text-gray-500">{section.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-gray-100 h-250 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <ul className="space-y-8">
            {sectorDynamics.map((item, index) => (
              <li
                key={index}
                className="tiptap text-gray-600 mt-2 text-base leading-[2]"
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 mb-6 mt-2">
          <p className="text-sm text-center uppercase text-[#FF6B00] tracking-wide">
            - View Points -
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
                READ MORE
              </Link>
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
              <button className="px-6 py-3 bg-[#FF6B00] text-[white] font-semibold rounded-tr-xl rounded-bl-xl hover:bg-[#155392] transition duration-200">
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
    </main>
  );
}
