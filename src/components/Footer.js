'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from "../styles/Styling.css";
import { useEffect, useState } from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  const [categories, setCategories] = useState([]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/report-store/repcat");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      {/* Main footer section */}
      <footer id="footer" className="blueBg pt-25 pb-10">
        <div className="container">
          <button className="backToTop" onClick={scrollToTop} aria-label="Back to top">
            <span>Top</span>
          </button>
          <div className="grid grid-rows-1 lg:grid-cols-4 gap-6 items-start pt-10">
            <div className="flex justify-start items-center">
              <div className="flex flex-col items-center lg:items-start h-full justify-center">
                <Link href="/">
                  <Image
                    src="/Images/PayNxt_Logo.svg"
                    alt="PayNXT360"
                    width={150}
                    height={50}
                    className="py-10"
                  />
                </Link>
                <div className="socialLinks">
                  {/* Social media links can be uncommented and added here */}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div>
                <div className="text-[#FF6B00] text-lg font-bold mb-4">Research Databases</div>
                <ul className="list-none p-0">
                  {categories.map((cat, index) => (
                    <li key={index} className="mb-2">
                      <Link href={`/report-store?category=${encodeURIComponent(cat.name)}`} className="text-white text-sm hover:text-[#FF6B00]">
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-center">
              <div>
                <div className="text-[#FF6B00] text-lg font-bold mb-4">Solution</div>
                <ul className="list-none p-0">
                  <li className="mb-2"><Link href="/contact-us" className="text-white text-sm hover:text-[#FF6B00]">Premium Subscription</Link></li>
                  <li className="mb-2"><Link href="/report-store" className="text-white text-sm hover:text-[#FF6B00]">Report Store</Link></li>
                  <li className="mb-2"><Link href="/consulting" className="text-white text-sm hover:text-[#FF6B00]">Consulting</Link></li>
                  <li className="mb-2"><Link href="/insights" className="text-white text-sm hover:text-[#FF6B00]">View Points</Link></li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center">
              <div>
                <div className="text-[#FF6B00] text-lg font-bold mb-4">Quick Links</div>
                <ul className="list-none p-0">
                  <li className="mb-2"><Link href="/contact-us" className="text-white text-sm hover:text-[#FF6B00]">Our Offices</Link></li>
                  <li className="mb-2"><Link href="/contact-us" className="text-white text-sm hover:text-[#FF6B00]">Sales</Link></li>
                  <li className="mb-2"><Link href="/contact-us" className="text-white text-sm hover:text-[#FF6B00]">Media</Link></li>
                  <li className="mb-2"><Link href="/contact-us" className="text-white text-sm hover:text-[#FF6B00]">Career</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom footer section */}
      <div className="py-3 bg-[#001D3D] text-white text-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="text-center lg:text-left">
              <p className="mb-0">
                © <span>{year}</span> PayNXT360, All rights reserved |{' '}
                <Link href="/privacy-policy" className="text-[#FF6B00] hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
