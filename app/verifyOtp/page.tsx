"use client";

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useOTPVerification } from '../hooks/useOTPVerification';
import { getSessionToken, verifyLoginOTP, verifyOTP } from '../libs/api';

export default function OTPVerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';
  const type = searchParams.get('type') || 'register'; 
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  
  const { verify, resend, isLoading, error } = useOTPVerification();

  useEffect(() => {
    // Get session token from storage
    const token = getSessionToken();
    setSessionToken(token);
    
    if (!token) {
  
      router.push(type === 'login' ? '/login' : '/register');
    }
  }, [router, type]);


  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (/^[0-9]{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('').slice(0, 6);
      setOtp(newOtp);
      newOtp.forEach((digit, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i].value = digit;
        }
      });
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    
    if (!sessionToken) {
      alert('No active session. Please try again.');
      router.push(type === 'login' ? '/login' : '/register');
      return;
    }
    
    if (enteredOtp.length === 6) {
      try {
        let result;
        
        if (type === 'login') {
          result = await verifyLoginOTP({
            email,
            otp: enteredOtp,
            sessionToken
          });
        } else {
          result = await verifyOTP({
            email,
            otp: enteredOtp,
            sessionToken
          });
        }
        
        if (result.success) {
          // Redirect based on response or to dashboard
          const redirectTo = result.data?.redirect_to || sessionStorage.getItem('login_redirect') || '/';
          sessionStorage.removeItem('login_redirect');
          window.location.href = redirectTo;
        }
      } catch (error) {
        // Error is handled by the hook
        console.error('OTP verification failed:', error);
      }
    } else {
      alert('Please enter a complete 6-digit OTP');
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    if (!sessionToken) {
      alert('No active session. Please try again.');
      router.push(type === 'login' ? '/login' : '/register');
      return;
    }
    
    try {
      await resend(email, sessionToken);
      setTimeLeft(30);
      setIsResendDisabled(true);
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    }
  };

  // Countdown timer for resend OTP
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsResendDisabled(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);

  if (!sessionToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#5F3623] to-[#8B4513] text-white p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">OTP Verification</h1>
          <p className="text-amber-100">
            {type === 'login' 
              ? "We've sent a 6-digit login OTP to your email" 
              : "We've sent a 6-digit verification OTP to your email"
            }
          </p>
          <p className="text-amber-100 font-medium mt-1">{email}</p>
        </div>
        
        {/* Image Section */}
        <div className="flex justify-center p-6 bg-amber-50">
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-amber-200 shadow-lg">
            <Image
              src="https://www.pashupatinathrudraksh.com/storage/app/public/photos/41/otp2.png"
              alt="OTP Verification"
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        {/* OTP Form Section */}
        <div className="px-6 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Enter 6-digit OTP
              </label>
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={handleResend}
                disabled={isResendDisabled || isLoading}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold ${
                  isResendDisabled || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                } transition-colors`}
              >
                {isResendDisabled ? `Resend OTP in ${timeLeft}s` : 'Resend OTP'}
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-[#5F3623] to-[#8B4513] text-white py-3 px-4 rounded-lg font-semibold hover:from-[#4A2A1A] hover:to-[#703A12] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Footer Note */}
        <div className="bg-amber-50 px-6 py-4 border-t border-amber-100">
          <p className="text-sm text-center text-amber-700">
            Having trouble receiving the OTP? Please check your email or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}