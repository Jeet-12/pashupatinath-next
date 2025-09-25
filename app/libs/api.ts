// libs/api.ts
const API_BASE_URL = 'https://www.pashupatinathrudraksh.com/api';

export interface RegisterData {
  name: string;
  email: string;
  mobile?: string;
}

export interface VerifyOTPData {
  email: string;
  otp: string;
  sessionToken: string;
}

export interface ResendOTPData {
  email: string;
  sessionToken: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: number;
      name: string;
      email: string;
      mobile?: string;
    };
    token: string;
    token_type: string;
    expires_in: number;
    redirect_to?: string;
  };
}

// Store session token in localStorage for persistence
export const getSessionToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('registration_session_token');
  }
  return null;
};

export const setSessionToken = (token: string | null): void => {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('registration_session_token', token);
    } else {
      localStorage.removeItem('registration_session_token');
    }
  }
};

export const clearSessionToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('registration_session_token');
  }
};

// Store authentication token
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

export const setAuthToken = (token: string | null): void => {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }
};

export const clearAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

// Generic API call function
export const apiCall = async (endpoint: string, method: string = 'GET', data: any = null): Promise<ApiResponse> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    // Store session token if provided in response
    if (result.data?.session_token) {
      setSessionToken(result.data.session_token);
    }
    
    // Handle session expiration specifically
    if (response.status === 410 && result.message?.includes('session expired')) {
      clearSessionToken(); // Clear expired session token
      throw new Error('REGISTRATION_SESSION_EXPIRED');
    }
    
    // Return the result even if success is false, but handle specific cases
    if (!response.ok) {
      // If it's a validation error, extract the specific field errors
      if (result.errors) {
        const errorMessages = Object.values(result.errors).flat().join(', ');
        result.message = errorMessages || result.message || 'Validation failed';
      }
      
      // For specific status codes, you might want to throw errors
      if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
    }
    
    return result;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    
    // Re-throw specific errors
    if (error instanceof Error) {
      if (error.message === 'REGISTRATION_SESSION_EXPIRED') {
        throw new Error('Your registration session has expired. Please start over.');
      }
      throw error;
    }
    
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

// Check if email is available
export const checkEmail = async (email: string): Promise<ApiResponse> => {
  return await apiCall('/check-email', 'POST', { email });
};

// Register a new user
export const registerUser = async (userData: RegisterData): Promise<ApiResponse> => {
  // Clear any existing session token before new registration
  clearSessionToken();
  return await apiCall('/user/register', 'POST', userData);
};

// Verify OTP
export const verifyOTP = async (otpData: VerifyOTPData): Promise<AuthResponse> => {
  // Use the session token from the parameter, not from storage
  const payload = {
    email: otpData.email,
    otp: otpData.otp,
    session_token: otpData.sessionToken
  };
  
  const result = await apiCall('/verify-otp', 'POST', payload) as AuthResponse;
  
  if (result.success && result.data?.token) {
    setAuthToken(result.data.token);
    setSessionToken(null); // Clear registration session token
  }
  
  return result;
};

// Resend OTP
export const resendOTP = async (resendData: ResendOTPData): Promise<ApiResponse> => {
  const payload = {
    email: resendData.email,
    session_token: resendData.sessionToken
  };
  return await apiCall('/resend-otp', 'POST', payload);
};

// Validate session
export const validateSession = async (sessionToken: string): Promise<ApiResponse> => {
  return await apiCall('/validate-session', 'POST', { session_token: sessionToken });
};

// Login user
// export const loginUser = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
//   const result = await apiCall('/login', 'POST', credentials) as AuthResponse;
//   if (result.success && result.data?.token) {
//     setAuthToken(result.data.token);
//   }
//   return result;
// };

// Get user profile
export const getProfile = async (): Promise<ApiResponse> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }
  
  return await apiCall('/profile', 'GET', null);
};

// Refresh token
export const refreshToken = async (): Promise<AuthResponse> => {
  const result = await apiCall('/refresh-token', 'POST', null) as AuthResponse;
  if (result.success && result.data?.token) {
    setAuthToken(result.data.token);
  }
  return result;
};

// Logout user
export const logoutUser = async (): Promise<ApiResponse> => {
  const result = await apiCall('/logout', 'POST', null);
  clearAuthToken();
  clearSessionToken();
  return result;
};

export const loginUser = async (credentials: { email: string; redirect_to?: string }): Promise<ApiResponse> => {
  return await apiCall('/user/login', 'POST', credentials);
};

// Verify login OTP
export const verifyLoginOTP = async (otpData: VerifyOTPData): Promise<AuthResponse> => {
  const payload = {
    email: otpData.email,
    otp: otpData.otp,
    session_token: otpData.sessionToken
  };
  
  const result = await apiCall('/verify-login-otp', 'POST', payload) as AuthResponse;
  
  if (result.success && result.data?.token) {
    setAuthToken(result.data.token);
    setSessionToken(null); // Clear login session token
  }
  
  return result;
};

// Resend login OTP
export const resendLoginOTP = async (resendData: ResendOTPData): Promise<ApiResponse> => {
  const payload = {
    email: resendData.email,
    session_token: resendData.sessionToken
  };
  return await apiCall('/resend-login-otp', 'POST', payload);
};


// Google OAuth functions
export const getGoogleAuthUrl = async (redirectTo?: string): Promise<ApiResponse> => {
  return await apiCall('/auth/google/config', 'GET');
};

export const initiateGoogleLogin = async (redirectTo?: string): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  if (redirectTo) {
    params.append('redirect_to', redirectTo);
  }
  return await apiCall(`/auth/google/redirect?${params.toString()}`, 'GET');
};

export const handleGoogleCallback = async (code: string, state?: string): Promise<AuthResponse> => {
  const payload: any = { code };
  if (state) {
    payload.state = state;
  }
  
  const result = await apiCall('/auth/google/callback', 'POST', payload) as AuthResponse;
  
  if (result.success && result.data?.token) {
    setAuthToken(result.data.token);
  }
  
  return result;
};

export const homeData = async (): Promise<ApiResponse> => {
  return await apiCall('/home', 'GET');
}
