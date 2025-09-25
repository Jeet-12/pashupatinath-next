import { useState } from 'react';
import { RegisterData, checkEmail, registerUser, setSessionToken, clearSessionToken } from '../libs/api';

export const useUserRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    setSessionExpired(false);
    clearSessionToken(); 
    
    try {
      const result = await registerUser(userData);
      setSuccess(true);
      return result;
    } catch (err: any) {
      let errorMessage = 'Registration failed. Please try again.';
      
      // Handle specific error messages
      if (err.message.includes('session has expired') || err.message === 'REGISTRATION_SESSION_EXPIRED') {
        errorMessage = 'Your registration session has expired. Please start over.';
        setSessionExpired(true);
        clearSessionToken();
      } else if (err.message.includes('email already exists')) {
        errorMessage = 'This email is already registered. Please try logging in.';
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const checkEmailAvailability = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSessionExpired(false);
    
    try {
      const result = await checkEmail(email);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Email check failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    checkEmailAvailability,
    isLoading,
    error,
    success,
    sessionExpired,
    clearError: () => {
      setError(null);
      setSessionExpired(false);
    },
  };
};