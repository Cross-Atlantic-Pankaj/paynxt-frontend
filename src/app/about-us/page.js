'use client';
import WhySubscribe from '@/components/whysubscribe';
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
            <div className="bg-darkBorderColor py-16">
                <div className="appContainer">
                    <div className="font-playfair text-6xl font-bold text-themeBlueColor mb-6">{banner.title}</div>
                    <p className="text-lg text-salte-800 mb-6">{banner.description}</p>
                </div>
            </div>

            <section className="py-16 md:py-24 bg-slate-50">
                <div className='appContainer'>
                    <div className='max-w-5xl mx-auto'>
                        <div className="text-4xl font-light text-center mb-4">Value Proposition</div>
                        <p className="text-slate-600 text-center leading-7">Our research solutions help companies and institutions in the prepaid payment ecosystem to understand industry dynamics, gain insights into consumer attitude and behaviour, and strategize to gain market share.</p>
                        <div className="grid grid-rows-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                            {gridItems.map((item, idx) => (
                                <div key={idx} className="group flex items-center text-themeBlueColor gap-3 border border-themeBlueColor p-3 blueSVG hover:bg-themeBlueColor hover:text-white transition duration-500">
                                    <img src={item.img} alt={item.title} className="w-14 h-14" />
                                    <span className="h-10 w-px bg-themeBlueColor group-hover:bg-white" />
                                    <div className="text-lg font-medium">{item.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            
            <section className='appContainer'>
                <div className='py-16 md:py-24 max-w-5xl mx-auto'>
                    <div className="text-4xl font-light text-center mb-4">How we do it?</div>
                    <p className="text-slate-600 text-center leading-7">
                        PayNXT360’s research methodology is based on industry best practices approved by leading research, consulting, and advisory firms. Our robust research methodology ensures that you always receive the most reliable data that can help you make business decisions in the payment industry.
                    </p>
                    
                    <div className="relative mt-12 hidden md:!block">
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 rounded bg-darkBorderColor h-full"></div>
                        {timelineItems.map((item, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center w-full ${idx % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                            >
                                <div className="w-6/12"></div>
                                <div className="relative z-10 flex items-center justify-center w-10 h-10 bg-themeOrangeColor rounded-full text-white font-semibold">
                                    {idx + 1}
                                </div>
                                <div className="w-6/12 p-8">
                                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                    <p className="text-slate-600 leading-6">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="relative mt-12 md:hidden">
                        {timelineItems.map((item, idx) => (
                            <div
                                key={idx}
                                className={`w-full relative ${idx % 2 === 0 ? " " : " "}`}
                            >
                                <div className=''></div>
                                <div className="mx-auto mb-4 flex items-center justify-center w-10 h-10 bg-themeOrangeColor rounded-full text-white font-semibold">
                                    {idx + 1}
                                </div>
                                <div className="w-full text-center">
                                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                    <p className="text-slate-600 leading-6">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <WhySubscribe />
            
        </div>
    );
}