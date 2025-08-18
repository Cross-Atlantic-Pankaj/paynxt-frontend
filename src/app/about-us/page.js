'use client';
import { useState } from 'react';

export default function AboutUsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const banner = {
        title: "About US",
        description: "PayNXT360 is a strategy research and consulting firm offering business intelligence on prepaid cards, gift cards, mobile wallets, international and domestic remittance, BNPL, and emerging innovative payment trends. PayNXT360's unbiased and accurate analysis combines industry level opportunities, consumer dynamics, and market risks to deliver the most comprehensive intelligence.",
        tags: ["Fintech", "Payments", "Market Insights", "Consumer Behavior", "Industry Trends"]
    };

    const gridItems = [
        { img: "/Images/bank.svg", title: "Banking & capital market" },
        { img: "/Images/non-banking.svg", title: "Non-Banking Institutions" },
        { img: "/Images/professional-services.svg", title: "Professional Services Firms" },
        { img: "/Images/technology.svg", title: "Technology Firms" },
        { img: "/Images/academic.svg", title: "Academic" },
        { img: "/Images/issuer-and-processor.svg", title: "Issuer & Processor" },
    ];

    const timelineItems = [
        { title: "Consumer Research", desc: "Conduct country specific consumer surveys to gain unique insights into retail spend, changing behaviours, understanding changing corporate payment mechanism, and key concerns across prepaid and digital spectrum." },
        { title: "Interviews with Market Leaders", desc: "We gather country specific insights through our network of market leaders who are engaged in developing and implementing payment strategies. Primary research inputs together with publicly available information feeds into our proprietary models to generate a robust dataset." },
        { title: "Domain Expertise", desc: "Our team comprises a team of domain experts who gather data from a range of secondary and primary sources, This includes both internal and external experts with market specific knowledge." },
        { title: "Real Time Tracking", desc: "Comprehensive tracking of 50+ countries across 250+ markets segments on a daily basis enables PayNXT360 offer high quality data and analysis. Our desk research process gathers data from reliable government, company, institutional and industry sources." },
        { title: "In-depth Company Research", desc: "Company analysis is a key element of our research methodology, offering insights into growth strategies adopted to gain market share across key payment segments, Inputs from company research feeds into our core market opportunity estimation and forecasting models." },
        { title: "Robust Quality Check & Validations", desc: "Our research teams collect data through transparent and auditable research methods. Data collected goes through a series of checks and validation through internal and external domain experts, ensuring high quality across all stages of research." },
    ];

    const handleSearch = () => {
        console.log('Search term:', searchTerm);
    };

    const handleTagClick = (tag) => {
        setSearchTerm(tag);
        console.log('Tag clicked:', tag);
    };

    return (
        <div className="w-full">
            <div className="w-full bg-[#155392] py-20 px-6">
                <div className="max-w-7xl mx-auto text-left">
                    <h1 className="text-4xl font-bold text-white mb-6">{banner.title}</h1>
                    <p className="text-lg text-white mb-6">{banner.description}</p>
                    {/* <div className="mt-2 flex items-center">
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
                            className="px-6 py-3 rounded-r-sm bg-[#FF6B00] text-[white] border border-[white] hover:bg-[#155392] hover:text-white focus:outline-none focus:ring-2 focus:ring-white duration-300"
                        >
                            Search
                        </button>
                    </div> */}
                    {/* <div className="flex flex-wrap gap-2 mb-6 mt-4">
                        {banner.tags.map((tag, index) => (
                            <span
                                key={index}
                                onClick={() => handleTagClick(tag)}
                                className="bg-white text-[#FF6B00] text-sm font-semibold px-3 py-1 rounded-full cursor-pointer hover:bg-opacity-80 duration-300"
                            >
                                {tag}
                            </span>
                        ))}
                    </div> */}
                </div>
            </div>

            <div className="px-6 py-12 max-w-5xl mx-auto">
                <section className="mb-20">
                    <h2 className="text-3xl text-center font-bold mb-4">Value Proposition</h2>
                    <p className="text-gray-600 text-center mb-10">
                        Our research solutions help companies and institutions in the prepaid payment ecosystem to understand industry dynamics, gain insights into consumer attitude and behaviour, and strategize to gain market share.
                    </p>
                    <div className="grid grid-rows-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {gridItems.map((item, idx) => (
                            <div key={idx} className="text-center">
                                <img src={item.img} alt={item.title} className="mx-auto mb-4 w-24 h-24" />
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-center mb-8">How we do it?</h2>
                    <p className="text-gray-600 text-center mb-25">
                        PayNXT360’s research methodology is based on industry best practices approved by leading research, consulting, and advisory firms. Our robust research methodology ensures that you always receive the most reliable data that can help you make business decisions in the payment industry.
                    </p>
                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-300 h-full"></div>
                        {timelineItems.map((item, idx) => (
                            <div
                                key={idx}
                                className={`mb-10 flex items-center w-full ${idx % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                            >
                                <div className="w-6/12"></div>
                                <div className="relative z-10 flex items-center justify-center w-10 h-10 bg-[#FF6B00] rounded-full text-white font-bold shadow-lg">
                                    {idx + 1}
                                </div>
                                <div className="w-6/12 p-4 bg-white rounded-lg shadow-md">
                                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                    <p className="text-gray-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="w-full bg-white h-110 py-12 px-6">
                    <div className="max-w-7xl mx-auto grid grid-rows-1 md:grid-cols-[30%_70%] items-center gap-4">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-800">PayNXT360 Insights</h2>
                            <p className="text-gray-600 text-lg">
                                Sign up for The PayNXT360 Insights, and get a weekly roundup
                                of market events, innovations and data you can trust and use.
                            </p>
                            <a href="/login">
                                <button className="px-6 py-3 bg-[#FF6B00] text-[white] font-semibold rounded-tr-xl rounded-bl-xl hover:bg-[#155392] transition duration-300">
                                    SIGN UP NOW
                                </button>
                            </a>
                        </div>
                        <div className="flex justify-center">
                            <img
                                src="/Images/whypay.svg"
                                alt="Newsletter"
                                className="w-full max-w-4xl"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}