"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { loginUser, getGoogleAuthUrl, initiateGoogleLogin, setSessionToken  } from '../libs/api';
import { getGoogleOAuthUrl } from '../libs/google-oauth';

interface LoginForm {
  email: string;
}

interface LoginErrors {
  email?: string;
  general?: string;
}

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<LoginForm>({ 
    email: searchParams.get('email') || '' 
  });
  const [errors, setErrors] = useState<LoginErrors>({});  
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState(searchParams.get('redirect_to') || '');

  useEffect(() => {
    setIsMounted(true);
    
    // Store redirect URL in session storage for later use
    if (redirectTo) {
      sessionStorage.setItem('login_redirect', redirectTo);
    }
  }, [redirectTo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof LoginErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Email exists, proceed with login OTP
      const loginResponse = await loginUser({
        email: formData.email,
        redirect_to: redirectTo
      });

      if (loginResponse.success) {
        // Store session token and redirect to OTP verification
        if (loginResponse.data?.session_token) {
          setSessionToken(loginResponse.data.session_token);
        }
        
        const otpParams = new URLSearchParams({
          email: formData.email,
          type: 'login'
        });
        
        if (redirectTo) {
          otpParams.append('redirect_to', redirectTo);
        }
        
        router.push(`/verifyOtp?${otpParams.toString()}`);
      } else {
        throw new Error(loginResponse.message || 'Login failed');
      }
      
    } catch (error: any) {
      setErrors({ 
        general: error.message || 'An error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
  setIsGoogleLoading(true);
  
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const googleAuthUrl = getGoogleOAuthUrl(redirectTo || `${appUrl}/dashboard`);
    
    window.location.href = googleAuthUrl;
  } catch (error) {
    setErrors({ general: 'Google login failed. Please try again.' });
  } finally {
    setIsGoogleLoading(false);
  }
};

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5F3623] to-[#f5821f]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#5F3623] to-[#f5821f] p-12">
        <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-white/10"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white/10"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-white/10"></div>
          
          <Image
            src="https://res.cloudinary.com/dmymkz5ed/image/upload/v1755001594/loginImage_s94pte.jpg"
            alt="Login illustration"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-[#5F3623] to-[#f5821f] rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Sign in to your account</h1>
            <p className="mt-2 text-gray-600">Welcome back! Please sign in to continue</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none sm:text-sm text-black ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500 placeholder-red-300' 
                    : 'border-gray-300 focus:ring-[#5F3623] focus:border-[#5F3623] placeholder-gray-500'
                }`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#5F3623] to-[#f5821f] hover:from-[#4a2a1a] hover:to-[#e07515] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5F3623] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </>
                ) : 'Continue with Email'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 "/>
                  </svg>
                )}
                Continue with Google
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                href={`/register${redirectTo ? `?redirect_to=${encodeURIComponent(redirectTo)}` : ''}`} 
                className="font-medium text-[#5F3623] hover:text-[#f5821f]"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}