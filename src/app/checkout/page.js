'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Country, State } from 'country-state-city';
import { useCart } from '@/context/CartContext';
import CheckoutSteps from '@/components/CheckoutSteps';

export default function CheckoutPage() {
    const { cartItems } = useCart();
    const router = useRouter();
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponApplied, setCouponApplied] = useState(false);

    const [form, setForm] = useState({
        company: '',
        firstName: '',
        lastName: '',
        email: '',
        address1: '',
        address2: '',
        city: '',
        zipcode: '',
        country: '',
        state: '',
    });

    useEffect(() => {
        const savedForm = localStorage.getItem('checkoutForm');
        if (savedForm) setForm(JSON.parse(savedForm));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('checkoutForm', JSON.stringify(form));
        localStorage.setItem('checkoutCart', JSON.stringify(cartItems));
        const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
        const discountAmount = discount ? (totalPrice * discount) / 100 : 0;
        const finalPrice = totalPrice - discountAmount;
        localStorage.setItem('checkoutTotal', totalPrice);
        router.push('/confirmation');
    };

    const countries = Country.getAllCountries();
    const states = form.country ? State.getStatesOfCountry(form.country) : [];
    const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
    const discountAmount = discount ? (totalPrice * discount) / 100 : 0;
    const finalPrice = totalPrice - discountAmount;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <CheckoutSteps currentStep={2} />
            {/* ✅ Correctly placed outside the grid */}

            <div className="grid grid-rows-1 md:grid-cols-3 gap-8 mt-6">
                {/* Left: Checkout form */}
                <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6 bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold border-b pb-2">Billing Information</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-gray-700 font-medium">Company Name</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF6B00]"
                                value={form.company}
                                onChange={(e) => setForm({ ...form, company: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-gray-700 font-medium">First Name *</label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF6B00]"
                                value={form.firstName}
                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-gray-700 font-medium">Last Name *</label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF6B00]"
                                value={form.lastName}
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-gray-700 font-medium">Email *</label>
                            <input
                                type="email"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF6B00]"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold border-b pb-2 mt-4">Address</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 text-gray-700 font-medium">Address Line 1 *</label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF6B00]"
                                value={form.address1}
                                onChange={(e) => setForm({ ...form, address1: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-gray-700 font-medium">Address Line 2</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF6B00]"
                                value={form.address2}
                                onChange={(e) => setForm({ ...form, address2: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block mb-1 text-gray-700 font-medium">City *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF6B00]"
                                    value={form.city}
                                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-700 font-medium">Zipcode *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF6B00]"
                                    value={form.zipcode}
                                    onChange={(e) => setForm({ ...form, zipcode: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-700 font-medium">Country *</label>
                                <select
                                    required
                                    value={form.country}
                                    onChange={(e) => setForm({ ...form, country: e.target.value, state: '' })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF6B00]"
                                >
                                    <option value="">Select Country</option>
                                    {countries.map((c) => (
                                        <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {form.country && (
                            <div>
                                <label className="block mb-1 text-gray-700 font-medium">State *</label>
                                <select
                                    required
                                    value={form.state}
                                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF6B00]"
                                >
                                    <option value="">Select State</option>
                                    {states.map((s) => (
                                        <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#FF6B00] hover:bg-[#d95c00] text-white font-semibold py-3 rounded-lg transition-colors mt-4"
                    >
                        Proceed to Confirmation
                    </button>
                </form>

                {/* Right: Order summary */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold border-b pb-2 mb-4">Order Summary</h2>
                    <div className="space-y-3">
                        {cartItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                                <span className="text-gray-700">{item.title}</span>
                                <span className="font-semibold">${parseFloat(item.price || 0).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Coupon section */}
                    <div className="mt-4">
                        <label className="block mb-1 text-gray-700 font-medium">Have a coupon?</label>
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Enter code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:ring-2 focus:ring-[#FF6B00]"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (couponCode.toLowerCase() === 'save10') {
                                        setDiscount(10);
                                        setCouponApplied(true);
                                        localStorage.setItem('checkoutCoupon', JSON.stringify({
                                            code: couponCode,
                                            amount: 10,
                                            type: 'percent'
                                        }));
                                    } else {
                                        setDiscount(0);
                                        setCouponApplied(false);
                                        localStorage.removeItem('checkoutCoupon');
                                        alert('Invalid coupon code');
                                    }
                                }}
                                className="bg-[#FF6B00] hover:bg-[#d95c00] text-white px-3 py-2 rounded-r-lg font-semibold"
                            >
                                Apply
                            </button>
                        </div>
                        {couponApplied && (
                            <p className="text-green-600 mt-1 text-sm">
                                Coupon applied! You saved {discount}%
                            </p>
                        )}
                    </div>

                    <hr className="my-4" />

                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    {couponApplied && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount ({discount}%):</span>
                            <span>- ${discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold">
                        <span>Final Price:</span>
                        <span>${finalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
