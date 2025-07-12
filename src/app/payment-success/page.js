'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import CheckoutSteps from '@/components/CheckoutSteps';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const { clearCart } = useCart();

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
          clearCart();
        }
      };
      fetchOrder();
    }
  }, [orderId]);

  const handleDownloadInvoice = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/invoice`);
      if (!res.ok) throw new Error('Failed to download invoice');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Could not download invoice. Please try again later.');
    }
  };

  if (!order)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-600 text-lg animate-pulse">Loading order...</p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <CheckoutSteps currentStep={4} />
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <svg
            className="w-10 h-10 text-green-500 mr-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <h1 className="text-2xl font-semibold text-gray-800">Payment Successful</h1>
        </div>
        <p className="text-gray-700 mb-2">
          Thank you, <span className="font-medium">{order.billingDetails.firstName}</span>. Your payment has been confirmed.
        </p>
        <p className="text-gray-700 mb-6">
          <span className="font-medium">Order Total:</span> ${order.totalPrice}
        </p>
        <div className="border-t pt-4 mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500 mb-4 sm:mb-0">
            Order ID: <span className="text-gray-600">{orderId}</span>
          </p>
          <button
            onClick={handleDownloadInvoice}
            className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
