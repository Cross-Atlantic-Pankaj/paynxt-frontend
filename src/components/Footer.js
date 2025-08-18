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
          <div className="row align-items-center mobileTop">
            <div className="col-xl-3 col-lg-3">
              <div className="flex flex-col items-center h-full justify-center">
                <img
                  src="/Images/PayNxt_Logo.svg"
                  alt="PayNXT360"
                  className="mb-10"
                />
                <div className="socialLinks">
                  {/* Social media links can be uncommented and added here */}
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-3">
              <div className="head">Research Databases</div>
              <ul>
                {categories.map((cat, index) => (
                  <li key={index}>
                    <Link href={`/report-store?category=${encodeURIComponent(cat.name)}`}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-xl-3 col-lg-3">
              <div className="head">Solution</div>
              <ul>
                <li><Link href="/premium-subscription">Premium Subscription</Link></li>
                <li><Link href="/report-store">Report Store</Link></li>
                <li><Link href="/consulting">Consulting</Link></li>
                <li><Link href="/view-points">View Points</Link></li>
              </ul>
            </div>

            <div className="col-xl-3 col-lg-3">
              <div className="head">Quick Links</div>
              <ul>
                <li><Link href="/contact-us">Our Offices</Link></li>
                <li><Link href="/contact-us">Sales</Link></li>
                <li><Link href="/contact-us">Media</Link></li>
                <li><Link href="/contact-us">Career</Link></li>
              </ul>
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
