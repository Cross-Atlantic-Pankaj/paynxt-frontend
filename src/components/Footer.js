'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from "../styles/Styling.css";
import { useEffect, useState } from "react";
import { HiPlus, HiMinus } from 'react-icons/hi';

const FooterSection = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const id = `${title.replace(/\s+/g, '-').toLowerCase()}-list`;
  return (
    <div className="flex md:justify-center w-full md:w-auto">
      <div className="w-full">
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium uppercase text-white">{title}</div>
          <button
            type="button"
            className="md:hidden text-white"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen(v => !v)}
          >
            {open ? <HiMinus size={20} className="text-lightColor" /> : <HiPlus size={20} className="text-lightColor" />}
          </button>
        </div>

        <ul id={id} className={`list-none !m-0 p-0 ${open ? 'block' : 'hidden'} md:!block`}>
          {children}
        </ul>
      </div>
    </div>
  );
};

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
      <button className="fixed right-3 bottom-10 bg-themeOrangeColor -rotate-90 cursor-pointer px-3 py-2 uppercase z-40" onClick={scrollToTop} aria-label="Back to top"><span className="text-lightColor">Top</span></button>
      <footer className="bg-themeBlueColor py-12">
        <div className="appContainer">
          <div className="grid grid-rows-1 lg:grid-cols-4 gap-6 mx-3 md:mx-auto">
            <div className="flex items-center">
                <Link href="/">
                  <Image
                    src="/Images/PayNxt_Logo.svg"
                    alt="PayNXT360"
                    width={150}
                    height={50}
                    className=""
                  />
                </Link>
            </div>

            <FooterSection title="Research Databases">
              {categories.map((cat, index) => (
                <li key={index} className="mb-2 last:mb-0">
                  <Link
                    href={`/report-store?category=${encodeURIComponent(cat.name)}`}
                    className="text-lightColor text-sm hover:text-themeOrangeColor"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </FooterSection>

            <FooterSection title="Solution">
              <li className="mb-2">
                <Link href="/contact-us" className="text-lightColor text-sm hover:text-themeOrangeColor">Premium Subscription</Link>
              </li>
              <li className="mb-2">
                <Link href="/report-store" className="text-lightColor text-sm hover:text-themeOrangeColor">Report Store</Link>
              </li>
              <li className="mb-2">
                <Link href="/consulting" className="text-lightColor text-sm hover:text-themeOrangeColor">Consulting</Link>
              </li>
              <li>
                <Link href="/insights" className="text-lightColor text-sm hover:text-themeOrangeColor">View Points</Link>
              </li>
            </FooterSection>

            <FooterSection title="Quick Links">
              <li className="mb-2">
                <Link href="/contact-us" className="text-lightColor text-sm hover:text-themeOrangeColor">Our Offices</Link>
              </li>
              <li className="mb-2">
                <Link href="/contact-us" className="text-lightColor text-sm hover:text-themeOrangeColor">Sales</Link>
              </li>
              <li className="mb-2">
                <Link href="/contact-us" className="text-lightColor text-sm hover:text-themeOrangeColor">Media</Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-lightColor text-sm hover:text-themeOrangeColor">Career</Link>
              </li>
            </FooterSection>
          </div>
        </div>
      </footer>

      {/* Bottom footer section */}
      <div className="py-4 bg-[#014478e6] text-sm">
        <div className="appContainer">
          <div className="text-lightColor mb-0 mx-3 md:mx-auto">
            © <span>{year}</span> PayNXT360, All rights reserved |{' '}
            <Link href="/privacy-policy" className="text-themeOrangeColor hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
