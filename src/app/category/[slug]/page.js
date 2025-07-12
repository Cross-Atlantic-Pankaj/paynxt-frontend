'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useParams } from 'next/navigation';


export default function B2CPaymentIntelligencePage() {
  const { slug } = useParams();

  const [banner, setBanner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sliders, setSliders] = useState([]);
  const [sectionThree, setSectionThree] = useState(null);
  const [whyPayNxt, setWhyPayNxt] = useState(null);
  const [sectorDynamics, setSectorDynamics] = useState([]);
  const [stats, setStats] = useState([]);

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
      console.log('Fetched sliders data:', data);
      if (Array.isArray(data)) setSliders(data);
      else setSliders([]); // fallback to empty array
    };


    const fetchSectionThree = async () => {
      const res = await fetch(`/api/category/${slug}/sectionthree`);
      const data = await res.json();
      setSectionThree(data[0]);
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
    fetchWhyPayNxt();
    fetchSectorDynamics();
    fetchStats();

  }, [slug]);

  const handleSearch = () => {
    console.log('Search Term:', searchTerm);
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
                <div className="flex flex-wrap gap-2 mb-6">
                  {(banner.tags || []).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-white text-[#155392] text-sm font-semibold px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
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
                className="border-4 border-[#FF6B00] bg-gray-100 p-6 rounded shadow text-[#155392]"
              >
                <h3 className="text-lg text-center font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-center">{item.description}</p>
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
              <p className="text-gray-500">{sectionThree.description}</p>
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
      <section className="bg-gray-100 h-200 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <ul className="space-y-8">
            {sectorDynamics.map((item, index) => (
              <li key={index} className="text-gray-600 mt-2 text-base leading-[2]">
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
