// libs/payment-api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.pashupatinathrudraksh.com/api';

// Create axios instance for payment APIs
const paymentApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// Add request interceptor to handle CORS preflight
paymentApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
paymentApi.interceptors.response.use(
  (response) => {
    return response.data; // Return only the data
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'Server error occurred';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred.');
    }
  }
);

export interface RazorpayOrderData {
  amount: number;
  currency: string;
}

export interface ConsultationData {
  name: string;
  email: string;
  mobile: string;
  birthPlace: string;
  dob: string;
  birthTime: string;
  astroName?: string;
  payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  amount: number;
  consultation_type: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Create Razorpay order
export const createRazorpayOrder = async (orderData: RazorpayOrderData): Promise<ApiResponse> => {
  try {
  const response = await paymentApi.post('/create-razorpay-order', orderData);
  return (response as any).data as ApiResponse;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

// Verify payment and store consultation data
export const verifyAndStoreConsultation = async (consultationData: ConsultationData): Promise<ApiResponse> => {
  try {
    // Transform field names to match Laravel backend
    const transformedData = {
      name: consultationData.name,
      email: consultationData.email,
      mobile: consultationData.mobile,
      birth_place: consultationData.birthPlace,
      date_of_birth: consultationData.dob,
      birth_time: consultationData.birthTime,
      astro_name: consultationData.astroName,
      payment_id: consultationData.payment_id,
      razorpay_order_id: consultationData.razorpay_order_id,
      razorpay_signature: consultationData.razorpay_signature,
      amount: consultationData.amount,
      consultation_type: consultationData.consultation_type
    };

  const response = await paymentApi.post('/verify-and-store-consultation', transformedData);
  return (response as any).data as ApiResponse;
  } catch (error) {
    console.error('Error verifying and storing consultation:', error);
    throw error;
  }
};