'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from "../styles/Styling.css";

const Footer = () => {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Main footer section */}
      <footer id="footer" className="blueBg py-5">
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
                  className="mb-3"
                />
                <div className="socialLinks">
                  {/* Social media links can be uncommented and added here */}
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-3">
              <div className="head">Database</div>
              <ul>
                <li>
                  <Link href="/b2c-payment-intelligence">
                    Payment Intelligence
                  </Link>
                </li>
                <li>
                  <Link href="/remittance">
                    Remittance Intelligence
                  </Link>
                </li>
                <li>
                  <Link href="/lending">
                    Digital Lending Intelligence
                  </Link>
                </li>
                <li>
                  <Link href="/report-store">
                    Payment Technology
                  </Link>
                </li>
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
                <li><Link href="/our-offices">Our Offices</Link></li>
                <li><Link href="/sales">Sales</Link></li>
                <li><Link href="/media">Media</Link></li>
                <li><Link href="/career">Career</Link></li>
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
            <div className="text-center lg:text-right mt-2 lg:mt-0 hidden">
              <p className="mb-0">
                Designed &amp; Developed by{' '}
                <a
                  href="http://www.crossatlanticsoftware.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF6B00] hover:underline"
                >
                  Cross Atlantic
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
