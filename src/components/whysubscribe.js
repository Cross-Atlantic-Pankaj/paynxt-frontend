
const WhySubscribe = () => {

  return (
    <section className="py-16 md:py-24">
        <div className="appContainer mx-auto grid grid-rows-1 md:grid-cols-[30%_70%] items-center gap-4">
            {/* Left Section: Text and Button */}
            <div className="space-y-6 text-center md:!text-left">
            <h2 className="text-2xl md:text-5xl font-bold text-slate-800">PayNXT360 Insights</h2>
            <p className="text-slate-700 text-lg">
                Sign up for The PayNXT360 Insights, and get a weekly roundup
                of market events, innovations and data you can trust and use.
            </p>
            <a href="/login">
                <button className="px-6 py-3 bg-themeOrangeColor text-[white] font-semibold rounded-tr-xl rounded-bl-xl hover:bg-themeBlueColor transition duration-300 cursor-pointer">
                SIGN UP NOW
                </button>
            </a>
            </div>

            {/* Right Section: Image */}
            <div className="flex justify-center">
            <img
                src="/Images/whypay.svg" // make sure your image is at public/images/your-image.jpg
                alt="Newsletter"
                className="w-full max-w-4xl"
            />
            </div>
        </div>
    </section>
  );
};

export default WhySubscribe;
