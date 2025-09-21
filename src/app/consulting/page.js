"use client";
import Image from "next/image";
import { useState } from 'react';

export default function ConsultingPage() {
  const sections = [
    {
      title: "Strategic Advisory",
      description:
        "PayNXT360's Strategic Advisory Service focuses on offering long term, market specific solutions, which can help in increasing market share. Our strong network of analysts helps in deriving in-depth understanding of opportunities and risks. Market entry strategy | Identify M&A target | Market opportunity assessment | Competitive landscape.",
      buttonText: "FIND OUT MORE",
      buttonLink: "/contact-us",
      image: "/Images/consulting1.svg",
    },
    {
      title: "Market Insight",
      description:
        "PayNXT360's Market Insight Service offers a range of solutions to understand market dynamics. It focuses on consumer insights, product positioning, and tactical marketing initiatives. Consumer behaviour and attitude | Targeting strategy | Market innovation | Brand management",
      buttonText: "FIND OUT MORE",
      buttonLink: "/contact-us",
      image: "/Images/consulting2.svg",
    },
    {
      title: "Investment Research & Analytics",
      description:
        "Leverage PayNXT360’s technology platform to derive greater value from your investment research. Enhance your capabilities needed to drive investment strategies with strong ROI.",
      buttonText: "FIND OUT MORE",
      buttonLink: "/contact-us",
      image: "/Images/consulting3.svg",
    },
    {
      title: "Custom Deep Drive Report",
      description:
        "This service provides a customized report based on published research and analysis content.",
      buttonText: "FIND OUT MORE",
      buttonLink: "/contact-us",
      image: "/Images/consulting4.svg",
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const banner = {
    title: "How we can help?",
    description: "Choose your area of interest to find out how we can help your organisation: PROCUREMENT & SUPPLY CHAIN | COMMERCIAL, SALES & MARKETING | ANALYTICS & DIGITAL | INVESTMENT RESEARCH & ANALYTICS",
    tags: ["Fintech", "Payments", "Market Insights", "Consumer Behavior", "Industry Trends"]
  };

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
      <div className="py-16 md:py-24">
        <div className="appContainer">
          {sections.map((sec, index) => (
            <div
              key={index}
              className={`grid grid-rows-1 md:grid-cols-2 gap-8 items-center ${index % 2 !== 1 ? "md:flex-row-reverse" : "!flow-row"
                }`}
            >
              {/* Image */}
              <div
                className={`w-full ${index % 2 !== 1 ? "order-1 md:order-2" : "order-1 md:order-1"
                  }`}
              >
                <Image
                  src={sec.image}
                  alt={sec.title}
                  width={600}
                  height={400}
                  className="rounded-lg h-80"
                />
              </div>

              {/* Text Section */}
              <div
                className={`flex flex-col justify-center space-y-4 ${index % 2 !== 0 ? "order-2 md:order-1" : " "
                  }`}
              >
                <h2 className="text-2xl font-semibold">{sec.title}</h2>
                <p className="text-slate-700 leading-7">{sec.description}</p>
                <a
                  href={sec.buttonLink}
                  className="inline-block bg-themeOrangeColor rounded-tr-xl rounded-bl-xl text-white px-6 py-3 hover:bg-themeBlueColor transition-all duration-400 w-fit"
                >
                  {sec.buttonText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
