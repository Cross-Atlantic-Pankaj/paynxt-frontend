'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from "../styles/Styling.css";
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '../context/UserContext';
import toast, { Toaster } from 'react-hot-toast';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
  const { user, logout } = useUser();
  const router = useRouter();
  const [isCompact, setIsCompact] = useState(false);
  const [sections, setSections] = useState([]);
  const { cartItems } = useCart();
  const isLoggedIn = !!user;
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsCompact(offset > 100);
    };

    window.addEventListener('scroll', handleScroll);

    // 🟢 Move this part **before** return
    const fetchNavbarData = async () => {
      try {
        const res = await fetch('/api/navbar');
        const json = await res.json();
        if (json.success) {
          setSections(json.data);
        }
      } catch (error) {
        console.error('Failed to fetch navbar data:', error);
      }
    };

    fetchNavbarData();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const handleLogout = () => {
    logout();
    localStorage.removeItem('paynxt_user');
    toast.success('Logged out successfully!');
    setTimeout(() => router.push('/'), 1000);
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
              <a href="/" aria-label="Go to homepage">
                <img
                  src="/Images/PayNxt_Logo.svg"
                  alt="PayNXT360"
                  className="h-13 w-auto"
                />
              </a>
            </div>

            {/* Navigation links with a gap */}
            <div className="flex items-center gap-6">
              <ul className="flex gap-6 text-sm font-medium mb-0">
                <li><Link href="/" className="text-white hover:text-[#FF6B00] whitespace-nowrap">Home</Link></li>
                <li><Link href="/about-us" className="text-white hover:text-[#FF6B00] whitespace-nowrap">About Us</Link></li>
                <li><Link href="/contact-us" className="text-white hover:text-[#FF6B00] whitespace-nowrap">Contact Us</Link></li>
              </ul>

              {/* Cart Icon */}
              <div className="cartBox cursor-pointer flex items-center" onClick={handleCartClick}>
                <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <path d="M4.19986 11.1996C3.42988 11.1996 2.8069 11.8296 2.8069 12.5996C2.8069 13.3695 3.42988 13.9995 4.19986 13.9995C4.96983 13.9995 5.59981 13.3695 5.59981 12.5996C5.59981 11.8296 4.96983 11.1996 4.19986 11.1996ZM0 0V1.39995H1.39995L3.91987 6.71277L2.9749 8.42771C2.8629 8.6237 2.7999 8.8547 2.7999 9.09969C2.7999 9.86966 3.42988 10.4996 4.19986 10.4996H12.5996V9.09969H4.49385C4.39585 9.09969 4.31885 9.02269 4.31885 8.92469L4.33985 8.8407L4.96983 7.69974H10.1847C10.7096 7.69974 11.1716 7.41275 11.4096 6.97876L13.9155 2.43592C13.9733 2.32909 14.0023 2.20911 13.9999 2.0877C13.9974 1.96629 13.9634 1.84759 13.9014 1.74321C13.8393 1.63883 13.7512 1.55233 13.6458 1.49217C13.5403 1.43201 13.421 1.40023 13.2995 1.39995H2.9469L2.28892 0H0ZM11.1996 11.1996C10.4296 11.1996 9.80666 11.8296 9.80666 12.5996C9.80666 13.3695 10.4296 13.9995 11.1996 13.9995C11.9696 13.9995 12.5996 12.5996C12.5996 11.8296 11.9696 11.1996 11.1996 11.1996Z"></path>
                </svg>
                <span className="cartNumber">{cartItems.length}</span>
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
                  <Link
                    href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                    className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                  >
                    Login/Register
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="w-full border-t border-white my-1"></div>
        </div>
      </header>

      {user ? (
        // Logged-in view
        <div className={`paymentsSection ${isCompact ? 'compact' : ''}`}>
          <div className="container">
            <div className="flex justify-center items-center gap-20 py-2">
              <div className="relative group">
                <Link href="/" className="text-white uppercase text-sm hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link" onClick={() => handleLinkClick('/')}>
                  Welcome {user?.user?.Firstname} {user?.user?.Lastname}
                </Link>
              </div>


              <div className="relative group">
                <Link href="/access-reports" className="text-white uppercase text-sm hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link" onClick={() => handleLinkClick('/access-reports')}>
                  Access Reports
                </Link>
              </div>

              <div className="relative group">
                <Link href="/wishlist" className="text-white text-sm uppercase hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link" onClick={() => handleLinkClick('/wishlist')}>
                  Wishlist
                </Link>
              </div>

              <div className="relative group">
                <Link href="/ask-an-analyst" className="text-white text-sm uppercase hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link" onClick={() => handleLinkClick('/ask-an-analyst')}>
                  Ask an Analyst
                </Link>
              </div>

              <div className="relative group">
                <Link href="/report-store" className="text-white text-sm uppercase hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link" onClick={() => handleLinkClick('/report-store')}>
                  Report Store
                </Link>
              </div>
              <div className="relative group">
                <Link href="/insights" className="text-white text-sm uppercase hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link" onClick={() => handleLinkClick('/insights')}>
                  Insights
                </Link>
              </div>
              <div className="relative group">
                <Link href="/saved-articles" className="text-white text-sm uppercase hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link" onClick={() => handleLinkClick('/saved-articles')}>
                  Saved Articles
                </Link>
              </div>

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
      ) : (
        // Logged-out view (original with dropdowns)
        <div className={`paymentsSection ${isCompact ? 'compact' : ''}`}>
          <div className="container">
            <div className="flex justify-center items-center gap-2 py-2 [&>*]:m-0">
              {sections.map(section => (
                <div key={section._id} className="relative group">
                  <Link href={section.sectionUrl || '#'} className="text-white text-sm hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link" onClick={() => handleLinkClick(section.sectionUrl || '#')}>
                    {section.section}
                  </Link>
                  {section.links.length > 0 && (
                    <div className="dropdown absolute left-0 mt-2 w-80 bg-white shadow-lg rounded z-50">
                      {section.links.map(link => (
                        <Link
                          key={link._id}
                          href={link.url}
                          onClick={(e) => {
                            if (pathname === link.url) {
                              e.preventDefault(); // prevent Next.js client nav
                              router.refresh(); // full reload
                            }
                          }}
                          className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-[#FF6B00] hover:text-white whitespace-nowrap group/link"
                        >
                          <div className="underline-container">
                            <span>{link.title}</span>
                            <svg
                              viewBox="0 0 14 7"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 arrow"
                            >
                              <path
                                d="M9.81066 2.19083H0.375C0.167906 2.19083 0 2.35873 0 2.56583V4.31583C0 4.52292 0.167906 4.69083 0.375 4.69083H9.81066V6.13017C9.81066 6.79836 10.6185 7.13298 11.091 6.66051L13.7803 3.97117C14.0732 3.67826 14.0732 3.20339 13.7803 2.91051L11.091 0.22117C10.6185 -0.251299 9.81066 0.0833263 9.81066 0.751514V2.19083Z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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
      )}

    </>
  );
};

export default Navbar;