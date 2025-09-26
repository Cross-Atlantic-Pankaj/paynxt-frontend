'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(240);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      setError('OTP has expired. Please request a new one.');
      toast.error('OTP has expired. Please request a new one.');
      setStep(1);
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      toast.error('Email is required');
      return;
    }

    setLoading(true);
    const otpToast = toast.loading('Sending OTP...');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send OTP');
        toast.error(data.error || 'Failed to send OTP', { id: otpToast });
      } else {
        toast.success('OTP sent successfully! Check your email.', { id: otpToast });
        setStep(2);
        setTimeLeft(240);
        setTimerActive(true);
      }
    } catch (err) {
      setError('Something went wrong');
      toast.error('Something went wrong', { id: otpToast });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp.trim() || !newPassword.trim()) {
      setError('OTP and new password are required');
      toast.error('OTP and new password are required');
      return;
    }

    setLoading(true);
    const resetToast = toast.loading('Resetting password...');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to reset password');
        toast.error(data.error || 'Failed to reset password', { id: resetToast });
      } else {
        toast.success('Password reset successfully! Redirecting to login...', { id: resetToast });
        setTimeout(() => router.push('/login'), 1000); // Delay redirect for toast visibility
      }
    } catch (err) {
      setError('Something went wrong');
      toast.error('Something went wrong', { id: resetToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-20 flex items-center justify-center">
      <Toaster position="top-right" />
      <div className="w-full max-w-xl p-16 space-y-8 border border-themeBlueColor">
        <div className="text-center">
          <div className="text-4xl font-playfair font-bold mb-3 text-themeBlueColor text-center">Reset Password</div>
          <p className="mb-6 text-slate-700 text-md leading-6 text-center">
            {step === 1 ? 'Enter your email to receive OTP' : 'Enter OTP and new password'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full border border-darkBorderColor rounded p-3 focus:border-themeBlueColor transition duration-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className='text-center'>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-themeBlueColor text-md font-medium rounded-tr-xl rounded-bl-xl hover:bg-themeOrangeColor transition cursor-pointer duration-500"
              >
                <span className='text-white'>
                  {loading ? 'Sending...' : 'Send OTP'}
                </span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">OTP</label>
              <span className="text-sm font-medium text-orange-500">
                Otp Expires in: {formatTime(timeLeft)}
              </span>
            </div>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setTimerActive(false);
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || timeLeft === 0}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}