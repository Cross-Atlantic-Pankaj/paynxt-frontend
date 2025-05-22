'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import toast from 'react-hot-toast';

export default function ClientLayout({ children }) {
  const { user, login } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam && !user) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(userParam));
        const userData = { token, user: decodedUser };
        login(userData);
        toast.success(`Welcome, ${decodedUser.Firstname}! You have successfully logged in with LinkedIn.`);
        router.replace(window.location.pathname, undefined, { shallow: true });
      } catch (err) {
        console.error('Failed to parse user data:', err);
        toast.error('Failed to log in with LinkedIn. Please try again.');
        router.push('/login');
      }
    }
  }, [searchParams, user, login, router]);

  return <>{children}</>;
}