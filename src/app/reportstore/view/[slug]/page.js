'use client';

import { Collapse, message, Modal } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import toast, { Toaster } from 'react-hot-toast';

export default function ReportPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [consults, setConsults] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [advs, setAdvs] = useState([]);
  const [dels, setDels] = useState([]);
  const [repcontent, setRepcontent] = useState(null);
  const { cartItems, addToCart } = useCart();
  const router = useRouter();
  const { user } = useUser();
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [customModalContent, setCustomModalContent] = useState({
    title: '',
    message: '',
    success: true,
  });
  const [wishlistModalVisible, setWishlistModalVisible] = useState(false);
  const [wishlistModalContent, setWishlistModalContent] = useState({
    title: '',
    message: '',
    success: true,
  });
  const [wishlistItems, setWishlistItems] = useState([]);
  const [partnerLogos, setPartnerLogos] = useState([]);
  const banner = true; // prevent ReferenceError

  useEffect(() => {
    if (!slug) return;

    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/report-store/${slug}`);
        if (!res.ok) throw new Error('Failed to fetch report');
        const json = await res.json();
        if (json.success) {
          setReport(json.data);
          setRepcontent(json.data);
        } else {
          setReport(null);
          setRepcontent(null);
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        setReport(null);
        setRepcontent(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchConsults = async () => {
      const res = await fetch('/api/report-store/repconsult');
      const data = await res.json();
      setConsults(data);
    };

    const fetchStrengths = async () => {
      try {
        const res = await fetch('/api/report-store/repstrength');
        const json = await res.json();
        if (json.success) setStrengths(json.data);
      } catch (err) {
        console.error('Error fetching strengths:', err);
      }
    };

    const fetchAdvs = async () => {
      try {
        const res = await fetch('/api/report-store/repadv');
        const json = await res.json();
        if (json.success) setAdvs(json.data);
      } catch (err) {
        console.error('Error fetching advantages:', err);
      }
    };

    const fetchDels = async () => {
      try {
        const res = await fetch('/api/report-store/repdel');
        const json = await res.json();
        if (json.success) setDels(json.data);
      } catch (err) {
        console.error('Error fetching deliverables:', err);
      }
    };

    const fetchPartnerLogos = async () => {
      try {
        const res = await fetch('/api/home-page/partner-logos');
        const json = await res.json();
        if (json.success) setPartnerLogos(json.data);
      } catch (error) {
        console.error('Error fetching partner logos:', error);
      }
    };

    fetchDels();
    fetchAdvs();
    fetchReport();
    fetchConsults();
    fetchStrengths();
    fetchPartnerLogos();
  }, [slug]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    router.push(`/report-store?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleSampleRequest = async () => {
    if (!user) {
      router.push(`/login?callbackUrl=/reportstore/view/${report.seo_url}`);
      return;
    }

    try {
      const res = await fetch('/api/report-store/send-sample-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: report._id,
          reportTitle: report.report_title,
          userEmail: user.user.email,
          firstName: user.user.Firstname,
        }),
      });

      if (res.ok) toast.success('Sample request sent! Please check your email.');
      else toast.error('Something went wrong, please try again.');
    } catch (error) {
      console.error(error);
      toast.error('Error while sending request.');
    }
  };

  const addToWishlist = async () => {
    if (!user) {
      localStorage.setItem('wishlistSeoUrl', report.seo_url);
      toast.error('Please log in to add to wishlist');
      router.push(`/login?callbackUrl=/reportstore/view/${report.seo_url}`);
      return;
    }

    const alreadyInWishlist = wishlistItems.some(
      (item) => item.seo_url === report.seo_url
    );

    if (alreadyInWishlist) {
      setCustomModalContent({
        title: 'Already in Wishlist',
        message: 'This report is already in your wishlist.',
        success: false,
      });
      setCustomModalVisible(true);
      return;
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ seo_url: report.seo_url }),
      });

      const data = await res.json();

      if (res.ok) {
        setWishlistItems((prev) => [...prev, { seo_url: report.seo_url }]);
        toast.success('Added to wishlist');
      } else {
        toast.error(data.message || 'Failed to add to wishlist');
      }

      setCustomModalContent({
        title: res.ok ? 'Added to Wishlist' : 'Error',
        message: data.message || 'Failed to add to wishlist',
        success: res.ok,
      });
      setCustomModalVisible(true);

      localStorage.removeItem('wishlistSeoUrl');
    } catch (err) {
      toast.error('Failed to add to wishlist');
      setCustomModalContent({
        title: 'Error',
        message: 'Failed to add to wishlist. Please try again later.',
        success: false,
      });
      setCustomModalVisible(true);
    }
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      try {
        const res = await fetch('/api/wishlist', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        setWishlistItems(data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };
    fetchWishlist();
  }, [user]);

  if (loading || !slug) {
    return <div className="max-w-4xl mx-auto py-20">Loading...</div>;
  }

  if (!report) {
    return <div className="max-w-4xl mx-auto py-20">Report not found</div>;
  }

  const sections = [
    { key: 'key-statistics', title: 'Key Statistics' },
    { key: 'summary', title: 'Summary' },
    { key: 'scope', title: 'Scope' },
    { key: 'research-deliverables', title: 'Research Deliverables' },
    { key: 'reasons-to-buy', title: 'Reasons to Buy' },
    { key: 'table-of-contents', title: 'Table of Contents' },
    { key: 'faqs', title: 'FAQs' },
  ];

  const stats = [
    { title: report.key_stats_a1, description: report.key_stats_a2 },
    { title: report.key_stats_b1, description: report.key_stats_b2 },
    { title: report.key_stats_c1, description: report.key_stats_c2 },
    { title: report.key_stats_d1, description: report.key_stats_d2 },
  ];

  const handlePurchase = () => {
    const alreadyInCart = cartItems.some(
      (item) => item.title === report.report_title
    );

    if (alreadyInCart) {
      setCustomModalContent({
        title: 'Already in Cart',
        message: 'This report is already in your cart.',
        success: false,
      });
      setCustomModalVisible(true);
      return;
    }

    addToCart({
      title: report.report_title,
      price: report.single_user_dollar_price,
      summary: report.report_summary,
    });

    setCustomModalContent({
      title: 'Added to Cart',
      message: 'Report added to cart successfully!',
      success: true,
    });
    setCustomModalVisible(true);
  };

  let deliverables = [];
  if (report && dels[0]) {
    if (report.RD_Section1 === 'Yes') {
      deliverables.push({
        section: dels[0]?.sections[0],
        text: report.RD_Text_Section1,
      });
    }
    if (report.RD_Section2 === 'Yes') {
      deliverables.push({
        section: dels[0]?.sections[1],
        text: report.RD_Text_Section2,
      });
    }
    if (report.RD_Section3 === 'Yes') {
      deliverables.push({
        section: dels[0]?.sections[2],
        text: report.RD_Text_Section3,
      });
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Toaster />
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {banner && (
        <section className="w-full bg-darkBorderColor py-20 px-8">
          <div className="appContainer">
            <div className="font-playfair text-4xl font-bold text-themeBlueColor mb-6">
              {report.report_title.split(' - ')[0]}
            </div>
            <p className="text-xl font-semibold text-themeBlueColor mb-4">
              {report.Product_sub_Category}
            </p>
            <p className="text-md text-slate-700 mb-8 leading-6">
              {report.report_summary?.length > 200
                ? `${report.report_summary.slice(0, 200)}...`
                : report.report_summary}
            </p>
            <div className="mt-2 flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full max-w-md px-4 py-3 rounded-l-sm bg-white text-slate-700 placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-3 rounded-r-sm bg-themeOrangeColor hover:bg-themeBlueColor focus:outline-none cursor-pointer duration-300 font-medium">
                <span className='text-white'>Search</span>
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="appContainer font-medium mx-auto py-6">
        <p className="text-lg text-slate-800 mb-1">{report.report_title}</p>
      </section>

      <section className="appContainer mx-auto mb-8">
        <div className="hidden md:!flex mb-6">
          {sections.map((sec, index) => (
            <a
              key={sec.key}
              href={`#${sec.key}`}
              className={`py-3 w-full text-center text-white text-sm font-medium bg-themeBlueColor 
        hover:bg-[white] hover:text-themeBlueColor 
        transition duration-300
        ${index === 0 ? 'rounded-l' : ''}
        ${index === sections.length - 1 ? 'rounded-r' : ''}
        border-l border-white`}
            >
              {sec.title}
            </a>
          ))}
        </div>

        <div className="md:hidden">
          <select
            className="w-full border border-darkBorderColor rounded py-2 px-3"
            onChange={(e) => {
              const id = e.target.value;
              if (!id) return;
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            defaultValue=""
          >
            <option value="" disabled>Select section</option>
            {sections.map((sec) => (
              <option key={sec.key} value={sec.key}>{sec.title}</option>
            ))}
          </select>
          <br />
          <br />
        </div>

        <div className="grid grid-cols-1 md:!grid-cols-10 gap-4">
          <div className="md:!col-span-7 flex flex-col gap-4">
            {sections.map((sec) => (
              <div key={sec.key} id={sec.key}>
                <Collapse

                  defaultActiveKey={[]}
                  expandIconPosition="end"
                  expandIcon={({ isActive }) => (
                    <span className="font-semibold text-lg">
                      {isActive ? '⮝' : '⮟'}
                    </span>
                  )}
                >
                  <Collapse.Panel
                    header={<span className="font-semibold text-lg text-themeBlueColor">{sec.title}</span>}
                    key={sec.key}
                    className="bg-borderColor border-borderColor"
                  >
                    <div className="p-2 text-slate-700 font-sans">
                      {sec.key === 'key-statistics' && (
                        <section className="py-6 px-2 bg-white">
                          <div className="grid grid-rows-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((item, index) => (
                              <div
                                key={index}
                                className="border-4 border-themeOrangeColor bg-gray-100 p-4 rounded shadow text-themeBlueColor"
                              >
                                <h3 className="text-lg text-center font-semibold mb-2">
                                  {item.title || '-'}
                                </h3>
                                <p className="text-sm text-center">
                                  {item.description || '-'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                      {sec.key === 'summary' && (
                        <p className="text-gray-800 whitespace-pre-line">
                          {report.report_summary}
                        </p>
                      )}
                      {sec.key === 'scope' && (
                        <p className="text-gray-800 whitespace-pre-line">
                          {report.report_scope}
                        </p>
                      )}
                      {sec.key === 'reasons-to-buy' && (
                        <p className="text-gray-800 whitespace-pre-line">
                          {report.reasons_to_buy}
                        </p>
                      )}
                      {sec.key === 'table-of-contents' && (
                        <div className="text-gray-800 whitespace-pre-line">
                          <span className="block text-lg font-bold mt-4 mb-2">
                            Table of Contents
                          </span>
                          {report.Table_of_Contents}
                          {'\n\n'}
                          <span className="block text-lg font-bold mt-4 mb-2">
                            List of Figures
                          </span>
                          {report.List_of_figures}
                        </div>
                      )}
                      {sec.key === 'faqs' && (
                        <p className="text-gray-800 whitespace-pre-line">
                          {report.FAQs}
                        </p>
                      )}
                      {sec.key === 'research-deliverables' && (
                        <section className="py-6 px-2 bg-white">
                          {deliverables.length > 0 ? (
                            <div
                              className={`grid gap-6 ${deliverables.length === 1
                                ? 'md:grid-cols-1'
                                : deliverables.length === 2
                                  ? 'md:grid-cols-2'
                                  : 'md:grid-cols-3'
                                }`}
                            >
                              {deliverables.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white p-4 rounded-lg shadow"
                                >
                                  <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold text-black">
                                      {item.section?.imageTitle}
                                    </h3>
                                    <img
                                      src={item.section?.image}
                                      alt={item.section?.imageTitle}
                                      className="w-12 h-12 object-contain"
                                    />
                                  </div>
                                  <div className="mb-4">
                                    <img
                                      src={item.section?.chart}
                                      alt="Chart"
                                      className="w-full h-auto object-contain rounded"
                                    />
                                  </div>
                                  <p className="text-gray-600 text-sm">{item.text}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500">
                              No research deliverables to show.
                            </p>
                          )}
                        </section>
                      )}
                    </div>
                  </Collapse.Panel>
                </Collapse>
              </div>
            ))}
          </div>

          <div className="md:!col-span-3">
            <div className="bg-themeBlueColor text-white px-4 py-2 font-semibold text-lg mb-4 rounded">
              Report Details
            </div>

            <div className="bg-borderColor p-6 rounded shadow">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-700">
                    Single User Price USD:
                  </span>
                  <span className="font-semibold text-themeBlueColor">
                    ${report.single_user_dollar_price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-700">Site Price USD:</span>
                  <span className="font-semibold text-themeBlueColor">
                    ${report.Small_Team_dollar_price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-700">
                    Enterprise Price USD:
                  </span>
                  <span className="font-semibold text-themeBlueColor">
                    ${report.Enterprise_dollar_price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-700">Number Of Pages:</span>
                  <span className="font-semibold text-themeBlueColor">
                    {report.report_pages}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center">
                <button
                  onClick={handlePurchase}
                  className="inline-block text-center font-semibold text-[white] bg-themeOrangeColor hover:bg-themeBlueColor hover:text-[white] px-6 py-3 rounded-tr-xl rounded-bl-xl text-sm transition-colors duration-300 cursor-pointer"
                >
                  PURCHASE REPORT
                </button>
                <div className="my-4 text-gray-500 font-medium">-OR-</div>
                <div className="flex gap-4">
                  <a
                    onClick={addToWishlist}
                    className="text-center font-semibold text-white bg-themeOrangeColor hover:bg-themeBlueColor hover:text-white px-4 py-1 rounded-tr-xl rounded-bl-xl text-sm transition-colors duration-300 cursor-pointer"
                  >
                    ADD TO WISHLIST
                  </a>
                  <a
                    onClick={handleSampleRequest}
                    className="text-center font-semibold text-white bg-themeOrangeColor hover:bg-themeBlueColor hover:text-white px-4 py-1 rounded-tr-xl rounded-bl-xl text-sm transition-colors duration-300 cursor-pointer uppercase"
                  >
                    Request for sample
                  </a>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      const alreadyInCart = cartItems.some(
                        (item) => item.title === report.report_title
                      );

                      if (alreadyInCart) {
                        // Already in cart → go straight to checkout
                        // toast.success('Report already in cart! Redirecting to checkout...');
                        router.push('/checkout');
                        return;
                      }

                      // Not in cart → add it first
                      addToCart({
                        title: report.report_title,
                        price: report.single_user_dollar_price,
                        summary: report.report_summary,
                      });

                      // toast.success('Added to cart! Taking you to checkout...');
                      router.push('/checkout');
                    }}
                    className="flex items-center justify-center gap-2 text-center font-semibold text-themeBlueColor bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-4xl text-sm transition-colors duration-300 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">
                      <path
                        fill="#003087"
                        d="M17.2 53.8l4.1-25.2c.1-.6.6-1.1 1.2-1.1h12.7c8.8 0 15.2-4.1 17.1-12.6 1.8-8.1-3.4-12.6-13.1-12.6H17.8c-.6 0-1.1.5-1.2 1.1L11 53c-.1.6.4 1.2 1 1.2h4.7c.7 0 1.2-.5 1.3-1.1z"
                      />
                      <path
                        fill="#009cde"
                        d="M45.2 27.5c-1.5 6.7-6.3 10.1-13.9 10.1H20.7c-.6 0-1.1.4-1.2 1l-3.6 22.5c-.1.6.4 1.2 1 1.2h8.1c.6 0 1.1-.4 1.2-1l2.1-13c.1-.6.6-1 1.2-1h5.5c9.3 0 16.5-3.8 18.7-14.9 1.9-9-3.4-14.2-13-14.2h-2.9c-5.7 0-10.5 3.3-12.4 9.5-.1.3.1.7.4.7h3.2c.3 0 .6-.2.7-.5 1.2-3.5 4.2-6.1 8.1-6.1h2.2c6.3.1 9.1 3.1 7.8 9.7z"
                      />
                    </svg>
                    <span>PayPal Checkout</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {consults.length === 0 ? (
                <p className="text-gray-500 text-sm">No consult options available.</p>
              ) : (
                consults.map((consult) => (
                  <div
                    key={consult._id}
                    className="bg-themeBlueColor border border-gray-200 p-4 mb-4 rounded shadow-sm"
                  >
                    <p className="text-xl text-white text-center mb-3">
                      {consult.description}
                    </p>
                    <h3 className="text-4xl font-semibold text-center text-white mb-1">
                      {consult.title}
                    </h3>
                    <div className="flex justify-center mt-4">
                      <a
                        href={consult.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-center font-semibold text-white bg-themeOrangeColor hover:bg-[white] hover:text-themeOrangeColor px-6 py-3 rounded-tr-xl rounded-bl-xl text-sm transition-colors duration-300"
                      >
                        CONSULT NOW
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {advs.length > 0 && (
        <section className="w-full py-16 md:py-24 bg-slate-50">
          <div className="appContainer">
            {advs.map((item, idx) => (
              <div key={idx}>
                <p className="text-themeOrangeColor text-md text-center tracking-wide mb-1">
                  - ADVANTAGES -
                </p>
                <div className="text-4xl font-light text-center mb-8">
                  {item.title}
                </div>
                <div className="grid grid-rows-1 md:grid-cols-3 items-start gap-8">
                  {item.sections.map((section, index) => (
                    <div
                      key={index}
                      className="bg-white p-8 h-72 border-5 border-themeBlueColor flex flex-col p-4"
                    >
                      <div className="flex items-start mb-6">
                        <img
                          src={section.image}
                          alt={section.imageTitle}
                          className="w-12 h-12 object-contain mr-2"
                        />
                      </div>
                      <h3 className="text-2xl font-semibold text-black mb-2">
                        {section.imageTitle}
                      </h3>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {strengths.length > 0 && (
        <section className="w-full py-16 md:py-24">
          <div className="appContainer">
            {strengths.map((item, idx) => (
              <div key={idx}>
                <p className="text-themeOrangeColor text-md text-center tracking-wide mb-1">
                  - OUR STRENGTH -
                </p>
                <div className="text-4xl font-light text-center mb-8">
                  {item.title}
                </div>
                <div className="grid grid-rows-1 md:grid-cols-3 items-start">
                  {item.sections.map((section, index) => (
                    <div key={index} className="p-8">
                      <img
                        src={section.image}
                        alt={section.imageTitle}
                        className="mx-auto h-24 mb-4 object-contain"
                      />
                      <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center">
                        {section.imageTitle}
                      </h3>
                      <p className="text-md text-slate-600 text-center leading-6">
                        {section.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {partnerLogos && (
        <section className="w-full bg-slate-50">
          <div className="w-full px-4 sm:px-0">
            <div className="grid [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))] gap-1 place-items-center">
              {partnerLogos.map((logo, i) => (
                <div key={i} className="flex w-full items-center justify-center">
                  <img
                    src={logo.imageUrl}
                    alt={logo.altText || `Logo ${i + 1}`}
                    className="max-h-full w-auto object-contain grayscale hover:grayscale-0 transition duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

        </section>
      )}

      <Modal
        title={customModalContent.title}
        open={customModalVisible}
        onOk={() => setCustomModalVisible(false)}
        onCancel={() => setCustomModalVisible(false)}
        centered
        footer={null}
      >
        <div className="text-center">
          <p className="text-lg font-semibold mb-4">
            {customModalContent.message}
          </p>
          <button
            onClick={() => setCustomModalVisible(false)}
            className={`mt-4 inline-block text-center font-semibold text-[white] px-4 py-2 rounded-tr-xl rounded-bl-xl text-sm transition-colors duration-300 
                ${customModalContent.success ? 'bg-themeOrangeColor' : 'bg-red-600'} 
                hover:bg-themeBlueColor`}
          >
            OK
          </button>
        </div>
      </Modal>
    </main>
  );
}
