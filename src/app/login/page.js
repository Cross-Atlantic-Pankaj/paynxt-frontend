'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import toast, { Toaster } from 'react-hot-toast';
import 'animate.css';
import { FaLinkedinIn } from 'react-icons/fa6';

export default function LoginPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/'; // or homepage as default

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: setUserContext } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      toast.error('Email and password are required');
      return;
    }

    setLoading(true);
    const loginToast = toast.loading('Logging in...');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log('Login response data:', data);

      if (!res.ok) {
        setError(data.error || 'Login failed');
        toast.error(data.error || 'Login failed', { id: loginToast });
      } else {
        localStorage.setItem('userId', data.user.id);

        setUserContext({ token: data.token, user: data.user });
        toast.success('Login successful!', { id: loginToast });
        router.push(callbackUrl);
      }
    } catch (err) {
      setError('Something went wrong');
      toast.error('Something went wrong', { id: loginToast });
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInLogin = () => {
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
          {/* Left: Login */}
          <div className="w-full md:!w-1/2 bg-white pt-12 md:py-48 px-12 flex flex-col justify-center animate__animated animate__fadeInLeft">
            <div className="text-4xl font-playfair font-bold mb-3 text-themeBlueColor text-center">Log in to Your Account</div>
            <p className="mb-6 text-slate-500 text-md leading-6 text-center">Log in to your account so you can continue building and editing your onboarding flows.</p>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  className="w-full border border-darkBorderColor rounded p-3 focus:border-themeBlueColor transition duration-500 focus:outline-none text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  className="w-full border border-darkBorderColor rounded p-3 focus:border-themeBlueColor transition duration-500 focus:outline-none text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex gap-2 items-center text-sm text-gray-600 font-medium">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                  />
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password" className="text-sm text-themeOrangeColor hover:text-themeBlueColor transition font-medium duration-500">
                  Forgot password
                </a>
              </div>
              {error && <div className="text-red-500 text-sm font-medium animate__animated animate__shakeX">{error}</div>}
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="px-8 py-4 bg-themeOrangeColor text-md font-medium rounded-tr-xl rounded-bl-xl hover:bg-themeBlueColor transition cursor-pointer duration-500"
                  disabled={loading}
                >
                  <span className='text-white'>{loading ? 'Logging in...' : 'LOG IN'}</span>
                </button>
              </div>
            </form>
            <div className="my-6 text-center text-slate-500 text-sm font-medium">-OR-</div>
            <div className='text-center'>
              <button
                onClick={handleLinkedInLogin}
                className="px-8 py-4 bg-[#0E76A8] text-md font-medium rounded-tr-xl rounded-bl-xl hover:bg-themeOrangeColor transition cursor-pointer duration-500"
              >
                <span className='text-white flex gap-3'>
                  <FaLinkedinIn /> LINKEDIN LOG IN
                </span>
              </button>
            </div>
          </div>
          {/* Right: Signup */}
          <div className="w-full md:!w-1/2 bg-themeBlueColor text-white py-12 md:py-48 px-12 flex flex-col justify-center items-center animate__animated animate__fadeInRight">
            <div className="text-4xl font-playfair font-bold mb-3 text-white text-center">Don't have an account Yet?</div>
            <p className="mb-6 text-lightColor text-md leading-6 text-center">By creating an account with our store, you will be able to move through the checkout process faster, store multiple shipping addresses, view and track your orders in your account and more.</p>
            <button
              onClick={() => router.push('/signup')}
              className="px-8 py-4 bg-themeOrangeColor text-white text-md font-medium rounded-tr-xl rounded-bl-xl hover:bg-white hover:!text-themeOrangeColor transition cursor-pointer duration-500"
            >SIGN UP</button>
            <div className="text-center text-gray-200 text-sm my-6 font-medium">-OR-</div>
            <div className='text-center'>
              <button
                onClick={handleLinkedInLogin}
                className="px-8 py-4 bg-[#0E76A8] text-md font-medium rounded-tr-xl rounded-bl-xl hover:bg-themeOrangeColor transition cursor-pointer duration-500"
              >
                <span className='text-white flex gap-3'>
                  <FaLinkedinIn /> LINKEDIN LOG IN
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}