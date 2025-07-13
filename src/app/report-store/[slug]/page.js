'use client';

import { Collapse, message, Modal } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function ReportPage({ params }) {
    const { slug } = params;
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [consults, setConsults] = useState([]);
    const [strengths, setStrengths] = useState([]);
    const [advs, setAdvs] = useState([]);
    const [dels, setDels] = useState([]);
    const [repcontent, setRepcontent] = useState(null);
    const { addToCart } = useCart();
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);


    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await fetch(`/api/report-store/${slug}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch report');
                }
                const json = await res.json();
                if (json.success) {
                    setReport(json.data);
                    setRepcontent(json.data); // ✅ also set repcontent to same object
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
                console.error('Error fetching strengths:', err);
            }
        };

        const fetchDels = async () => {
            try {
                const res = await fetch('/api/report-store/repdel');
                const json = await res.json();
                if (json.success) setDels(json.data);
            } catch (err) {
                console.error('Error fetching strengths:', err);
            }
        };

        fetchDels();
        fetchAdvs();
        fetchReport();
        fetchConsults();
        fetchStrengths();
    }, [slug]);

    if (loading) {
        return <div className="max-w-4xl mx-auto py-20">Loading...</div>;
    }

    if (!report) {
        return <div className="max-w-4xl mx-auto py-20">Report not found</div>;
    }

    // Section definitions
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

    // const handlePurchase = () => {
    //     addToCart({
    //         title: report.report_title,
    //         price: report.single_user_dollar_price,
    //         summary: report.report_summary,
    //     });

    //     router.push('/cart');
    // };

    const handlePurchase = () => {
        addToCart({
            title: report.report_title,
            price: report.single_user_dollar_price,
            summary: report.report_summary,
        });

        setIsModalVisible(true);  // show modal
    };



    let deliverables = [];
    if (report && dels[0]) { // use report directly
        if (report.RD_Section1 === 'Yes') {
            deliverables.push({
                section: dels[0]?.sections[0],
                text: report.RD_Text_Section1
            });
        }
        if (report.RD_Section2 === 'Yes') {
            deliverables.push({
                section: dels[0]?.sections[1],
                text: report.RD_Text_Section2
            });
        }
        if (report.RD_Section3 === 'Yes') {
            deliverables.push({
                section: dels[0]?.sections[2],
                text: report.RD_Text_Section3
            });
        }
    }

    return (
        <main className="min-h-screen bg-white">
            {/* Enable smooth scroll */}
            <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

            {/* Banner Section */}
            <section className="w-full bg-[#155392] py-20 px-8">
                <div className="max-w-7xl mx-auto text-left">
                    <h1 className="text-3xl font-bold text-white mb-2">{report.report_title.split(' - ')[0]}</h1>
                    <p className="text-xl font-semibold text-white mb-4">{report.Product_sub_Category}</p>
                    <p className="text-md text-white mb-8">
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
                            className="w-full max-w-md px-4 py-3 rounded-l-sm bg-white text-[#155392] placeholder-[#155392] border border-white focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button
                            onClick={() => console.log('Search clicked:', searchTerm)}
                            className="px-6 py-3 rounded-r-sm bg-[#FF6B00] text-[white] border border-white hover:bg-[#155392] hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </section>

            {/* Main content title (keep your existing) */}
            <section className="max-w-7xl font-semibold mx-auto py-6 px-4">
                <p className="text-md text-black mb-1">{report.report_title}</p>
            </section>

            {/* New 7:3 grid below */}
            <section className="max-w-7xl mx-auto px-4 mb-8">
                {/* Horizontal nav buttons */}
                <div className="flex mb-6">
                    {sections.map((sec, index) => (
                        <a
                            key={sec.key}
                            href={`#${sec.key}`}
                            className={`px-4 py-2 text-white text-sm font-semibold bg-[#155392] 
        hover:bg-[white] hover:text-[#155392] 
        transition-colors duration-300
        ${index === 0 ? 'rounded-l' : ''}
        ${index === sections.length - 1 ? 'rounded-r' : ''}
        border-l border-white`}
                        >
                            {sec.title}
                        </a>
                    ))}
                </div>

                <div className="grid grid-cols-10 gap-4">
                    {/* Left part: collapsible sections */}
                    <div className="col-span-7 flex flex-col gap-4">
                        {sections.map((sec) => (
                            <div key={sec.key} id={sec.key}>
                                <Collapse
                                    defaultActiveKey={[]}
                                    expandIconPosition="end"
                                    expandIcon={({ isActive }) =>
                                        <span className="font-bold text-lg">{isActive ? '⮝' : '⮟'}</span>
                                    }
                                >
                                    <Collapse.Panel header={<span className="font-semibold text-lg">{sec.title}</span>} key={sec.key}>
                                        <div className="p-2 text-gray-700">
                                            {/* Example content: show fields from report */}
                                            {sec.key === 'key-statistics' && (
                                                <section className="py-6 px-2 bg-white">
                                                    <div className="grid grid-rows-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                        {stats.map((item, index) => (
                                                            <div
                                                                key={index}
                                                                className="border-4 border-[#FF6B00] bg-gray-100 p-4 rounded shadow text-[#155392]"
                                                            >
                                                                <h3 className="text-lg text-center font-semibold mb-2">{item.title || '-'}</h3>
                                                                <p className="text-sm text-center">{item.description || '-'}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            )}
                                            {sec.key === 'summary' && <p className="text-gray-800 whitespace-pre-line">{report.report_summary}</p>}
                                            {sec.key === 'scope' && <p className="text-gray-800 whitespace-pre-line">{report.report_scope}</p>}
                                            {sec.key === 'reasons-to-buy' && <p className="text-gray-800 whitespace-pre-line">{report.reasons_to_buy}</p>}
                                            {sec.key === 'table-of-contents' && <div className="text-gray-800 whitespace-pre-line">
                                                <span className="block text-lg font-bold mt-4 mb-2">Table of Contents</span>
                                                {report.Table_of_Contents}

                                                {'\n\n'}
                                                <span className="block text-lg font-bold mt-4 mb-2">List of Figures</span>
                                                {report.List_of_figures}
                                            </div>
                                            }
                                            {sec.key === 'faqs' && <p className="text-gray-800 whitespace-pre-line">{report.FAQs}</p>}
                                            {/* For other sections you can fill as needed */}
                                            {sec.key === 'research-deliverables' && (
                                                <section className="py-6 px-2 bg-white">
                                                    {deliverables.length > 0 ? (
                                                        <div className={`grid gap-6 ${deliverables.length === 1 ? 'md:grid-cols-1' :
                                                            deliverables.length === 2 ? 'md:grid-cols-2' :
                                                                'md:grid-cols-3'
                                                            }`}>
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
                                                                    <p className="text-gray-600 text-sm">
                                                                        {item.text}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500">No research deliverables to show.</p>
                                                    )}
                                                </section>
                                            )}
                                        </div>
                                    </Collapse.Panel>
                                </Collapse>
                            </div>
                        ))}
                    </div>

                    {/* Right part */}

                    <div className="col-span-3">
                        {/* Heading styled like "Filter by category" */}
                        <div className="bg-[#155392] text-white px-4 py-2 font-semibold text-lg mb-4 rounded">
                            Report Details
                        </div>

                        <div className="bg-gray-100 p-6 rounded shadow">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">Single User Price USD:</span>
                                    <span className="font-semibold text-[#155392]">${report.single_user_dollar_price}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">Site Price USD:</span>
                                    <span className="font-semibold text-[#155392]">${report.Small_Team_dollar_price}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">Enterprise Price USD:</span>
                                    <span className="font-semibold text-[#155392]">${report.Enterprise_dollar_price}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">Number Of Pages:</span>
                                    <span className="font-semibold text-[#155392]">{report.report_pages}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col items-center">
                                <button
                                    onClick={handlePurchase}
                                    className="inline-block text-center font-semibold text-[white] bg-[#FF6B00] hover:bg-[#155392] hover:text-[white] px-4 py-2 rounded-tr-xl rounded-bl-xl text-sm transition-colors duration-300"
                                >
                                    PURCHASE REPORT
                                </button>
                                <div className="my-2 text-gray-500 font-medium">-OR-</div>
                                <a
                                    href="/login"
                                    // target="_blank"
                                    // rel="noopener noreferrer"
                                    className="inline-block text-center font-semibold text-[white] bg-[#FF6B00] hover:bg-[#155392] hover:text-[white] px-4 py-2 rounded-tr-xl rounded-bl-xl text-sm transition-colors duration-300"
                                >
                                    ADD TO WISHLIST
                                </a>
                            </div>
                        </div>

                        <div className="mt-8">
                            {/* <h2 className="bg-[#155392] text-white text-lg px-4 py-2 font-bold mb-2">
                            Consult With Us
                        </h2> */}
                            {consults.length === 0 ? (
                                <p className="text-gray-500 text-sm">No consult options available.</p>
                            ) : (
                                consults.map((consult) => (
                                    <div key={consult._id} className="bg-[#155392] border border-gray-200 p-4 mb-4 rounded shadow-sm">
                                        <p className="text-xl text-white text-center mb-3">{consult.description}</p>
                                        <h3 className="text-4xl font-semibold text-center text-white mb-1">{consult.title}</h3>
                                        <div className="flex justify-center mt-4">
                                            <a
                                                href={consult.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block text-center font-semibold text-white bg-[#FF6B00] hover:bg-[white] hover:text-[#FF6B00] px-4 py-2 rounded-tr-xl rounded-bl-xl text-sm transition-colors duration-300"
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

            <section className="w-full py-10 bg-gray-100">
                <div className="max-w-7xl mx-auto space-y-10">
                    {advs.map((item, idx) => (
                        <div key={idx}>
                            {/* OUR STRENGTH Header */}
                            <p className="text-[#FF6B00] text-md text-center tracking-wide mb-1">
                                - ADVANTAGES -
                            </p>

                            <h1 className="md:col-span-10 text-4xl text-black text-center">
                                {item.title}
                            </h1>

                            {/* Title aligned with section cards */}
                            <div className="grid grid-rows-1 md:grid-cols-3 items-start gap-8">

                                {item.sections.map((section, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-8 h-72 border-5 border-[#155392] flex flex-col p-4"
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
                                        <p className="text-sm text-gray-600">
                                            {section.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="w-full py-10 bg-gray-100">
                <div className="max-w-6xl mx-auto space-y-10">
                    {strengths.map((item, idx) => (
                        <div key={idx}>
                            {/* OUR STRENGTH Header */}
                            <p className="text-[#FF6B00] text-md text-center tracking-wide mb-1">
                                - OUR STRENGTH -
                            </p>

                            {/* Title aligned with section cards */}
                            <div className="grid grid-rows-1 md:grid-cols-3 items-start">
                                <h1 className="md:col-span-10 text-4xl text-black text-center">
                                    {item.title}
                                </h1>

                                {item.sections.map((section, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-100 p-8 h-72"
                                    >
                                        <img
                                            src={section.image}
                                            alt={section.imageTitle}
                                            className="mx-auto h-24 mb-4 object-contain"
                                        />
                                        <h3 className="text-lg font-semibold text-black mb-2 text-center">
                                            {section.imageTitle}
                                        </h3>
                                        <p className="text-sm text-gray-600 text-center">
                                            {section.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="w-full bg-gray-100 mb-8">
                <div className="max-w-8xl mx-auto">
                    <div className="grid grid-rows-2 md:grid-cols-4 lg:grid-cols-8 gap-y-2">
                        {[...Array(16)].map((_, index) => (
                            <div key={index} className="flex justify-center items-center">
                                <img
                                    src={`/images/i${index + 1}.jpg`}
                                    alt={`Logo ${index + 1}`}
                                    className="w-45 h-23 object-contain grayscale hover:grayscale-0 transition duration-300 border border-white"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Modal
                title="Added to Cart"
                open={isModalVisible}
                onOk={() => setIsModalVisible(false)}
                onCancel={() => setIsModalVisible(false)}
                centered
                footer={null}  // optional: remove default footer buttons
            >
                <div className="text-center">
                    <p className="text-lg font-semibold mb-4">Report added to cart successfully!</p>
                    <button
                        onClick={() => setIsModalVisible(false)}
                        className="mt-4 inline-block text-center font-semibold text-[white] bg-[#FF6B00] hover:bg-[#155392] px-4 py-2 rounded-tr-xl rounded-bl-xl text-sm transition-colors duration-300"
                    >
                        OK
                    </button>
                </div>
            </Modal>

        </main>
    );
}
