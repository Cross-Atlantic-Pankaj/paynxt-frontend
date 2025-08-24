'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import toast, { Toaster } from 'react-hot-toast';
import 'animate.css';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-5xl flex shadow-2xl rounded-2xl overflow-hidden bg-white transform transition-all duration-500 hover:scale-[1.01]">
        {/* Left: Already Signed up */}
        <div className="w-1/2 bg-gradient-to-br from-[#054B7D] to-[#0a6aa3] text-white p-12 flex flex-col justify-center animate__animated animate__fadeInLeft">
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Already Signed up?</h2>
          <p className="mb-4 text-sm font-medium">Why Register?</p>
          <ul className="mb-8 text-sm space-y-4">
            <li className="flex items-start">
              <span className="font-semibold mr-2">Research Assistance & Customization:</span>
              Get assistance in locating information you need. Tell us your preferences and we will send you customized alerts with insights on a weekly basis.
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">Additional Discounts:</span>
              Get additional discounts on report purchases and consulting projects.
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">Manage Purchases:</span>
              View history of purchased reports and track order.
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">Manage Profile:</span>
              Update your personal information, manage preferences, and change password.
            </li>
          </ul>
          <div className="flex items-center justify-center">
            <button
              onClick={() => router.push('/login')}
              className="w-36 bg-orange-500 text-white py-3 px-6 rounded-lg font-bold text-sm hover:bg-orange-600 transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 hover:cursor-pointer"
            >
              LOG IN
            </button>
          </div>
          <div className="text-center text-gray-200 text-sm my-6 font-medium">-OR-</div>
          <button
            onClick={handleLinkedInAuth}
            className="flex items-center justify-center w-full bg-[#2176ae] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#005983] transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:cursor-pointer"
          >
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/>
            </svg>
            LINKEDIN LOG IN
          </button>
        </div>
        {/* Right: Signup */}
        <div className="w-1/2 bg-white p-12 flex flex-col justify-center animate__animated animate__fadeInRight">
          {!otpStep ? (
            <>
              <h2 className="text-3xl font-extrabold mb-3 text-gray-800 tracking-tight">Sign Up for an Account</h2>
              <p className="mb-6 text-gray-500 text-sm font-medium">
                Let's get you all set up so you can start creating your first onboarding experience.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <input
                      type="text"
                      name="Firstname"
                      placeholder="First Name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                      value={form.Firstname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <input
                      type="text"
                      name="Lastname"
                      placeholder="Last Name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                      value={form.Lastname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <input
                  type="text"
                  name="jobTitle"
                  placeholder="Job Title"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                  value={form.jobTitle}
                  onChange={handleChange}
                />
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Company Name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                      value={form.companyName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/2">
                    <input
                      type="text"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                      value={form.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                  value={form.country}
                  onChange={handleChange}
                />
                <div className="flex items-center gap-6 mt-4">
                  <label className="flex items-center text-sm text-gray-600 font-medium">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={form.newsletter}
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                    />
                    Sign up for newsletter
                  </label>
                  <label className="flex items-center text-sm text-gray-600 font-medium">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={form.termsAccepted}
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                      required
                    />
                    I agree with <a href="#" className="text-orange-500 underline ml-1 hover:text-orange-600 transition-colors">terms and conditions</a>
                  </label>
                </div>
                {error && <div className="text-red-500 text-sm font-medium animate__animated animate__shakeX">{error}</div>}
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className="w-36 bg-orange-500 text-[white] py-3 rounded-lg font-bold text-sm hover:bg-orange-600 transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50 hover:cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? 'Signing up...' : 'SIGN UP'}
                  </button>
                </div>
              </form>
              <div className="my-6 text-center text-gray-400 text-sm font-medium">-OR-</div>
              <button
                onClick={handleLinkedInAuth}
                className="flex items-center justify-center w-full bg-[#2176ae] text-[white] py-3 rounded-lg font-bold text-sm hover:bg-[#005983] transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:cursor-pointer"
              >
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/>
                </svg>
                LINKEDIN SIGN UP
              </button>
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
                className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300 mb-4"
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
  );
}