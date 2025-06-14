'use client';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function HomePage() {
  const [banner, setBanner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sliders, setSliders] = useState([]);
  const [stats, setStats] = useState([]);
  const [platformData, setPlatformData] = useState(null);
  const [strengths, setStrengths] = useState([]);
  const [technologyPlatformData, setTechnologyPlatformData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [featuredResearch, setFeaturedResearch] = useState([]);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchBanner = async () => {
      const res = await fetch('/api/home-page/topbanner');
      const data = await res.json();
      setBanner(data);
    };

    const fetchSliders = async () => {
      const res = await fetch('/api/home-page/slider');
      const data = await res.json();
      setSliders(data);
    };

    const fetchStats = async () => {
      const res = await fetch('/api/home-page/stats');
      const data = await res.json();
      setStats(data);
    };

    const fetchPlatformData = async () => {
      const res = await fetch('/api/home-page/platsection');
      const data = await res.json();
      setPlatformData(Array.isArray(data) ? data : []); // ensure it's always an array
    };

    const fetchStrengths = async () => {
      try {
        const res = await fetch('/api/home-page/strength');
        const json = await res.json();
        if (json.success) setStrengths(json.data);
      } catch (err) {
        console.error('Error fetching strengths:', err);
      }
    };

    const fetchTechnologyPlatformData = async () => {
      try {
        const res = await fetch('/api/home-page/techplat');
        const data = await res.json();
        setTechnologyPlatformData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching technology platform data:', error);
        setTechnologyPlatformData([]);
      }
    };
    const fetchProducts = async () => {
      const res = await fetch('/api/home-page/prod');
      const data = await res.json();
      setProductsData(Array.isArray(data) ? data : []);
    };
    const fetchResearchInsights = async () => {
      try {
        const res = await fetch('/api/home-page/content');

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setFeaturedResearch(data.featuredResearch || []);
        setInsights(data.insights || []);
      } catch (error) {
        console.error('Error fetching research insights:', error);
      }
    };


    fetchBanner();
    fetchSliders();
    fetchStats();
    fetchPlatformData();
    fetchStrengths();
    fetchTechnologyPlatformData();
    fetchProducts();
    fetchResearchInsights();
  }, []);

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
                <h1 className="text-4xl font-bold text-white mb-6">{banner.bannerHeading}</h1>
                <div className="flex flex-wrap gap-2 mb-6">
                  {banner.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-white text-[#155392] text-sm font-semibold px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

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
              modules={[Pagination]}
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
      <section className="w-full py-5 bg-[#FF6B00]">
        <div className="relative">
          <div className="grid grid-rows-1 md:grid-cols-4 text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-[#FF6B00] px-6 py-7 min-h-[220px] flex flex-col justify-between relative"
              >
                {/* Manual divider */}
                {index < stats.length - 1 && (
                  <div className="md:block absolute right-0 top-1/2 transform -translate-y-1/2 h-[50%] w-px bg-white/90 z-10" />
                )}

                <div>
                  <h3 className="text-lg font-semibold text-white">{stat.title}</h3>
                  <p className="text-1xl text-white mt-2 inline-block bg-[#155392] text-white px-3 py-1 rounded-tr-xl rounded-bl-xl">
                    {stat.statText}
                  </p>
                </div>

                <p className="text-sm text-white mt-4">{stat.description}</p>
              </div>
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
                    className="bg-gray-100 p-8 h-72"
                  >
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
          <div className="grid grid-rows-2 md:grid-cols-4 lg:grid-cols-8 gap-y-2">
            {[...Array(16)].map((_, index) => (
              <div key={index} className="flex justify-center items-center">
                <img
                  src={`/images/i${index + 1}.jpg`}
                  alt={`Logo ${index + 1}`}
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
                  className="bg-white p-6 text-center border border-gray-200 hover:shadow-xl transition-all duration-300 h-90 flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={item.imageIconurl}
                      alt={item.productName}
                      className="mx-auto h-9 mb-4 object-contain"
                    />
                    <h3 className="text-lg font-semibold text-black mb-6">{item.productName}</h3>
                    <p className="text-sm text-gray-700">{item.description}</p>
                  </div>

                  <a
                    href={`/products/${item._id}`}
                    className="mt-4 inline-block w-24 py-1 text-white bg-[#155392] rounded text-center mx-auto transition-all duration-300 hover:bg-[white] hover:text-orange-500"
                  >
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
                  className="bg-gray-100 h-180"
                >
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
              {platformData.map((item, index) => (
                <div
                  key={index}
                  className="w-full h-78 border-10 border-gray-200 hover:border-[#FF6B00] bg-[#155392] p-6 text-center transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-white mt-16 mb-2">{item.title}</h3>
                  <p className="text-sm text-white mb-2">{item.description}</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block font-semibold px-2 py-1 rounded text-[#FF6B00] hover:text-[white] transition-colors duration-300"
                  >
                    {item.clickText || 'Learn More'}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="w-full py-10 bg-gray-100 px-3">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-rows-1 md:grid-cols-3 items-stretch">

            {/* Featured Research */}
            <div className="space-y-12">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700 ml-[-40px]">Featured Research</h2>
                <a
                  href="/report-store"
                  className="text-[#FF6B00] hover:text-[#155392] text-sm font-semibold transition-colors duration-200"
                >
                  View All →
                </a>
              </div>

              {featuredResearch.slice(0, 5).map((item, idx) => (
                <div key={idx} className="relative flex items-center h-20 w-120 pl-14 pr-4 py-4 bg-white">
                  <img
                    src={item.content.imageurl}
                    alt={item.content.title}
                    className="absolute left-0 h-20 w-20 bg-gray-100 object-cover -translate-x-1/2"
                  />
                  <a
                    href={"/report-store"}
                    className="text-md font-bold text-gray-800 hover:text-[#FF6B00] transition-colors duration-200"
                    target="_blank" rel="noopener noreferrer"
                  >
                    {item.content.title}
                  </a>

                </div>
              ))}
            </div>

            {/* Middle Orange Bar */}
            <div className="flex justify-center items-center relative">
              <div className="w-60 bg-[#FF6B00] h-full relative flex flex-col items-center justify-center space-y-1 py-10">
                <span className="text-white text-2xl font-bold rotate-0">Insight.</span>
                <span className="text-white text-2xl font-bold rotate-0">Innovation.</span>
                <span className="text-white text-2xl font-bold rotate-0">Impact.</span>
              </div>
            </div>


            {/* Insights */}
            <div className="space-y-12">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700 ml-[-40px]">Insights</h2>
                <a
                  href="/report-store"
                  className="text-[#FF6B00] hover:text-[#155392] text-sm font-semibold transition-colors duration-200"
                >
                  View All →
                </a>
              </div>

              {insights.slice(0, 5).map((item, idx) => (
                <div key={idx} className="relative flex items-center h-20 w-120 pl-14 pr-4 py-4 bg-white">
                  <img
                    src={item.content.imageurl}
                    alt={item.content.title}
                    className="absolute left-0 h-20 w-20 bg-gray-100 object-cover -translate-x-1/2"
                  />
                  <a
                    href={"/view-points"}
                    className="text-md font-bold text-gray-800 hover:text-[#FF6B00] transition-colors duration-200"
                    target="_blank" rel="noopener noreferrer"
                  >
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
              Sign up for The PayNXT360 Insights, and get a weekly roundup of market events, innovations and data you can trust and use.
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

