'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import CheckoutSteps from '@/components/CheckoutSteps';

export default function ConfirmationPage() {
  const router = useRouter();
  const { cartItems } = useCart();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    const savedForm = localStorage.getItem('checkoutForm');
    if (savedForm) setForm(JSON.parse(savedForm));
    else router.push('/checkout'); // fallback if user directly opens

    const savedCoupon = localStorage.getItem('checkoutCoupon');
    if (savedCoupon) setCoupon(JSON.parse(savedCoupon));
  }, []);

  if (!form) return <p className="text-center py-12">Loading...</p>;

  const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
  const discountAmount = coupon ? (totalPrice * coupon.amount) / 100 : 0;
  const finalPrice = totalPrice - discountAmount;

  const handleEdit = () => router.push('/checkout');

  const handleContinue = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billingDetails: form,
          items: cartItems,
          totalPrice: finalPrice,
          coupon: coupon?.code || null
        })
      });
      const data = await res.json();
      if (data.success && data.paymentLink) {
        window.location.href = data.paymentLink;
      } else {
        alert('Failed to create order.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <CheckoutSteps currentStep={3} />
      <h1 className="text-3xl font-bold mb-8 text-[#155392]">Confirm Your Details</h1>

      <div className="grid grid-rows-1 md:grid-cols-2 gap-6">
        {/* Billing info on left */}
        <div className="bg-white shadow rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-[#FF6B00]">Billing Information</h2>
          <div className="space-y-2 text-gray-700">
            <div><span className="font-medium">Name:</span> {`${form.firstName} ${form.lastName}`}</div>
            <div><span className="font-medium">Company:</span> {form.company || '-'}</div>
            <div><span className="font-medium">Email:</span> {form.email}</div>
            <div><span className="font-medium">Address 1:</span> {form.address1}</div>
            <div><span className="font-medium">Address 2:</span> {form.address2 || '-'}</div>
            <div><span className="font-medium">City:</span> {form.city}</div>
            <div><span className="font-medium">State:</span> {form.state}</div>
            <div><span className="font-medium">Country:</span> {form.country}</div>
            <div><span className="font-medium">Zipcode:</span> {form.zipcode}</div>
          </div>
        </div>

        {/* Products in cart on right */}
        <div className="bg-white shadow rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-[#FF6B00]">Order Summary</h2>
          <ul className="space-y-2 mb-4">
            {cartItems.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center border-b pb-1">
                <span>{item.title}</span>
                <span className="font-semibold">${parseFloat(item.price).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between mb-1">
            <span>Subtotal:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>


          {/* Coupon summary */}
          {coupon && (
            <div className="flex justify-between text-green-600 font-medium mb-2">
              <span>Coupon Applied ({coupon.code}):</span>
              <span>- ${discountAmount.toFixed(2)}</span>
            </div>
          )}

          {/* Total summary */}
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg text-[#155392]">
            <span>Final Price:</span>
            <span>${finalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-end mt-6">
        <button
          onClick={handleEdit}
          className="px-5 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 transition"
        >
          Return to Details
        </button>
        <button
          onClick={handleContinue}
          disabled={loading}
          className="px-5 py-2 bg-[#FF6B00] text-white rounded-md hover:bg-[#e95a00] transition disabled:opacity-60"
        >
          {loading ? 'Processing...' : 'Continue to Payment'}
        </button>
      </div>
    </div>
  );
}
