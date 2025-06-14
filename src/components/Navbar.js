'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from "../styles/Styling.css";
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import toast, { Toaster } from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useUser();
  const router = useRouter();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setIsCompact(true);
      } else {
        setIsCompact(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('paynxt_user');
    toast.success('Logged out successfully!');
    setTimeout(() => router.push('/login'), 1000);
  };

  const renderAvatar = (name) => {
    const firstLetter = name ? name.charAt(0).toUpperCase() : '?';
    return (
      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
        {firstLetter}
      </div>
    );
  };

  const handleCartClick = () => {
    window.location.href = '/cart';
  };

  return (
    <>
      <Toaster position="top-right" />
      <header className="darkHeader">
        <div className="container py-2">
          <div className="flex justify-between items-center">
            {/* Logo on the left */}
            <div className="flex-shrink-0">
              <img
                src="/Images/PayNxt_Logo.svg"
                alt="PayNXT360"
                className="h-13 w-auto"
              />
            </div>

            {/* Navigation links with a gap */}
            <div className="flex items-center gap-6">
              <ul className="flex gap-6 text-sm font-medium mb-0">
                <li><Link href="" className="text-white hover:text-[#FF6B00] whitespace-nowrap">Home</Link></li>
                <li><Link href="/about-us" className="text-white hover:text-[#FF6B00] whitespace-nowrap">About Us</Link></li>
                <li><Link href="/contact-us" className="text-white hover:text-[#FF6B00] whitespace-nowrap">Contact Us</Link></li>
              </ul>

              {/* Cart Icon */}
              <div className="cartBox cursor-pointer flex items-center" onClick={handleCartClick}>
                <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <path d="M4.19986 11.1996C3.42988 11.1996 2.8069 11.8296 2.8069 12.5996C2.8069 13.3695 3.42988 13.9995 4.19986 13.9995C4.96983 13.9995 5.59981 13.3695 5.59981 12.5996C5.59981 11.8296 4.96983 11.1996 4.19986 11.1996ZM0 0V1.39995H1.39995L3.91987 6.71277L2.9749 8.42771C2.8629 8.6237 2.7999 8.8547 2.7999 9.09969C2.7999 9.86966 3.42988 10.4996 4.19986 10.4996H12.5996V9.09969H4.49385C4.39585 9.09969 4.31885 9.02269 4.31885 8.92469L4.33985 8.8407L4.96983 7.69974H10.1847C10.7096 7.69974 11.1716 7.41275 11.4096 6.97876L13.9155 2.43592C13.9733 2.32909 14.0023 2.20911 13.9999 2.0877C13.9974 1.96629 13.9634 1.84759 13.9014 1.74321C13.8393 1.63883 13.7512 1.55233 13.6458 1.49217C13.5403 1.43201 13.421 1.40023 13.2995 1.39995H2.9469L2.28892 0H0ZM11.1996 11.1996C10.4296 11.1996 9.80666 11.8296 9.80666 12.5996C9.80666 13.3695 10.4296 13.9995 11.1996 13.9995C11.9696 13.9995 12.5996 12.5996C12.5996 11.8296 11.9696 11.1996 11.1996 11.1996Z"></path>
                </svg>
                <span className="cartNumber">0</span>
              </div>

              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-2">
                      {renderAvatar(user.user.Firstname)}
                      <span className="text-white font-semibold">{user.user.Firstname}</span>
                    </div>

                    {/* Logout Button */}
                    <button
                      className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition">
                    Login/Register
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="w-full border-t border-white my-1"></div>
        </div>
      </header>

      <div className={`paymentsSection ${isCompact ? 'compact' : ''}`}>
        <div className="container">
          <div className="flex justify-center items-center gap-20 py-2">
            <div className="relative group">
              <Link href="/#" className="text-white text-sm hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link">
                PAYMENTS
              </Link>
              <div className="dropdown absolute left-0 mt-2 w-80 bg-white shadow-lg rounded z-50">
                <Link href="/category/b2c-payment-intelligence" className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-[#FF6B00] hover:text-white whitespace-nowrap group/link">
                  <div className="underline-container">
                    <span>B2C PAYMENT INTELLIGENCE</span>
                    <svg viewBox="0 0 14 7" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 arrow">
                      <path d="M9.81066 2.19083H0.375C0.167906 2.19083 0 2.35873 0 2.56583V4.31583C0 4.52292 0.167906 4.69083 0.375 4.69083H9.81066V6.13017C9.81066 6.79836 10.6185 7.13298 11.091 6.66051L13.7803 3.97117C14.0732 3.67826 14.0732 3.20339 13.7803 2.91051L11.091 0.22117C10.6185 -0.251299 9.81066 0.0833263 9.81066 0.751514V2.19083Z" fill="currentColor" />
                    </svg>
                  </div>
                </Link>
                <Link href="/b2b-payment-intelligence" className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-[#FF6B00] hover:text-white whitespace-nowrap group/link">
                  <div className="underline-container">
                    <span>B2B PAYMENT INTELLIGENCE</span>
                    <svg viewBox="0 0 14 7" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 arrow">
                      <path d="M9.81066 2.19083H0.375C0.167906 2.19083 0 2.35873 0 2.56583V4.31583C0 4.52292 0.167906 4.69083 0.375 4.69083H9.81066V6.13017C9.81066 6.79836 10.6185 7.13298 11.091 6.66051L13.7803 3.97117C14.0732 3.67826 14.0732 3.20339 13.7803 2.91051L11.091 0.22117C10.6185 -0.251299 9.81066 0.0833263 9.81066 0.751514V2.19083Z" fill="currentColor" />
                    </svg>
                  </div>
                </Link>
                <Link href="/mobile-payment-intelligence" className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-[#FF6B00] hover:text-white whitespace-nowrap group/link">
                  <div className="underline-container">
                    <span>MOBILE PAYMENT INTELLIGENCE</span>
                    <svg viewBox="0 0 14 7" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 arrow">
                      <path d="M9.81066 2.19083H0.375C0.167906 2.19083 0 2.35873 0 2.56583V4.31583C0 4.52292 0.167906 4.69083 0.375 4.69083H9.81066V6.13017C9.81066 6.79836 10.6185 7.13298 11.091 6.66051L13.7803 3.97117C14.0732 3.67826 14.0732 3.20339 13.7803 2.91051L11.091 0.22117C10.6185 -0.251299 9.81066 0.0833263 9.81066 0.751514V2.19083Z" fill="currentColor" />
                    </svg>
                  </div>
                </Link>
                <Link href="/prepaid-card-intelligence" className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-[#FF6B00] hover:text-white whitespace-nowrap group/link">
                  <div className="underline-container">
                    <span>PREPAID CARD & DIGITAL WALLET</span>
                    <svg viewBox="0 0 14 7" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 arrow">
                      <path d="M9.81066 2.19083H0.375C0.167906 2.19083 0 2.35873 0 2.56583V4.31583C0 4.52292 0.167906 4.69083 0.375 4.69083H9.81066V6.13017C9.81066 6.79836 10.6185 7.13298 11.091 6.66051L13.7803 3.97117C14.0732 3.67826 14.0732 3.20339 13.7803 2.91051L11.091 0.22117C10.6185 -0.251299 9.81066 0.0833263 9.81066 0.751514V2.19083Z" fill="currentColor" />
                    </svg>
                  </div>
                </Link>
                <Link href="/ecommerce-intelligence" className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-[#FF6B00] hover:text-white whitespace-nowrap group/link">
                  <div className="underline-container">
                    <span>ECOMMERCE INTELLIGENCE</span>
                    <svg viewBox="0 0 14 7" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 arrow">
                      <path d="M9.81066 2.19083H0.375C0.167906 2.19083 0 2.35873 0 2.56583V4.31583C0 4.52292 0.167906 4.69083 0.375 4.69083H9.81066V6.13017C9.81066 6.79836 10.6185 7.13298 11.091 6.66051L13.7803 3.97117C14.0732 3.67826 14.0732 3.20339 13.7803 2.91051L11.091 0.22117C10.6185 -0.251299 9.81066 0.0833263 9.81066 0.751514V2.19083Z" fill="currentColor" />
                    </svg>
                  </div>
                </Link>
                <Link href="/social-commerce-intelligence" className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-[#FF6B00] hover:text-white whitespace-nowrap group/link">
                  <div className="underline-container">
                    <span>SOCIAL COMMERCE INTELLIGENCE</span>
                    <svg viewBox="0 0 14 7" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 arrow">
                      <path d="M9.81066 2.19083H0.375C0.167906 2.19083 0 2.35873 0 2.56583V4.31583C0 4.52292 0.167906 4.69083 0.375 4.69083H9.81066V6.13017C9.81066 6.79836 10.6185 7.13298 11.091 6.66051L13.7803 3.97117C14.0732 3.67826 14.0732 3.20339 13.7803 2.91051L11.091 0.22117C10.6185 -0.251299 9.81066 0.0833263 9.81066 0.751514V2.19083Z" fill="currentColor" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
            <div className="relative group">
              <Link href="/#" className="text-white text-sm hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link">
                GIFT & LOYALTY
              </Link>
              <div className="dropdown absolute left-0 mt-2 w-80 bg-white shadow-lg rounded z-50">
                <Link href="/gift-card-intelligence" className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-[#FF6B00] hover:text-white whitespace-nowrap group/link">
                  <div className="underline-container">
                    <span>GIFT CARD INTELLIGENCE</span>
                    <svg viewBox="0 0 14 7" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 arrow">
                      <path d="M9.81066 2.19083H0.375C0.167906 2.19083 0 2.35873 0 2.56583V4.31583C0 4.52292 0.167906 4.69083 0.375 4.69083H9.81066V6.13017C9.81066 6.79836 10.6185 7.13298 11.091 6.66051L13.7803 3.97117C14.0732 3.67826 14.0732 3.20339 13.7803 2.91051L11.091 0.22117C10.6185 -0.251299 9.81066 0.0833263 9.81066 0.751514V2.19083Z" fill="currentColor" />
                    </svg>
                  </div>
                </Link>
                <Link href="/loyalty-intelligence" className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-[#FF6B00] hover:text-white whitespace-nowrap group/link">
                  <div className="underline-container">
                    <span>LOYALTY INTELLIGENCE</span>
                    <svg viewBox="0 0 14 7" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 arrow">
                      <path d="M9.81066 2.19083H0.375C0.167906 2.19083 0 2.35873 0 2.56583V4.31583C0 4.52292 0.167906 4.69083 0.375 4.69083H9.81066V6.13017C9.81066 6.79836 10.6185 7.13298 11.091 6.66051L13.7803 3.97117C14.0732 3.67826 14.0732 3.20339 13.7803 2.91051L11.091 0.22117C10.6185 -0.251299 9.81066 0.0833263 9.81066 0.751514V2.19083Z" fill="currentColor" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>

            <div className="relative group">
              <Link href="/#" className="text-white text-sm hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link">
                LENDING
              </Link>
              <div className="dropdown absolute left-0 mt-2 w-80 bg-white shadow-lg rounded z-50">
                <Link href="/alternative-lending" className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-[#FF6B00] hover:text-white whitespace-nowrap group/link">
                  <div className="underline-container">
                    <span>ALTERNATIVE LENDING</span>
                    <svg viewBox="0 0 14 7" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 arrow">
                      <path d="M9.81066 2.19083H0.375C0.167906 2.19083 0 2.35873 0 2.56583V4.31583C0 4.52292 0.167906 4.69083 0.375 4.69083H9.81066V6.13017C9.81066 6.79836 10.6185 7.13298 11.091 6.66051L13.7803 3.97117C14.0732 3.67826 14.0732 3.20339 13.7803 2.91051L11.091 0.22117C10.6185 -0.251299 9.81066 0.0833263 9.81066 0.751514V2.19083Z" fill="currentColor" />
                    </svg>
                  </div>
                </Link>
                <Link href="/buy-now-pay-later-intelligence" className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-[#FF6B00] hover:text-white whitespace-nowrap group/link">
                  <div className="underline-container">
                    <span>BUY NOW PAY LATER INTELLIGENCE</span>
                    <svg viewBox="0 0 14 7" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 arrow">
                      <path d="M9.81066 2.19083H0.375C0.167906 2.19083 0 2.35873 0 2.56583V4.31583C0 4.52292 0.167906 4.69083 0.375 4.69083H9.81066V6.13017C9.81066 6.79836 10.6185 7.13298 11.091 6.66051L13.7803 3.97117C14.0732 3.67826 14.0732 3.20339 13.7803 2.91051L11.091 0.22117C10.6185 -0.251299 9.81066 0.0833263 9.81066 0.751514V2.19083Z" fill="currentColor" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>

            <Link href="/finance" className="text-white text-sm hover:text-[#FF6B00] whitespace-nowrap font-bold">
              FINANCE
            </Link>
            <Link href="/remittance" className="text-white text-sm hover:text-[#FF6B00] whitespace-nowrap font-bold">
              REMITTANCE
            </Link>
            <Link href="/consulting" className="text-white text-sm hover:text-[#FF6B00] whitespace-nowrap font-bold">
              CONSULTING
            </Link>
            <Link href="/store" className="text-white text-sm hover:text-[#FF6B00] whitespace-nowrap font-bold">
              STORE
            </Link>
            <Link href="/View-point" className="text-white text-sm hover:text-[#FF6B00] whitespace-nowrap font-bold">
              VIEW POINT
            </Link>
            {/* Search Icon */}
            <div className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;