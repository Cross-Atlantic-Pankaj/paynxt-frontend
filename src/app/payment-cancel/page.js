import CheckoutSteps from '@/components/CheckoutSteps';

export default function PaymentCancelPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <CheckoutSteps currentStep={4} />
      <div className="bg-white shadow-md rounded-xl p-8 border border-red-100">
        <div className="flex items-center mb-6">
          <svg
            className="w-10 h-10 text-red-500 mr-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <h1 className="text-3xl font-semibold text-gray-800">Payment Canceled</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Your payment was not completed. You can return to your cart and try again.
        </p>
        <div className="mt-6">
          <a
            href="/cart"
            className="inline-block px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition"
          >
            Return to Cart
          </a>
        </div>
      </div>
    </div>
  );
}
