'use client';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function BlogPage() {
    const [banner, setBanner] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sliders, setSliders] = useState([]);

    useEffect(() => {
        const fetchBanner = async () => {
            const res = await fetch('/api/blog-page/blogbanner');
            const data = await res.json();
            setBanner(data);
        };

        const fetchSliders = async () => {
            const res = await fetch('/api/blog-page/blogslider');
            const data = await res.json();
            setSliders(data);
        };


        fetchBanner();
        fetchSliders();
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
                                <h1 className="text-3xl font-bold text-white mb-6">{banner.bannerTitle}</h1>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {/* {banner.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-white text-[#155392] text-sm font-semibold px-3 py-1 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))} */}
                                </div>
                                {banner.bannerDescription && (
                                    <p className="text-md text-white mt-1 mb-8">
                                        {banner.bannerDescription}
                                    </p>
                                )}


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

            <section className="w-full bg-gray-100 h-160 py-12 px-6">
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