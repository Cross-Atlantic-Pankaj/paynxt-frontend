'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import toast, { Toaster } from 'react-hot-toast';
import 'animate.css';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-5xl flex shadow-2xl rounded-2xl overflow-hidden bg-white transform transition-all duration-500 hover:scale-[1.01]">
        {/* Left: Login */}
        <div className="w-1/2 bg-white p-12 flex flex-col justify-center animate__animated animate__fadeInLeft">
          <h2 className="text-3xl font-extrabold mb-3 text-gray-800 tracking-tight">Log in to Your Account</h2>
          <p className="mb-6 text-gray-500 text-sm font-medium">
            Log in to your account so you can continue building and editing your onboarding flows.
          </p>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600 font-medium">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                Remember me
              </label>
              <a href="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600 transition-colors font-medium">
                Forgot password
              </a>
            </div>
            {error && <div className="text-red-500 text-sm font-medium animate__animated animate__shakeX">{error}</div>}
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="w-36 bg-orange-500 text-[white] py-3 rounded-lg font-bold text-sm hover:bg-orange-600 transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50 hover:cursor-pointer"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'LOG IN'}
              </button>
            </div>
          </form>
          <div className="my-6 text-center text-gray-400 text-sm font-medium">-OR-</div>
          <button
            onClick={handleLinkedInLogin}
            className="flex items-center justify-center w-full bg-[#0077b5] text-[white] py-3 rounded-lg font-bold text-sm hover:bg-[#005983] transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:cursor-pointer"
          >
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
            </svg>
            LINKEDIN LOG IN
          </button>
        </div>
        {/* Right: Signup */}
        <div className="w-1/2 bg-gradient-to-br from-[#054B7D] to-[#0a6aa3] text-white p-12 flex flex-col justify-center items-center animate__animated animate__fadeInRight">
          <h2 className="text-4xl font-extrabold mb-4 text-center tracking-tight">Don't have an account Yet?</h2>
          <p className="mb-8 text-sm text-center font-medium">
            By creating an account with our store, you will be able to move through the checkout process faster, store multiple shipping addresses, view and track your orders in your account and more.
          </p>
          <button
            onClick={() => router.push('/signup')}
            className="w-36 bg-orange-500 text-white py-3 rounded-lg font-bold text-sm hover:bg-orange-600 transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 hover:cursor-pointer"
          >
            SIGN UP
          </button>
          <div className="text-center text-gray-200 text-sm my-6 font-medium">-OR-</div>
          <button
            onClick={handleLinkedInLogin}
            className="flex items-center justify-center w-full bg-[#2176ae] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#005983] transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:cursor-pointer"
          >
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
            </svg>
            LINKEDIN SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
}