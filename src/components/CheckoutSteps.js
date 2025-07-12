'use client';

const steps = ['Cart', 'Checkout', 'Confirmation', 'Complete'];

export default function CheckoutSteps({ currentStep }) {
  return (
    <div className="flex items-center justify-between mb-8 relative">
      {steps.map((step, idx) => {
        const isCompleted = idx + 1 < currentStep;
        const isActive = idx + 1 === currentStep;

        return (
          <div key={idx} className="flex-1 flex items-center relative">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-colors duration-300
                  ${isCompleted ? 'bg-[#FF6B00] text-white' : isActive ? 'border-2 border-[#FF6B00] text-[#FF6B00]' : 'bg-gray-200 text-gray-600'}
                `}
              >
                {idx + 1}
              </div>
              <span className={`mt-1 text-xs ${isCompleted || isActive ? 'text-[#FF6B00]' : 'text-gray-500'}`}>
                {step}
              </span>
            </div>
            {idx !== steps.length - 1 && (
              <div className="flex-1 h-1 bg-gray-200 mx-1 relative">
                <div
                  className={`
                    absolute top-0 left-0 h-1 rounded-full transition-all duration-500
                    ${isCompleted ? 'bg-[#FF6B00] w-full' : ''}
                  `}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
