'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import toast, { Toaster } from 'react-hot-toast';
import 'animate.css';
import { FaLinkedinIn } from 'react-icons/fa6';
import { CountryDropdown } from 'react-country-region-selector';
import { ChevronDown } from 'lucide-react';

function isCorporateEmail(email) {
  const publicDomains = [
    'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'protonmail.com', 'zoho.com', 'mail.com', 'gmx.com', 'yandex.com', 'rediffmail.com'
  ];
  const domain = email.split('@')[1]?.toLowerCase();
  return domain && !publicDomains.includes(domain);
}

export default function SignupPage() {
  const router = useRouter();
  const { login: setUserContext } = useUser();
  const [form, setForm] = useState({
    Firstname: '',
    Lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    jobTitle: '',
    companyName: '',
    phoneNumber: '',
    country: '',
    newsletter: false,
    termsAccepted: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('/api/countries');
        const data = await res.json();
        if (res.ok) {
          setCountries(data);
        } else {
          console.error('Failed to fetch countries:', data);
          toast.error('Failed to load countries');
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        toast.error('Failed to load countries');
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const filteredCountries = countries
    .filter(country =>
      country.toLowerCase().includes(countrySearch.toLowerCase())
    )
    .sort((a, b) => {
      // Priority: India, US, UK
      if (a === "India") return -1;
      if (b === "India") return 1;
      if (a === "United States") return -1;
      if (b === "United States") return 1;
      if (a === "United Kingdom") return -1;
      if (b === "United Kingdom") return 1;
      return 0;
    });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !form.Firstname.trim() ||
      !form.Lastname.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim() ||
      !form.termsAccepted
    ) {
      setError('Please fill all required fields and accept terms.');
      toast.error('Please fill all required fields and accept terms.');
      return;
    }

    if (!isCorporateEmail(form.email)) {
      setError('Kindly use your official work email. Personal email domains like Gmail or Yahoo are not accepted.');
      toast.error('Kindly use your official work email. Personal email domains like Gmail or Yahoo are not accepted.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const signupToast = toast.loading('Signing up...');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Signup failed');
        toast.error(data.error || 'Signup failed', { id: signupToast });
      } else {
        toast.success('Signup successful! Please verify your email.', { id: signupToast });
        setOtpStep(true);
        setSignupEmail(form.email);
      }
    } catch (err) {
      setError('Something went wrong');
      toast.error('Something went wrong', { id: signupToast });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');

    if (!otp.trim()) {
      setOtpError('OTP is required');
      toast.error('OTP is required');
      return;
    }

    setLoading(true);
    const otpToast = toast.loading('Verifying OTP...');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error || 'Incorrect or expired OTP. Please sign up again');
        toast.error(data.error || 'Incorrect or expired OTP. Please sign up again', { id: otpToast });
      } else {
        toast.success('OTP verified successfully!', { id: otpToast });
        setUserContext({ token: data.token, user: data.user });
        router.push('/');
      }
    } catch (err) {
      setOtpError('Incorrect or expired OTP. Please sign up again.');
      toast.error('Incorrect or expired OTP. Please sign up again.', { id: otpToast });
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInAuth = () => {
    const linkedInAuthUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    linkedInAuthUrl.searchParams.set('response_type', 'code');
    linkedInAuthUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID);
    linkedInAuthUrl.searchParams.set('redirect_uri', process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI);
    linkedInAuthUrl.searchParams.set('scope', 'profile email openid');
    linkedInAuthUrl.searchParams.set('state', Math.random().toString(36).substring(2));

    toast.loading('Redirecting to LinkedIn...');
    window.location.href = linkedInAuthUrl.toString();
  };

  return (
    <div className="py-16 md:py-24">
      <Toaster position="top-right" />
      <div className="appContainer">
        <div className="flex flex-col md:!flex-row border border-themeBlueColor overflow-hidden bg-white transform transition-all duration-500">
          {/* Left: Already Signed up */}
          <div className="w-1/2 bg-themeBlueColor text-white p-12 flex flex-col justify-center animate__animated animate__fadeInLeft">
            <div className="text-4xl font-playfair font-bold mb-3 text-white">Already Signed up?</div>
            <p className="mb-12 text-lightColor text-md leading-6">Why Register?</p>
            <ul className="mb-12 text-sm space-y-4">
              <li>
                <span className="font-semibold mr-2">Research Assistance & Customization:</span>
                Get assistance in locating information you need. Tell us your preferences and we will send you customized alerts with insights on a weekly basis.
              </li>
              <li>
                <span className="font-semibold mr-2">Additional Discounts:</span>
                Get additional discounts on report purchases and consulting projects.
              </li>
              <li>
                <span className="font-semibold mr-2">Manage Purchases:</span>
                View history of purchased reports and track order.
              </li>
              <li>
                <span className="font-semibold mr-2">Manage Profile:</span>
                Update your personal information, manage preferences, and change password.
              </li>
            </ul>

            <div className="flex items-center justify-center">
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-4 bg-themeOrangeColor text-white text-md font-medium rounded-tr-xl rounded-bl-xl hover:bg-white hover:!text-themeOrangeColor transition cursor-pointer duration-500"
              >SIGN UP</button>
            </div>
            <div className="text-center text-gray-200 text-sm my-6 font-medium">-OR-</div>
            <div className='text-center'>
              <button
                onClick={handleLinkedInAuth}
                className="px-8 py-4 bg-[#0E76A8] text-md font-medium rounded-tr-xl rounded-bl-xl hover:bg-themeOrangeColor transition cursor-pointer duration-500"
              >
                <span className='text-white flex gap-3'>
                  <FaLinkedinIn /> LINKEDIN LOG IN
                </span>
              </button>
            </div>

          </div>
          {/* Right: Signup */}
          <div className="w-1/2 bg-white p-12 flex flex-col justify-center animate__animated animate__fadeInRight">
            {!otpStep ? (
              <>
                <div className="text-4xl font-playfair font-bold mb-3 text-themeBlueColor text-center">Sign Up for an Account</div>
                <p className="mb-6 text-slate-500 text-md leading-6 text-center">Let's get you all set up so you can start creating your first onboarding experience.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="block text-sm font-semibold text-gray-700 mb-.5">First Name</label>
                      <input
                        type="text"
                        name="Firstname"
                        placeholder="First Name"
                        className="w-full border border-darkBorderColor rounded p-3 focus:border-themeBlueColor transition duration-500 focus:outline-none text-black"
                        value={form.Firstname}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-semibold text-gray-700 mb-.5">Last Name</label>
                      <input
                        type="text"
                        name="Lastname"
                        placeholder="Last Name"
                        className="w-full border border-darkBorderColor rounded p-3 focus:border-themeBlueColor transition duration-500 focus:outline-none text-black"
                        value={form.Lastname}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="w-full border border-darkBorderColor rounded p-3 focus:border-themeBlueColor transition duration-500 focus:outline-none text-black"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="block text-sm font-semibold text-gray-700 mb-.5">Password</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full border border-darkBorderColor rounded p-3 focus:border-themeBlueColor transition duration-500 focus:outline-none text-black"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-semibold text-gray-700 mb-.5">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className="w-full border border-darkBorderColor rounded p-3 focus:border-themeBlueColor transition duration-500 focus:outline-none text-black"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-.5">Job Title</label>
                    <input
                      type="text"
                      name="jobTitle"
                      placeholder="Job Title"
                      className="w-full border border-darkBorderColor rounded p-3 focus:border-themeBlueColor transition duration-500 focus:outline-none text-black"
                      value={form.jobTitle}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="block text-sm font-semibold text-gray-700 mb-.5">Company Name</label>
                      <input
                        type="text"
                        name="companyName"
                        placeholder="Company Name"
                        className="w-full border border-darkBorderColor rounded p-3 focus:border-themeBlueColor transition duration-500 focus:outline-none text-black"
                        value={form.companyName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-semibold text-gray-700 mb-.5">Phone Number</label>
                      <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        className="w-full border border-darkBorderColor rounded p-3 focus:border-themeBlueColor transition duration-500 focus:outline-none text-black"
                        value={form.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-.5">Country</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search or select a country"
                        className="w-full border border-darkBorderColor rounded p-3 pr-10 focus:border-themeBlueColor transition duration-500 focus:outline-none placeholder-gray-400 text-black"
                        value={form.country ? form.country : countrySearch}
                        onChange={(e) => {
                          setCountrySearch(e.target.value);
                          setForm(prev => ({ ...prev, country: '' }));
                          setIsCountryOpen(true);
                        }}
                        onFocus={() => setIsCountryOpen(true)}
                        onBlur={() => setTimeout(() => setIsCountryOpen(false), 200)}
                      />
                      <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

                      {isCountryOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-darkBorderColor rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                          {countriesLoading ? (
                            <div className="p-3 text-gray-500 text-sm">Loading countries...</div>
                          ) : filteredCountries.length === 0 ? (
                            <div className="p-3 text-gray-500 text-sm">No countries found</div>
                          ) : (
                            filteredCountries.map((country) => (
                              <div
                                key={country}
                                className="p-3 hover:bg-orange-50 cursor-pointer text-gray-700 text-sm transition"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  setForm(prev => ({ ...prev, country }));
                                  setCountrySearch('');
                                  setIsCountryOpen(false);
                                }}
                              >
                                {country}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    {form.country && !countrySearch && (
                      <div className="mt-1 text-xs text-themeBlueColor">Selected: {form.country}</div>
                    )}
                  </div>

                  <div className='mb-6'>
                    <label className="flex items-center gap-3 cursor-pointer select-none mb-4">
                      <input
                        type="checkbox"
                        name="newsletter"
                        checked={form.newsletter}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden
                        className="relative h-4 w-11 rounded-full bg-darkBorderColor transition after:absolute after:left-1 after:top-0.5 after:h-3 after:w-3 after:rounded-full after:bg-white after:transition peer-checked:bg-themeOrangeColor peer-checked:after:translate-x-6 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-themeOrangeColor"
                      />
                      <span className="text-sm text-gray-600 font-medium">Sign up for newsletter</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer select-none mb-4">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={form.termsAccepted}
                        onChange={handleChange}
                        required
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden
                        className="relative h-4 w-11 rounded-full bg-darkBorderColor transition after:absolute after:left-1 after:top-0.5 after:h-3 after:w-3 after:rounded-full after:bg-white after:transition peer-checked:bg-themeOrangeColor peer-checked:after:translate-x-6 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-themeOrangeColor"
                      />
                      <span className="text-sm text-slate-600 font-medium">
                        I agree with{" "}
                        <a href="#" className="text-themeOrangeColor hover:text-themeBlueColor transition duration-500">
                          terms and conditions
                        </a>
                      </span>
                    </label>

                  </div>
                  {error && <div className="text-red-500 text-sm font-medium animate__animated animate__shakeX">{error}</div>}
                  <div className="flex items-center justify-center">
                    <button
                      type="submit"
                      className="px-8 py-4 bg-themeOrangeColor text-md font-medium rounded-tr-xl rounded-bl-xl hover:bg-themeBlueColor transition cursor-pointer duration-500"
                      disabled={loading}
                    >
                      <span className='text-white'>{loading ? 'Signing up...' : 'SIGN UP'}</span>
                    </button>
                  </div>
                </form>
                <div className="my-6 text-center text-slate-500 text-sm font-medium">-OR-</div>
                <div className='text-center'>
                  <button
                    onClick={handleLinkedInAuth}
                    className="px-8 py-4 bg-[#0E76A8] text-md font-medium rounded-tr-xl rounded-bl-xl hover:bg-themeOrangeColor transition cursor-pointer duration-500"
                  >
                    <span className='text-white flex gap-3'>
                      <FaLinkedinIn /> LINKEDIN LOG IN
                    </span>
                  </button>
                </div>
              </>
            ) : (
              // OTP Step
              <form onSubmit={handleOtpSubmit} className="flex flex-col items-center justify-center h-full animate__animated animate__fadeIn">
                <h2 className="text-3xl font-extrabold mb-3 text-gray-800 tracking-tight">Verify OTP</h2>
                <p className="mb-4 text-gray-500 text-sm font-medium text-center">
                  Please enter the OTP sent to your email <span className="font-semibold">{signupEmail}</span>
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300 mb-4 text-black"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                {otpError && <div className="text-red-500 text-sm font-medium mb-4 animate__animated animate__shakeX">{otpError}</div>}
                <button
                  type="submit"
                  className="w-36 bg-orange-500 text-white py-3 rounded-lg font-bold text-sm hover:bg-orange-600 transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 