// hooks/useOTPVerification.ts
import { useState } from 'react';
import { 
  VerifyOTPData, 
  verifyOTP, 
  resendOTP, 
  getSessionToken, 
  setAuthToken, 
  setSessionToken 
} from '../libs/api';

export const useOTPVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const verify = async (otpData: VerifyOTPData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const sessionToken = otpData.sessionToken || getSessionToken();
      
      if (!sessionToken) {
        throw new Error('No active registration session. Please register again.');
      }

      const result = await verifyOTP({
        email: otpData.email,
        otp: otpData.otp,
        sessionToken: sessionToken
      });
      
      if (result.success) {
        setSuccess(true);
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'OTP verification failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resend = async (email: string, sessionToken: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!sessionToken) {
        throw new Error('No active registration session. Please register again.');
      }

      const result = await resendOTP({
        email,
        sessionToken
      });
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to resend OTP. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verify,
    resend,
    isLoading,
    error,
    success,
    clearError: () => setError(null),
  };
};