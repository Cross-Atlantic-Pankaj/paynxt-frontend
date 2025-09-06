"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter, usePathname } from "next/navigation";

import { useUser } from "../context/UserContext";

import toast, { Toaster } from "react-hot-toast";

import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const { user, logout } = useUser();

  const router = useRouter();

  const [isCompact, setIsCompact] = useState(false);

  const [sections, setSections] = useState([]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(null);

  const { cartItems } = useCart();

  const isLoggedIn = !!user;

  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== pathname.toLowerCase()) {
      router.replace(pathname.toLowerCase());
    }
  }, [pathname, router]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;

      setIsCompact(offset > 100);
    };

    window.addEventListener("scroll", handleScroll);

    const fetchNavbarData = async () => {
      try {
        const res = await fetch("/api/navbar");

        const json = await res.json();

        if (json.success) {
          setSections(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch navbar data:", error);
      }
    };

    fetchNavbarData();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();

    localStorage.removeItem("paynxt_user");

    toast.success("Logged out successfully!");

    setTimeout(() => router.push("/"), 1000);

    setIsMobileMenuOpen(false);
  };

  const renderAvatar = (name) => {
    const firstLetter = name ? name.charAt(0).toUpperCase() : "?";

    return (
      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
        {firstLetter}
      </div>
    );
  };

  const handleCartClick = () => {
    window.location.href = "/cart";
  };

  const handleLinkClick = (url) => {
    setIsMobileMenuOpen(false);

    setOpenDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);

    setOpenDropdown(null);
  };

  const toggleDropdown = (sectionId) => {
    setOpenDropdown(openDropdown === sectionId ? null : sectionId);
  };

  return (
    <>
      <Toaster position="top-right" />

      <header className="darkHeader">
        <div className="container py-2">
          <div className="flex justify-between items-center">
            {/* Logo on the left */}

            <div className="flex-shrink-0">
              <a
                href="/"
                aria-label="Go to homepage">
                <img
                  src="/Images/PayNxt_Logo.svg"
                  alt="PayNXT360"
                  className="h-13 w-auto"
                />
              </a>
            </div>

            {/* Desktop Navigation */}

            <div className="hidden lg:!flex items-center gap-6">
              <ul className="flex gap-6 text-sm font-medium pt-4 mb-0">
                <li>
                  <Link
                    href="/"
                    className="text-white hover:text-[#FF6B00] whitespace-nowrap duration-300">
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    href="/about-us"
                    className="text-white hover:text-[#FF6B00] whitespace-nowrap duration-300">
                    About Us
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact-us"
                    className="text-white hover:text-[#FF6B00] whitespace-nowrap duration-300">
                    Contact Us
                  </Link>
                </li>
              </ul>

              {/* Cart Icon */}

              <div
                className="cartBox cursor-pointer flex items-center"
                onClick={handleCartClick}>
                <svg
                  viewBox="0 0 14 14"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5">
                  <path d="M4.19986 11.1996C3.42988 11.1996 2.8069 11.8296 2.8069 12.5996C2.8069 13.3695 3.42988 13.9995 4.19986 13.9995C4.96983 13.9995 5.59981 13.3695 5.59981 12.5996C5.59981 11.8296 4.96983 11.1996 4.19986 11.1996ZM0 0V1.39995H1.39995L3.91987 6.71277L2.9749 8.42771C2.8629 8.6237 2.7999 8.8547 2.7999 9.09969C2.7999 9.86966 3.42988 10.4996 4.19986 10.4996H12.5996V9.09969H4.49385C4.39585 9.09969 4.31885 9.02269 4.31885 8.92469L4.33985 8.8407L4.96983 7.69974H10.1847C10.7096 7.69974 11.1716 7.41275 11.4096 6.97876L13.9155 2.43592C13.9733 2.32909 14.0023 2.20911 13.9999 2.0877C13.9974 1.96629 13.9634 1.84759 13.9014 1.74321C13.8393 1.63883 13.7512 1.55233 13.6458 1.49217C13.5403 1.43201 13.421 1.40023 13.2995 1.39995H2.9469L2.28892 0H0ZM11.1996 11.1996C10.4296 11.1996 9.80666 11.8296 9.80666 12.5996C9.80666 13.3695 10.4296 13.9995 11.1996 13.9995C11.9696 13.9995 12.5996 12.5996 12.5996 11.8296 11.9696 11.1996 11.1996 11.1996Z"></path>
                </svg>

                <span className="cartNumber">{cartItems.length}</span>
              </div>

              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-2">
                      {renderAvatar(user.user.Firstname)}

                      <span className="text-white font-semibold">
                        {user.user.Firstname}
                      </span>
                    </div>

                    <button
                      className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition hover:cursor-pointer"
                      onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                    className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition">
                    Login/Register
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Menu Button and Cart */}

            <div className="flex items-center gap-4 lg:!hidden">
              {/* Mobile Cart Icon */}

              <div
                className="cartBox cursor-pointer flex items-center"
                onClick={handleCartClick}>
                <svg
                  viewBox="0 0 14 14"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5">
                  <path d="M4.19986 11.1996C3.42988 11.1996 2.8069 11.8296 2.8069 12.5996C2.8069 13.3695 3.42988 13.9995 4.19986 13.9995C4.96983 13.9995 5.59981 13.3695 5.59981 12.5996C5.59981 11.8296 4.96983 11.1996 4.19986 11.1996ZM0 0V1.39995H1.39995L3.91987 6.71277L2.9749 8.42771C2.8629 8.6237 2.7999 8.8547 2.7999 9.09969C2.7999 9.86966 3.42988 10.4996 4.19986 10.4996H12.5996V9.09969H4.49385C4.39585 9.09969 4.31885 9.02269 4.31885 8.92469L4.33985 8.8407L4.96983 7.69974H10.1847C10.7096 7.69974 11.1716 7.41275 11.4096 6.97876L13.9155 2.43592C13.9733 2.32909 14.0023 2.20911 13.9999 2.0877C13.9974 1.96629 13.9634 1.84759 13.9014 1.74321C13.8393 1.63883 13.7512 1.55233 13.6458 1.49217C13.5403 1.43201 13.421 1.40023 13.2995 1.39995H2.9469L2.28892 0H0ZM11.1996 11.1996C10.4296 11.1996 9.80666 11.8296 9.80666 12.5996C9.80666 13.3695 10.4296 13.9995 11.1996 13.9995C11.9696 13.9995 12.5996 12.5996 12.5996 11.8296 11.9696 11.1996 11.1996 11.1996Z"></path>
                </svg>

                <span className="cartNumber">{cartItems.length}</span>
              </div>

              {/* Hamburger Menu Button */}

              <button
                onClick={toggleMobileMenu}
                className="text-white p-2 focus:outline-none"
                aria-label="Toggle mobile menu">
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span
                    className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen
                        ? "rotate-45 translate-y-1"
                        : "-translate-y-0.5"
                      }`}></span>

                  <span
                    className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"
                      }`}></span>

                  <span
                    className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen
                        ? "-rotate-45 -translate-y-1"
                        : "translate-y-0.5"
                      }`}></span>
                </div>
              </button>
            </div>
          </div>

          <div className="w-full border-t border-white my-1"></div>
        </div>

        {/* Mobile Menu Overlay */}

        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={toggleMobileMenu}>
            <div
              className="fixed top-0 right-0 h-full w-80 max-w-full bg-gray-900 shadow-lg overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              <div className="p-4">
                {/* Close Button */}

                <div className="flex justify-end mb-4">
                  <button
                    onClick={toggleMobileMenu}
                    className="text-white p-2">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* User Section */}

                {user ? (
                  <div className="mb-6 pb-4 border-b border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      {renderAvatar(user.user.Firstname)}

                      <span className="text-white font-semibold">
                        {user.user.Firstname}
                      </span>
                    </div>

                    <button
                      className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                      onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="mb-6 pb-4 border-b border-gray-700">
                    <Link
                      href={`/login?callbackUrl=${encodeURIComponent(
                        pathname
                      )}`}
                      className="block w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition text-center"
                      onClick={() => setIsMobileMenuOpen(false)}>
                      Login/Register
                    </Link>
                  </div>
                )}

                {/* Main Navigation */}

                <nav className="space-y-2 mb-6">
                  <Link
                    href="/"
                    className="block text-white hover:text-[#FF6B00] py-2 px-2"
                    onClick={handleLinkClick}>
                    Home
                  </Link>

                  <Link
                    href="/about-us"
                    className="block text-white hover:text-[#FF6B00] py-2 px-2"
                    onClick={handleLinkClick}>
                    About Us
                  </Link>

                  <Link
                    href="/contact-us"
                    className="block text-white hover:text-[#FF6B00] py-2 px-2"
                    onClick={handleLinkClick}>
                    Contact Us
                  </Link>
                </nav>

                {/* Secondary Navigation */}

                {user ? (
                  <nav className="space-y-2">
                    <Link
                      href="/access-reports"
                      className="block text-white hover:text-[#FF6B00] py-2 px-2 uppercase text-sm font-bold"
                      onClick={handleLinkClick}>
                      Access Reports
                    </Link>

                    <Link
                      href="/wishlist"
                      className="block text-white hover:text-[#FF6B00] py-2 px-2 uppercase text-sm font-bold"
                      onClick={handleLinkClick}>
                      Wishlist
                    </Link>

                    <Link
                      href="/ask-an-analyst"
                      className="block text-white hover:text-[#FF6B00] py-2 px-2 uppercase text-sm font-bold"
                      onClick={handleLinkClick}>
                      Ask an Analyst
                    </Link>

                    <Link
                      href="/report-store"
                      className="block text-white hover:text-[#FF6B00] py-2 px-2 uppercase text-sm font-bold"
                      onClick={handleLinkClick}>
                      Report Store
                    </Link>

                    <Link
                      href="/insights"
                      className="block text-white hover:text-[#FF6B00] py-2 px-2 uppercase text-sm font-bold"
                      onClick={handleLinkClick}>
                      Insights
                    </Link>

                    <Link
                      href="/saved-articles"
                      className="block text-white hover:text-[#FF6B00] py-2 px-2 uppercase text-sm font-bold"
                      onClick={handleLinkClick}>
                      Saved Articles
                    </Link>
                  </nav>
                ) : (
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <div key={section._id}>
                        <div className="flex items-center justify-between">
                          <Link
                            href={section.sectionUrl || "#"}
                            className="block text-white hover:text-[#FF6B00] py-2 px-2 text-sm font-bold flex-1"
                            onClick={handleLinkClick}>
                            {section.section}
                          </Link>

                          {section.links.length > 0 && (
                            <button
                              onClick={() => toggleDropdown(section._id)}
                              className="text-white p-2">
                              <svg
                                className={`w-4 h-4 transition-transform ${openDropdown === section._id
                                    ? "rotate-180"
                                    : ""
                                  }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          )}
                        </div>

                        {section.links.length > 0 &&
                          openDropdown === section._id && (
                            <div className="ml-4 space-y-1">
                              {section.links.map((link) => (
                                <Link
                                  key={link._id}
                                  href={link.url}
                                  onClick={(e) => {
                                    if (pathname === link.url) {
                                      e.preventDefault();

                                      router.refresh();
                                    }

                                    handleLinkClick();
                                  }}
                                  className="block text-gray-300 hover:text-[#FF6B00] py-2 px-2 text-sm">
                                  {link.title}
                                </Link>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </nav>
                )}

                {/* Search Icon */}

                <div className="mt-6 pt-4 border-t border-gray-700">
                  <button className="flex items-center gap-2 text-white hover:text-[#FF6B00] py-2 px-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>

                    <span>Search</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Desktop Secondary Navigation */}

      {user ? (
        <div
          className={`paymentsSection ${isCompact ? "compact" : ""
            } hidden lg:!block`}>
          <div className="container">
            <div className="flex justify-center items-center gap-20 py-2">
              <div className="relative group">
                <Link
                  href="/user"
                  className="text-white uppercase text-sm hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link"
                  onClick={() => handleLinkClick("/user")}>
                  My Account
                </Link>
              </div>

              <div className="relative group">
                <Link
                  href="/access-reports"
                  className="text-white uppercase text-sm hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link"
                  onClick={() => handleLinkClick("/access-reports")}>
                  Access Reports
                </Link>
              </div>

              <div className="relative group">
                <Link
                  href="/wishlist"
                  className="text-white text-sm uppercase hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link"
                  onClick={() => handleLinkClick("/wishlist")}>
                  Wishlist
                </Link>
              </div>

              <div className="relative group">
                <Link
                  href="/ask-an-analyst"
                  className="text-white text-sm uppercase hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link"
                  onClick={() => handleLinkClick("/ask-an-analyst")}>
                  Ask an Analyst
                </Link>
              </div>

              <div className="relative group">
                <Link
                  href="/report-store"
                  className="text-white text-sm uppercase hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link"
                  onClick={() => handleLinkClick("/report-store")}>
                  Report Store
                </Link>
              </div>

              <div className="relative group">
                <Link
                  href="/insights"
                  className="text-white text-sm uppercase hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link"
                  onClick={() => handleLinkClick("/insights")}>
                  Insights
                </Link>
              </div>

              <div className="relative group">
                <Link
                  href="/saved-articles"
                  className="text-white text-sm uppercase hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link"
                  onClick={() => handleLinkClick("/saved-articles")}>
                  Saved Articles
                </Link>
              </div>

              <div className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3">
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
        <div
          className={`paymentsSection ${isCompact ? "compact" : ""
            } hidden lg:!block`}>
          <div className="container">
            <div className="flex justify-center items-center gap-2 py-2 [&>*]:m-0">
              {sections.map((section) => (
                <div
                  key={section._id}
                  className="relative group">
                  <Link
                    href={section.sectionUrl || "#"}
                    className="text-white text-sm hover:text-[#FF6B00] whitespace-nowrap font-bold payments-link"
                    onClick={() => handleLinkClick(section.sectionUrl || "#")}>
                    {section.section}
                  </Link>

                  {section.links.length > 0 && (
                    <div className="dropdown absolute left-0 mt-2 w-80 bg-white shadow-lg rounded z-50">
                      {section.links.map((link) => (
                        <Link
                          key={link._id}
                          href={link.url}
                          onClick={(e) => {
                            if (pathname === link.url) {
                              e.preventDefault();

                              router.refresh();
                            }
                          }}
                          className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-[#FF6B00] hover:text-white whitespace-nowrap group/link">
                          <div className="underline-container">
                            <span>{link.title}</span>

                            <svg
                              viewBox="0 0 14 7"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 arrow">
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

              <div className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3">
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
