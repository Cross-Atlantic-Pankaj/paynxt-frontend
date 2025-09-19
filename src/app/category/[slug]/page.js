'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Autoplay } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import TileRenderer from "@/components/TileRenderer";
import { message } from 'antd';
import DOMPurify from 'dompurify';
import WhySubscribe from '@/components/whysubscribe';
import { FaLinkedin } from 'react-icons/fa6';

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
  const [viewBlogs, setViewBlogs] = useState([]);
  // const filteredBlogs = viewBlogs.filter(b => b.is_featured === true).slice(0, 3);
  const [loading, setLoading] = useState(false);
  const [subcategory, setSubcategory] = useState(null);

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

    const fetchBlogs = async (pageNum = 1, append = false) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/category/${slug}?page=${pageNum}`);
        const { success, data, message: errorMessage } = await res.json();

        if (!success) {
          message.error(errorMessage || 'Failed to load featured reports');
          return;
        }

        setBlogs(prev => (append ? [...prev, ...data] : data));
      } catch (err) {
        console.error('Error fetching featured reports:', err);
        message.error('Failed to load featured reports');
      } finally {
        setLoading(false);
      }
    };

    const fetchBlog = async () => {
      setLoading(true);
      try {
        // Fetch subcategory from category API
        const categoryRes = await fetch(`/api/category/${slug}`);
        const { success, subcategory, message: errorMessage } = await categoryRes.json();

        if (!success) {
          message.error(errorMessage || 'Failed to load category data');
          return;
        }

        setSubcategory(subcategory);

        // Fetch all blogs
        const res = await fetch('/api/View-point/ViewBlogs');
        const data = await res.json();
        setViewBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        message.error('Failed to load blogs');
      } finally {
        setLoading(false);
      }
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
    fetchBlogs(1);
    fetchWhyPayNxt();
    fetchSectorDynamics();
    fetchStats();
    fetchBlog();

  }, [slug]);

  const stripHTML = (html) => {
    const div = document.createElement('div');
    div.innerHTML = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] }); // Remove all tags
    return div.textContent || div.innerText || '';
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    router.push(`/report-store?search=${encodeURIComponent(searchTerm)}`);
  };

  const filteredBlogs = viewBlogs
    .filter(b =>
      b.is_featured === true &&
      (subcategory
        ? (Array.isArray(b.subcategory)
          ? b.subcategory.includes(subcategory)
          : b.subcategory === subcategory)
        : true)
    )
    .slice(0, 3);

  // Add before <BlogsGrid>:
  { loading && <p className="text-center text-gray-500">Loading featured reports...</p> }

  const BlogsGrid = ({ blogs }) => (
    <div className="w-full">
      <div className="grid grid-rows-1 md:grid-cols-3 gap-4">
        {blogs.slice(0, 6).map((blog, i) => {
          const reportUrl = `/report-store/${blog.seo_url}`;
          return (
            <div
              key={i}
              className="h-full">
              <Link
                href={reportUrl}
                className="bg-white flex flex-col justify-between h-full overflow-hidden block">
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
      {blogs.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No featured reports found for this page.
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
                key={i}
                className="h-full">
                <Link
                  href={`/blog-page/${blo.slug}`}
                  className="bg-white flex flex-col justify-between h-full overflow-hidden block hover:shadow-sm transition duration-500">
                  <div className="w-full h-40">
                    {blo.tileTemplateId ? (
                      <TileRenderer
                        tileTemplateId={blo.tileTemplateId}
                        fallbackIcon="FileText"
                        className="w-full h-40"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg">
                        <span className="text-slate-500 text-sm">
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
                      <a
                        href={linkedInShareUrl}
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
            No blogs found for this page.
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch(searchTerm);
                      }
                    }}
                    className="w-full max-w-md px-4 py-3 rounded-l-sm bg-white text-slate-700 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    onClick={() => handleSearch(searchTerm)}
                    className="px-6 py-3 rounded-r-sm bg-themeOrangeColor hover:bg-themeBlueColor focus:outline-none cursor-pointer duration-300 font-medium"
                  >
                    <span className='text-white'>Search</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-6 mt-4">
                  {(banner.tags || []).map((tag, index) => (
                    <span
                      key={index}
                      onClick={() => handleTagClick(tag)}
                      className="bg-themeOrangeColor text-white text-sm font-regular uppercase px-3 py-1 rounded-full cursor-pointer hover:opacity-90 duration-300"
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
              {(sliders || []).map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="">
                    <p className="text-xs text-themeOrangeColor uppercase mb-1">{slide.typeText}</p>
                    <h3 className="text-xl font-semibold text-themeBlueColor">{slide.title}</h3>
                    <p className="text-sm text-slate-800 mt-1 mb-2">
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

      <section className="py-16 md:py-24">
        <div className="appContainer mx-auto">
          <div className="grid grid-rows-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, index) => (
              <div
                key={index}
                className="border-t-12 border-themeOrangeColor bg-slate-50 p-6 text-slate-700"
              >
                <h3 className="text-3xl text-themeBlueColor text-center mb-2" style={{ fontWeight: 550 }}>{item.title}</h3>
                <p className="text-md text-center">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {sectionThree && (
      <div className="py-16 md:py-24 bg-slate-50">
          <div className="grid grid-rows-1 md:grid-cols-2 bg-slate-50 appContainer items-center">
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
      </div>
      )}

      <section className="py-16 md:py-24">
        <div className="appContainer">
          <p className="text-themeOrangeColor text-md font-thin text-center mb-1">
            - latest research -
          </p>
          <div className="text-4xl font-light text-center mb-4">
            Featured Reports in {slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Category'}
          </div>
        </div>
        <div className="appContainer grid grid-rows-1 md:grid-cols-4 gap-8">
          <div className="col-span-4">
            <BlogsGrid
              blogs={blogs}
            />
            <div className="mt-6 flex justify-center">
              <Link
                href="/report-store"
                className="px-6 py-3 bg-themeOrangeColor text-[white] font-semibold rounded-tr-xl rounded-bl-xl hover:bg-themeBlueColor transition duration-300 cursor-pointer">
                VIEW MORE
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 md:py-24">
        <div className="appContainer">
          <p className="text-themeOrangeColor uppercase text-md font-thin text-center mb-1">
            - BENEFITS -
          </p>
          <div className="text-4xl font-light text-center mb-8">{whyPayNxt?.heading}</div>

          <div className="grid grid-rows-2 md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <div key={index} className="flex bg-white border border-darkBorderColor hover:border-themeBlueColor transition duration-400 p-6 gap-6 items-center">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-17 h-17 object-cover"
                />
                <div className="">
                  <h3 className="text-lg font-semibold mb-10">{section.title}</h3>
                  <p className="text-slate-600">{section.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="appContainer">
          <ul className="space-y-8">
            {sectorDynamics.map((item, index) => (
              <li
                key={index}
                className="text-slate-600 mt-2 text-base leading-6"
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-slate-50 py-16 md:py-24">
        <div className="appContainer">
          <p className="text-themeOrangeColor uppercase text-md font-thin text-center mb-1">
            - View Points -
          </p>
          <div className="text-4xl font-light text-center mb-8">
            Market Dynamics and Key Trends
          </div>
        </div>
        <div className="appContainer px-4 grid grid-rows-1 md:grid-cols-4 gap-8">
          <div className="col-span-4">
            <BlogGrid blog={filteredBlogs || []} />
            <div className="mt-6 flex justify-center">
              <Link
                href="/insights"
                className="px-6 py-3 bg-themeOrangeColor text-[white] font-semibold rounded-tr-xl rounded-bl-xl hover:bg-themeBlueColor transition duration-300 cursor-pointer">
                READ MORE
              </Link>
            </div>
          </div>
        </div>
      </section>
      <WhySubscribe/>
    </main>
  );
}
