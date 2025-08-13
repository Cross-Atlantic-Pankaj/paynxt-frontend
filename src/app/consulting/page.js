"use client";
import Image from "next/image";

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      <div className="space-y-16">
        {sections.map((sec, index) => (
          <div
            key={index}
            className={`grid grid-rows-1 md:grid-cols-2 gap-8 items-center ${
              index % 2 !== 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div
              className={`w-full ${
                index % 2 !== 1 ? "order-2 md:order-1" : ""
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
              className={`flex flex-col justify-center space-y-4 ${
                index % 2 !== 0 ? "order-1 md:order-2" : ""
              }`}
            >
              <h2 className="text-2xl font-semibold">{sec.title}</h2>
              <p className="text-gray-600">{sec.description}</p>
              <a
                href={sec.buttonLink}
                className="inline-block bg-[#FF6B00] rounded-tr-xl rounded-bl-xl text-white px-6 py-3 hover:bg-[#155392] transition-all duration-400 w-fit"
              >
                {sec.buttonText}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
