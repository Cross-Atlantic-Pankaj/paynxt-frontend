'use client';

import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import CheckoutSteps from '@/components/CheckoutSteps';

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();
  const { user } = useUser();
  const router = useRouter();

  const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

  const handlePlaceOrder = () => {
    if (user) {
      router.push('/checkout');
    } else {
      router.push('/login?callbackUrl=/checkout');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <CheckoutSteps currentStep={1} />
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item, index) => (
              <div key={index} className="border p-4 rounded shadow">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-md text-gray-600 mb-4">
                  {item.summary?.length > 200 ? `${item.summary.slice(0, 200)}...` : item.summary}
                </p>
                <p className="text-[#155392] font-bold">Price: ${item.price}</p>

                <button
                  onClick={() => removeFromCart(index)}
                  className="inline-block text-center font-semibold text-[white] bg-[#FF6B00] hover:bg-[#155392] px-4 py-2 rounded-tr-xl rounded-bl-xl text-sm transition-colors duration-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Grand total and PLACE ORDER */}
          <div className="mt-8 flex justify-between items-center">
            <h2 className="text-xl font-bold">Grand Total: ${totalPrice.toFixed(2)}</h2>
            <button
              onClick={handlePlaceOrder}
              className="inline-block text-center font-semibold text-[white] bg-[#FF6B00] hover:bg-[#155392] px-4 py-2 rounded-tr-xl rounded-bl-xl text-sm transition-colors duration-300"
            >
              PLACE ORDER
            </button>
          </div>

          {/* Continue Shopping */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/report-store')}
              className="inline-block text-center font-semibold text-[white] bg-[#FF6B00] hover:bg-[#155392] px-4 py-2 rounded-tr-xl rounded-bl-xl text-sm transition-colors duration-300"
            >
              CLOSE AND CONTINUE SHOPPING
            </button>
          </div>
        </>
      )}
    </div>
  );
}
