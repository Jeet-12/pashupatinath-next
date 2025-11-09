"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useUserRegistration } from '../hooks/useUserRegistration';
import { checkEmail, getSessionToken } from '../libs/api';

interface RegisterForm {
  name: string;
  email: string;
}

interface RegisterErrors {
  name?: string;
  email?: string;
  general?: string;
}

export default function RegisterPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterForm>({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { register, isLoading, error: apiError, clearError } = useUserRegistration();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (apiError) {
      setErrors({ general: apiError });
    }
  }, [apiError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when user starts typing
    if (errors[name as keyof RegisterErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Clear general error
    if (errors.general) {
      clearError();
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // First check if email exists
      const emailCheck = await checkEmail(formData.email);
      
      // Check if email already exists
      if (emailCheck.data?.exists === true) {
        setErrors({ 
          general: emailCheck.data.suggestion || 'Email already exists. Please login instead.' 
        });
        return;
      }

      // If email doesn't exist, proceed with registration
      const result = await register(formData);
      
      // Check if we have a session token before redirecting
      const sessionToken = getSessionToken();
      console.log('Session token after registration:', sessionToken);
      
      if (sessionToken) {
        // Redirect to OTP verification page with email
        router.push(`/verifyOtp?email=${encodeURIComponent(formData.email)}&type=register`);
      } else {
        // If no session token, check if the API call was successful anyway
        if (result.success) {
          // Some APIs might not return session tokens but still register successfully
          // Try redirecting anyway and let the OTP page handle it
          router.push(`/verifyOtp?email=${encodeURIComponent(formData.email)}&type=register`);
        } else {
          throw new Error('Registration failed: No session token received');
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({ 
        general: error.message || 'An error occurred during registration. Please try again.' 
      });
    }
  };

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    
    try {
      // Simulate Google OAuth process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isMounted) {
        router.push('/');
      }
    } catch (err: unknown) {
      setErrors({
        general: err instanceof Error ? err.message : 'Google registration failed. Please try again.'
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Show a simple loading state while mounting
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5F3623] to-[#f5821f]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side with image - hidden on mobile, visible on laptop and larger screens */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#5F3623] to-[#f5821f] p-12">
        <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Decorative elements */}
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

      {/* Right side with registration form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-[#5F3623] to-[#f5821f] rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
            <p className="mt-2 text-gray-600">Join us today! Fill in your details to get started</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleEmailRegister}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className={`appearance-none block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none sm:text-sm text-black ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500 placeholder-red-300' 
                    : 'border-gray-300 focus:ring-[#5F3623] focus:border-[#5F3623] placeholder-gray-500'
                }`}
                placeholder="Enter your fullname"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

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
                    Creating Account...
                  </>
                ) : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-[#5F3623] hover:text-[#f5821f]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}