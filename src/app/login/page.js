'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  // const referrer = typeof window !== 'undefined' ? document.referrer : null;
  // const fallbackUrl = referrer && new URL(referrer).origin === window.location.origin
  //   ? new URL(referrer).pathname
  //   : '/dashboard';

  // const callbackUrl = searchParams.get('callbackUrl') || fallbackUrl;
 
  // const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Toaster position="top-right" />
      <div className="w-full max-w-4xl flex shadow-lg rounded-lg overflow-hidden">
        {/* Left: Login */}
        <div className="w-1/2 bg-white p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-2">Log in to Your Account</h2>
          <p className="mb-6 text-gray-600 text-sm">
            Log in to your account so you can continue building and editing your onboarding flows.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center text-xs">
                <input
                  type="checkbox"
                  className="mr-2 accent-orange-500"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                Remember me
              </label>
              <a href="/forgot-password" className="text-xs text-orange-500 hover:underline">
                Forgot password
              </a>
            </div>
            {error && <div className="text-red-500 text-xs">{error}</div>}
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="w-32 bg-orange-500 text-white py-2 rounded font-semibold hover:bg-orange-600 transition"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'LOG IN'}
              </button>
            </div>
          </form>
          <div className="my-4 text-center text-gray-400 text-xs">-OR-</div>
          <button
            onClick={handleLinkedInLogin}
            className="flex items-center justify-center w-full bg-[#0077b5] text-white py-2 rounded font-semibold hover:bg-[#005983] transition"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
            </svg>
            LINKEDIN LOG IN
          </button>
        </div>
        {/* Right: Signup */}
        <div className="w-1/2 bg-[#054B7D] text-white p-10 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold mb-2 text-center">Don't have an account Yet?</h2>
          <p className="mb-6 text-xs text-center">
            By creating an account with our store, you will be able to move through the checkout process faster, store multiple shipping addresses, view and track your orders in your account and more.
          </p>
          <button
            onClick={() => router.push('/signup')}
            className="w-32 bg-orange-500 text-white py-2 rounded font-semibold hover:bg-orange-600 transition mb-4"
          >
            SIGN UP
          </button>
          <div className="text-center text-gray-200 text-xs mb-4">-OR-</div>
          <button
            onClick={handleLinkedInLogin}
            className="flex items-center justify-center w-full bg-[#2176ae] text-white py-2 rounded font-semibold hover:bg-[#005983] transition"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
            </svg>
            LINKEDIN SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
}