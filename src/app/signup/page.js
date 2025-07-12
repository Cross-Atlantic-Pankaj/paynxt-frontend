'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import toast, { Toaster } from 'react-hot-toast';

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
        setOtpError(data.error || 'OTP verification failed');
        toast.error(data.error || 'OTP verification failed', { id: otpToast });
      } else {
        toast.success('OTP verified successfully!', { id: otpToast });
        setUserContext({ token: data.token, user: data.user });
        router.push('/dashboard');
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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Toaster position="top-right" />
      <div className="w-full max-w-5xl flex shadow-lg rounded-lg overflow-hidden">
        {/* Left: Already Signed up */}
        <div className="w-1/2 bg-[#054B7D] text-white p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2">Already Signed up?</h2>
          <p className="mb-2 text-xs">Why Register?</p>
          <ul className="mb-6 text-xs space-y-2">
            <li>
              <span className="font-bold">Research Assistance & Customization:</span> Get assistance in locating information you need. Tell us your preferences and we will send you customized alerts with insights on a weekly basis.
            </li>
            <li>
              <span className="font-bold">Additional Discounts:</span> Get additional discounts on report purchases and consulting projects.
            </li>
            <li>
              <span className="font-bold">Manage Purchases:</span> View history of purchased reports and track order.
            </li>
            <li>
              <span className="font-bold">Manage Profile:</span> Update your personal information, manage preferences, and change password.
            </li>
          </ul>
          <div className='flex items-center justify-center'>
            <button
              onClick={() => router.push('/login')}
              className="w-32 bg-orange-500 text-white py-2 rounded font-semibold hover:bg-orange-600 transition mb-4"
            >
              LOG IN
            </button>
          </div>
          <div className="text-center text-gray-200 text-xs mb-4">-OR-</div>
          <button
            onClick={handleLinkedInAuth}
            className="flex items-center justify-center w-full bg-[#2176ae] text-white py-2 rounded font-semibold hover:bg-[#005983] transition"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/>
            </svg>
            LINKEDIN LOG IN
          </button>
        </div>
        {/* Right: Signup */}
        <div className="w-1/2 bg-white p-10 flex flex-col justify-center">
          {!otpStep ? (
            <>
              <h2 className="text-2xl font-bold mb-2">Sign Up for an Account</h2>
              <p className="mb-6 text-gray-600 text-sm">
                Let's get you all set up so you can start creating your first onboarding experience.
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <input
                      type="text"
                      name="Firstname"
                      placeholder="First Name"
                      className="w-full border rounded px-3 py-2 text-sm"
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
                      className="w-full border rounded px-3 py-2 text-sm"
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
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="w-full border rounded px-3 py-2 text-sm"
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
                      className="w-full border rounded px-3 py-2 text-sm"
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
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.jobTitle}
                  onChange={handleChange}
                />
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Company Name"
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={form.companyName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/2">
                    <input
                      type="text"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={form.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.country}
                  onChange={handleChange}
                />
                <div className="flex items-center gap-3 mt-2">
                  <label className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={form.newsletter}
                      onChange={handleChange}
                      className="mr-2 accent-orange-500"
                    />
                    Sign up for newsletter
                  </label>
                  <label className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={form.termsAccepted}
                      onChange={handleChange}
                      className="mr-2 accent-orange-500"
                      required
                    />
                    I agree with <a href="#" className="text-orange-500 underline ml-1">terms and conditions</a>
                  </label>
                </div>
                {error && <div className="text-red-500 text-xs">{error}</div>}
                <div className='flex items-center justify-center'>
                  <button
                    type="submit"
                    className="w-32 bg-orange-500 text-white py-2 rounded font-semibold hover:bg-orange-600 transition mt-2"
                    disabled={loading}
                  >
                    {loading ? 'Signing up...' : 'SIGN UP'}
                  </button>
                </div>
              </form>
              <div className="my-4 text-center text-gray-400 text-xs">-OR-</div>
              <button
                onClick={handleLinkedInAuth}
                className="flex items-center justify-center w-full bg-[#2176ae] text-white py-2 rounded font-semibold hover:bg-[#005983] transition"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/>
                </svg>
                LINKEDIN SIGN UP
              </button>
            </>
          ) : (
            // OTP Step
            <form onSubmit={handleOtpSubmit} className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-bold mb-2">Verify OTP</h2>
              <p className="mb-4 text-gray-600 text-sm text-center">
                Please enter the OTP sent to your email <span className="font-semibold">{signupEmail}</span>
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full border rounded px-3 py-2 text-sm mb-2"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              {otpError && <div className="text-red-500 text-xs mb-2">{otpError}</div>}
              <button
                type="submit"
                className="w-32 bg-orange-500 text-white py-2 rounded font-semibold hover:bg-orange-600 transition"
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