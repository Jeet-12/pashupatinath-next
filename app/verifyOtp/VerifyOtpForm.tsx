"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');
  
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const enteredOtp = otp.join("");

    // In a real app, you would call your API to verify the OTP
    // const response = await verifyOtpApi(phone, enteredOtp);
    // if (response.success) {
    //   router.push('/dashboard');
    // } else {
    //   setError('Invalid OTP. Please try again.');
    //   setIsLoading(false);
    // }

    // Mock success for demonstration
    setTimeout(() => {
      if (enteredOtp === "123456") {
        router.push('/dashboard');
      } else {
        setError('Invalid OTP. Please try again.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-center text-gray-600">
        Enter the 6-digit code sent to <strong>{phone || 'your number'}</strong>
      </p>
      <div className="flex justify-center gap-2">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={data}
            onChange={e => handleChange(e.target, index)}
            ref={el => { inputRefs.current[index] = el; }}
            className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-amber-500"
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <button type="submit" disabled={isLoading} className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 disabled:opacity-50">
        {isLoading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </form>
  );
}