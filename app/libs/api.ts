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
  session_token?: string; 
  token?: string;
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

// Store simple user object for quick UI reads (header, profile preview)
export const getUser = (): any | null => {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
  }
  return null;
};

export const setUser = (user: any | null): void => {
  if (typeof window !== 'undefined') {
    if (user) {
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch {
          // ignore
        }
    } else {
      localStorage.removeItem('user');
    }
  }
};

export const clearUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

// Generic API call function
export const apiCall = async (endpoint: string, method: string = 'GET', data: any = null): Promise<ApiResponse> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get appropriate token
  const sessionToken = getSessionPayloadToken();
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  // Add session token to request body for POST/PUT requests
  if (data && (method === 'POST' || method === 'PUT')) {
    const requestData = { ...data };
    if (sessionToken && !requestData.session_token) {
      requestData.session_token = sessionToken;
    }
    options.body = JSON.stringify(requestData);
  }

  // Add session token to URL for GET requests
  let finalUrl = url;
  if (method === 'GET' && sessionToken) {
    const separator = url.includes('?') ? '&' : '?';
    finalUrl = `${url}${separator}session_token=${encodeURIComponent(sessionToken)}`;
  }

  try {
    const response = await fetch(finalUrl, options);
    const result = await response.json();
    
    // Store session token if provided in response (for guest users)
    if (result.session_token) {
      setGuestToken(result.session_token);
    }
    
    // Store auth token if provided
    if (result.data?.token) {
      setAuthToken(result.data.token);
    }
    
    // Store user data if provided
    if (result.data?.user) {
      setUser(result.data.user);
    }

    // Handle session expiration specifically
    if (response.status === 410 && result.message?.includes('session expired')) {
      clearSessionToken();
      throw new Error('REGISTRATION_SESSION_EXPIRED');
    }

    // Handle invalid / expired auth tokens
    const msg = (result.message || '').toString();
    const lower = msg.toLowerCase();
    const invalidAuthIndicators = [
      'invalid token',
      'signature verification failed',
      'token expired',
      'expired token',
      'unauthenticated',
      'invalid or expired token'
    ];

    if (response.status === 401 || invalidAuthIndicators.some(ind => lower.includes(ind))) {
      // Clear client-side tokens and user so UI updates
      try {
        clearAuthToken();
        clearSessionToken();
        clearUser();
      } catch {}

      // Notify same-tab listeners (header) and other windows
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('authInvalid', { detail: { message: result.message } }));
          try { localStorage.setItem('auth_invalid_at', String(Date.now())); } catch {}
        }
      } catch {}

      throw new Error(result.message || 'Authentication failed');
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
    setUser(result.data.user ?? null);
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
  clearUser();
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
    setUser(result.data.user ?? null);
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
// export const getGoogleAuthUrl = async (redirectTo?: string): Promise<ApiResponse> => {
//   return await apiCall('/auth/google/config', 'GET');
// };

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
    setUser(result.data.user ?? null);
  }
  
  return result;
};

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const homeData = async (): Promise<ApiResponse> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/home`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export const getGuestToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('guest_token');
  }
  return null;
};

export const setGuestToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('guest_token', token);
  }
};

export const clearGuestToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('guest_token');
  }
};

// Enhanced session token getter
export const getSessionPayloadToken = (): string | null => {
  const auth = getAuthToken();
  if (auth) return auth;
  
  const guest = getGuestToken();
  if (guest) return guest;
  
  return getSessionToken();
};


// Helper to pick a session token for backend endpoints (prefer auth token, fallback to session token)
// export const getSessionPayloadToken = (): string | null => {
//   const auth = getAuthToken();
//   if (auth) return auth;
//   return getSessionToken();
// };

// Cart API helpers
export const addToCartBySlug = async (slug: string, capId?: number | null, threadId?: number | null): Promise<ApiResponse> => {
  const sessionToken = getSessionPayloadToken();
  const payload: any = { session_token: sessionToken };
  if (capId) payload.cap_id = capId;
  if (threadId) payload.thread_id = threadId;

  const res = await apiCall(`/cart/add/${encodeURIComponent(slug)}`, 'POST', payload);
  
  // Store the session token if returned (for guest users)
  if (res.session_token) {
    setGuestToken(res.session_token);
  }
  
  try {
    if (res && (res.success || (res as any).status === true)) {
      notifyCountsUpdated();
      try { syncCartToLocalStorage(res); } catch {}
      try { notifyOpenCartDrawer(); } catch {}
    }
  } catch {}
  return res;
};

export const singleAddToCart = async (data: { slug: string; quantity: number; total_price: number; selected_cap?: number | null; selected_thread?: number | null }): Promise<ApiResponse> => {
  const sessionToken = getSessionPayloadToken();
  const payload: any = {
    slug: data.slug,
    quantity: data.quantity,
    total_price: data.total_price,
    session_token: sessionToken,
  };
  if (data.selected_cap) payload.selected_cap = data.selected_cap;
  if (data.selected_thread) payload.selected_thread = data.selected_thread;

  const res = await apiCall('/cart/add', 'POST', payload);
  
  // Store the session token if returned (for guest users)
  if (res.session_token) {
    setGuestToken(res.session_token);
  }
  
  try {
    if (res && (res.success || (res as any).status === true)) {
      notifyCountsUpdated();
      try { syncCartToLocalStorage(res); } catch {}
      try { notifyOpenCartDrawer(); } catch {}
    }
  } catch {}
  return res;
};

export const migrateGuestCart = async (guestToken: string, userId: number): Promise<ApiResponse> => {
  return await apiCall('/cart/migrate', 'POST', {
    guest_token: guestToken,
    user_id: userId
  });
};

export const removeFromCart = async (cartItemId: number): Promise<ApiResponse> => {
  try {
    const sessionToken = getSessionPayloadToken();
    
    if (!sessionToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const response = await fetch(`${API_BASE_URL}/cart/remove/${cartItemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_token: sessionToken })
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
      }
      
      return {
        success: false,
        message: result.message || 'Failed to remove item from cart'
      };
    }

    // Notify about cart update
    if (result.success) {
      notifyCountsUpdated();
      try { syncCartToLocalStorage(result); } catch {}
    }

    return result;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to remove item from cart'
    };
  }
};



// Clear entire cart
export const clearCart = async (): Promise<ApiResponse> => {
  try {
    const sessionToken = getSessionPayloadToken();
    
    if (!sessionToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_token: sessionToken })
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
      }
      
      return {
        success: false,
        message: result.message || 'Failed to clear cart'
      };
    }

    // Notify about cart update
    if (result.success) {
      notifyCountsUpdated();
      try { 
        localStorage.removeItem('rudraksha_cart'); 
      } catch {}
    }

    return result;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to clear cart'
    };
  }
};
export const updateCartQuantity = async (cartItemId: number, quantity: number): Promise<ApiResponse> => {
  try {
    const sessionToken = getSessionPayloadToken();
    
    if (!sessionToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const response = await fetch(`${API_BASE_URL}/cart/update-quantity/${cartItemId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        quantity: quantity,
        session_token: sessionToken 
      })
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
      }
      
      return {
        success: false,
        message: result.message || 'Failed to update cart quantity'
      };
    }

    // Notify about cart update if successful
    if (result.success) {
      notifyCountsUpdated();
      try { syncCartToLocalStorage(result); } catch {}
    }

    return result;
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update cart quantity'
    };
  }
};

// Notify other parts of the app that counts updated
const notifyCountsUpdated = () => {
  try {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('countsUpdated'));
    }
  } catch {
    // ignore
  }
};

// Also allow opening the cart drawer explicitly
const notifyOpenCartDrawer = () => {
  try {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('openCartDrawer'));
    }
  } catch {}
};

// Sync server cart items into localStorage key used by cart page
const syncCartToLocalStorage = (res: any) => {
  try {
    if (typeof window === 'undefined') return;
    if (!res) return;
    const data = res.data || res;
    // prefer cart_items from server payload
    if (Array.isArray(data.cart_items)) {
      try { localStorage.setItem('rudraksha_cart', JSON.stringify(data.cart_items)); } catch {}
    } else if (Array.isArray(data)) {
      try { localStorage.setItem('rudraksha_cart', JSON.stringify(data)); } catch {}
    }
  } catch {}
};

export const getCart = async (): Promise<ApiResponse> => {
  try {
    const sessionToken = getSessionPayloadToken();
    
    if (!sessionToken) {
      // Create a guest token if none exists
      const guestToken = 'guest_' + Date.now();
      setGuestToken(guestToken);
    }

    // Try POST request first (more reliable for tokens)
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ session_token: getSessionPayloadToken() })
    });

    const result = await response.json();
    
    // Store session token if returned
    if (result.session_token) {
      setGuestToken(result.session_token);
    }
    
    // Handle specific error cases
    if (!response.ok) {
      if (response.status === 401) {
        // Clear invalid tokens
        clearAuthToken();
        clearSessionToken();
        clearUser();
        clearGuestToken();
        
        // Notify about auth invalidation
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('authInvalid'));
        }
      }
      
      return {
        success: false,
        message: result.message || `HTTP error! status: ${response.status}`,
        data: null
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching cart:', error);
    
    // Fallback to GET request if POST fails
    try {
      const sessionToken = getSessionPayloadToken();
      if (sessionToken) {
        const getResponse = await fetch(`${API_BASE_URL}/cart?session_token=${encodeURIComponent(sessionToken)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (getResponse.ok) {
          const result = await getResponse.json();
          if (result.session_token) {
            setGuestToken(result.session_token);
          }
          return result;
        }
      }
    } catch (fallbackError) {
      console.error('Fallback GET also failed:', fallbackError);
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch cart',
      data: null
    };
  }
};



export const fetchWishlist = async (): Promise<ApiResponse> => {
  try {
    const sessionToken = getSessionPayloadToken();
    if (!sessionToken) {
      return { success: false, message: 'Not authenticated', data: null };
    }
    
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Accept': 'application/json',
      },
    });
    
    return await response.json();
  } catch {
    return { success: false, message: 'Failed to fetch wishlist', data: null };
  }
};

export const addToWishlistApi = async (payload: { product_id?: number; slug?: string }): Promise<ApiResponse> => {
  const sessionToken = getSessionPayloadToken();
  if (!sessionToken) {
    return { success: false, message: 'Not authenticated', data: null };
  }
  
  const body: any = { session_token: sessionToken };
  if (payload.product_id) body.product_id = payload.product_id;
  if (payload.slug) body.slug = payload.slug;

  return await apiCall('/wishlist/add', 'POST', body);
};

export const addToWishlistApiWithNotify = async (payload: { product_id?: number; slug?: string }): Promise<ApiResponse> => {
  try {
    const response = await addToWishlistApi(payload);
    
    // Check for success or specific message that indicates a change (e.g., item added/removed)
    if (response.success || response.message?.includes('wishlist')) {
      // Dispatch a generic event for client-side components (like headers or wishlist icons) to react
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        }
      } catch {}
    }
    return response;

  } catch (error) {
    console.error('Error in addToWishlistApiWithNotify:', error);
    return { success: false, message: 'Failed to update wishlist status', data: null };
  }
};

export const getWishlistCount = async (): Promise<ApiResponse> => {
  try {
    const sessionToken = getSessionPayloadToken();
    if (!sessionToken) {
      return { success: false, message: 'Not authenticated', data: null };
    }
    
    const response = await fetch(`${API_BASE_URL}/wishlist/count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Accept': 'application/json',
      },
    });
    
    return await response.json();
  } catch {
    return { success: false, message: 'Failed to get wishlist count', data: null };
  }
};

export interface CatInfo {
  id: number;
  title: string;
  slug: string;
  main_category: string; 
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  oldPrice: number;
  rating: number;
  discount: number;
  stock: number;
  photo: string;
  images?: string[];
  photos?: string[];
  image?: string;
  category: string;
  isNew: boolean;
  isBestSeller: boolean;
  tags: string[];
  createdAt?: string;
  reviews_avg_rate?: number;
  reviews_count?: number;
  cat_info?: CatInfo;
  sub_cat_info?: CatInfo;
}

export interface RecentProduct{

  id: number;
  title: string;
  slug: string;
  price: number;
  oldPrice: number;
  rating: number;
  discount: number;
  stock: number;
  photo: string;
  images?: string[];
  photos?: string[];
  image?: string;
  category: string;
  isNew: boolean;
  isBestSeller: boolean;
  tags: string[];
  createdAt?: string;
  reviews_avg_rate?: number;
  reviews_count?: number;

}

export interface ProductsApiResponse {
  success: boolean;
  message: string;
  products: Product[];
  recent_products: RecentProduct[];
}
// In your libs/api.ts - Fix the fetchProducts function
export const fetchProducts = async (): Promise<ProductsApiResponse> => {
  try {
    const response = await apiCall(`/product-grids`, 'GET');
    
    console.log('API Response:', response); // Debug log
    
    // Handle different possible response structures
    let products: Product[] = [];
    let recent_products: RecentProduct[] = [];

    // Check if data exists and has the expected structure
    if (response.data) {
      // Try different possible structures
      if (Array.isArray(response.data.products)) {
        products = response.data.products;
      } else if (Array.isArray(response.data)) {
        products = response.data;
      }
      
      if (Array.isArray(response.data.recent_products)) {
        recent_products = response.data.recent_products;
      }
    }

    // If no products found in data, check the root level (some API variants return arrays at root)
    const respAny = response as any;
    if (products.length === 0 && Array.isArray(respAny.products)) {
      products = respAny.products;
    }
    if (recent_products.length === 0 && Array.isArray(respAny.recent_products)) {
      recent_products = respAny.recent_products;
    }

    return {
      success: response.success !== false, // Default to true if not specified
      message: response.message || 'Products fetched successfully',
      products,
      recent_products,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch products',
      products: [],
      recent_products: [],
    };
  }
};




export interface ProductDetails {
  id: number;
  title: string;
  slug: string;
  price: number;
  oldPrice: number;
  rating: number;
  discount: number;
  stock: number;
  photo: string;
  images?: string[];
  photos?: string[];
  image?: string;
  videos?: string[];
  category: string;
  isNew: boolean;
  isBestSeller: boolean;
  tags: string[];
  description: string;
  specifications?: {
    material: string;
    origin: string;
    mukhi: string;
    size: string;
    color: string;
    weight: string;
    natural: boolean;
    benefits: string[];
  };
  summary: string;
  createdAt?: string;
  reviews_avg_rate?: number;
  reviews_count?: number;
}

export interface Review {
  id: number;
  productId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

export interface ProductDetailsResponse {
  success: boolean;
  message: string;
  data?: {
    product: ProductDetails;
    reviews: Review[];
    related_products: ProductDetails[];
  };
}

// Fetch product details by slug
export const fetchProductDetails = async (slug: string): Promise<ProductDetailsResponse> => {
  return await apiCall(`/product-detail/${slug}`, 'GET') as ProductDetailsResponse;
};

export const storeMessage = async (formData: any): Promise<ApiResponse> => {
  return await apiCall('/contact-messages', 'POST', formData);
};

// Order API helpers

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  amount: number;
  discount: number;
  cap_id?: number | null;
  thread_id?: number | null;
  product_images?: string;
  cap?: {
    id: number | null;
    name: string;
    price: number;
  };
  thread?: {
    id: number | null;
    name: string;
    price: number;
  };
}

export interface Order {
  id: number;
  order_number: string;
  order_date: string;
  delivery_date?: string;
  status: string;
  payment_status: string;
  payment_method: string;
  sub_total: number;
  shipping_fee: number;
  discount: number;
  total_amount: number;
  quantity: number;
  tracking_number?: string;
  address: string;
  products_details: OrderItem[];
  created_at: string;
  updated_at: string;
  payment?: {
    transaction_id: string;
    status: string;
    payment_method: string;
  };
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data?: {
    data: Order[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data?: Order;
}

export interface CreateOrderData {
  address_id: number;
  payment_method: 'cod' | 'cardpay' | 'razorpay' | 'upi';
  coupon_code?: string;
  card_number?: string;
  card_name?: string;
  expiration_date?: string;
  cvv?: string;
}

// Get user orders
export const getUserOrders = async (page: number = 1, perPage: number = 10): Promise<OrdersResponse> => {
  try {
    const sessionToken = getSessionPayloadToken();
    
    if (!sessionToken) {
      return {
        success: false,
        message: 'Authentication required',
        data: undefined
      };
    }

    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString()
    });

    const response = await fetch(`${API_BASE_URL}/orders?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
      }
      
      return {
        success: false,
        message: result.message || 'Failed to fetch orders',
        data: undefined
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch orders',
      data: undefined
    };
  }
};

// Get order details by ID
export const getOrderDetails = async (orderId: number): Promise<OrderResponse> => {
  try {
    const sessionToken = getSessionPayloadToken();
    
    if (!sessionToken) {
      return {
        success: false,
        message: 'Authentication required',
        data: undefined
      };
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
      }
      
      if (response.status === 404) {
        return {
          success: false,
          message: 'Order not found',
          data: undefined
        };
      }
      
      return {
        success: false,
        message: result.message || 'Failed to fetch order details',
        data: undefined
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching order details:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch order details',
      data: undefined
    };
  }
};

// Create new order
export const createOrder = async (orderData: CreateOrderData): Promise<OrderResponse> => {
  try {
    const sessionToken = getSessionPayloadToken();
    
    if (!sessionToken) {
      return {
        success: false,
        message: 'Authentication required',
        data: undefined
      };
    }

    const response = await fetch(`${API_BASE_URL}/orders/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
      }
      
      return {
        success: false,
        message: result.message || 'Failed to create order',
        data: undefined
      };
    }

    // Clear cart on successful order
    if (result.success) {
      try {
        localStorage.removeItem('rudraksha_cart');
        notifyCountsUpdated();
      } catch (e) {
        console.error('Error clearing cart after order:', e);
      }
    }

    return result;
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create order',
      data: undefined
    };
  }
};

// Track order by order number
export const trackOrder = async (orderNumber: string): Promise<OrderResponse> => {
  try {
    const sessionToken = getSessionPayloadToken();
    
    if (!sessionToken) {
      return {
        success: false,
        message: 'Authentication required',
        data: undefined
      };
    }

    const response = await fetch(`${API_BASE_URL}/orders/track/${orderNumber}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
      }
      
      if (response.status === 404) {
        return {
          success: false,
          message: 'Order not found',
          data: undefined
        };
      }
      
      return {
        success: false,
        message: result.message || 'Failed to track order',
        data: undefined
      };
    }

    return result;
  } catch (error) {
    console.error('Error tracking order:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to track order',
      data: undefined
    };
  }
};

// Cancel order
export const cancelOrder = async (orderId: number): Promise<ApiResponse> => {
  try {
    const sessionToken = getSessionPayloadToken();
    
    if (!sessionToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_token: sessionToken })
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
      }
      
      return {
        success: false,
        message: result.message || 'Failed to cancel order'
      };
    }

    return result;
  } catch (error) {
    console.error('Error cancelling order:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to cancel order'
    };
  }
};

// Download order invoice
export const downloadOrderInvoice = async (orderId: number): Promise<Blob> => {
  try {
    const sessionToken = getSessionPayloadToken();
    
    if (!sessionToken) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/invoice`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
        throw new Error('Authentication failed');
      }
      throw new Error('Failed to download invoice');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error downloading invoice:', error);
    throw error;
  }
};

// Get order statistics
export const getOrderStatistics = async (): Promise<ApiResponse> => {
  try {
    const sessionToken = getSessionPayloadToken();
    
    if (!sessionToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const response = await fetch(`${API_BASE_URL}/orders/statistics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
      }
      
      return {
        success: false,
        message: result.message || 'Failed to fetch order statistics'
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch order statistics'
    };
  }
};

// Reorder functionality
export const reorder = async (orderId: number): Promise<ApiResponse> => {
  try {
    const sessionToken = getSessionPayloadToken();
    
    if (!sessionToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/reorder`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_token: sessionToken })
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
      }
      
      return {
        success: false,
        message: result.message || 'Failed to reorder'
      };
    }

    // If reorder successful, update cart counts
    if (result.success) {
      notifyCountsUpdated();
    }

    return result;
  } catch (error) {
    console.error('Error reordering:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to reorder'
    };
  }
};

// Helper function to format order status for display
export const formatOrderStatus = (status: string): { text: string; color: string; icon: string } => {
  switch (status.toLowerCase()) {
    case 'new':
      return { text: 'New', color: 'bg-blue-100 text-blue-800', icon: '🆕' };
    case 'pending':
      return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' };
    case 'processing':
      return { text: 'Processing', color: 'bg-purple-100 text-purple-800', icon: '⚙️' };
    case 'shipped':
      return { text: 'Shipped', color: 'bg-indigo-100 text-indigo-800', icon: '🚚' };
    case 'delivered':
      return { text: 'Delivered', color: 'bg-green-100 text-green-800', icon: '✅' };
    case 'cancelled':
      return { text: 'Cancelled', color: 'bg-red-100 text-red-800', icon: '❌' };
    case 'refunded':
      return { text: 'Refunded', color: 'bg-gray-100 text-gray-800', icon: '💸' };
    default:
      return { text: status, color: 'bg-gray-100 text-gray-800', icon: '📦' };
  }
};

// Helper function to format payment status
export const formatPaymentStatus = (status: string): { text: string; color: string } => {
  switch (status.toLowerCase()) {
    case 'paid':
      return { text: 'Paid', color: 'bg-green-100 text-green-800' };
    case 'unpaid':
      return { text: 'Unpaid', color: 'bg-red-100 text-red-800' };
    case 'pending':
      return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
    case 'refunded':
      return { text: 'Refunded', color: 'bg-blue-100 text-blue-800' };
    case 'failed':
      return { text: 'Failed', color: 'bg-red-100 text-red-800' };
    default:
      return { text: status, color: 'bg-gray-100 text-gray-800' };
  }
};


// Add these interfaces for comments
export interface CommentUser {
  id: number;
  name: string;
  email: string;
}

export interface CommentPost {
  id: number;
  title: string;
  slug: string;
}

export interface Comment {
  id: number;
  comment: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  user_id: number;
  post_id: number;
  user?: CommentUser;
  post?: CommentPost;
}

export interface CommentsResponse {
  success: boolean;
  message: string;
  data: Comment[];
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data?: Comment;
}

// Update the getUserComments function to handle different response structures
export const getUserComments = async (): Promise<CommentsResponse> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required. Please log in.',
        data: []
      };
    }

    const response = await fetch(`${API_BASE_URL}/user/comments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Clear invalid tokens
        clearAuthToken();
        clearSessionToken();
        clearUser();
        
        // Notify about auth invalidation
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('authInvalid'));
        }
        
        return {
          success: false,
          message: 'Authentication failed. Please log in again.',
          data: []
        };
      }
      
      return {
        success: false,
        message: result.message || 'Failed to fetch your comments',
        data: []
      };
    }

    // Handle different response structures
    let commentsData: Comment[] = [];
    
    if (result.data) {
      // If data is an array, use it directly
      if (Array.isArray(result.data)) {
        commentsData = result.data;
      } 
      // If data has a data property that's an array (nested structure)
      else if (result.data.data && Array.isArray(result.data.data)) {
        commentsData = result.data.data;
      }
      // If data has a comments property that's an array
      else if (result.data.comments && Array.isArray(result.data.comments)) {
        commentsData = result.data.comments;
      }
    } 
    // If the response itself is an array
    else if (Array.isArray(result)) {
      commentsData = result;
    }
    // If result has a data array at root level
    else if (result.comments && Array.isArray(result.comments)) {
      commentsData = result.comments;
    }

    return {
      success: true,
      message: result.message || 'Comments fetched successfully',
      data: commentsData
    };

  } catch (error) {
    console.error('Error fetching user comments:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch comments',
      data: []
    };
  }
};

// Update user comment with JWT
export const updateUserComment = async (commentId: number, commentData: { comment: string }): Promise<CommentResponse> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const response = await fetch(`${API_BASE_URL}/user/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData)
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
        
        return {
          success: false,
          message: 'Authentication failed. Please log in again.'
        };
      }
      
      if (response.status === 422) {
        const errorMessages = result.errors ? Object.values(result.errors).flat().join(', ') : result.message;
        return {
          success: false,
          message: errorMessages || 'Validation failed'
        };
      }
      
      if (response.status === 404) {
        return {
          success: false,
          message: result.message || 'Comment not found or you are not authorized to update it'
        };
      }
      
      return {
        success: false,
        message: result.message || 'Failed to update comment'
      };
    }

    return result;
  } catch (error) {
    console.error('Error updating comment:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update comment'
    };
  }
};

// Delete user comment with JWT
export const deleteUserComment = async (commentId: number): Promise<CommentResponse> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const response = await fetch(`${API_BASE_URL}/user/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
        
        return {
          success: false,
          message: 'Authentication failed. Please log in again.'
        };
      }
      
      if (response.status === 404) {
        return {
          success: false,
          message: result.message || 'Comment not found or you are not authorized to delete it'
        };
      }
      
      return {
        success: false,
        message: result.message || 'Failed to delete comment'
      };
    }

    return result;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete comment'
    };
  }
};

// Get comment statistics for user
export const getCommentStatistics = async (): Promise<ApiResponse> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const response = await fetch(`${API_BASE_URL}/user/comments/statistics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
      }
      
      return {
        success: false,
        message: result.message || 'Failed to fetch comment statistics'
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching comment statistics:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch comment statistics'
    };
  }
};


export interface ReviewProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
}

export interface Review {
  id: number;
  product: ReviewProduct;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  reply: {
    from: string;
    comment: string;
    date: string;
  } | null;
}

export interface ReviewsResponse {
  success: boolean;
  message: string;
  data?: {
    data: Review[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data?: Review;
}

export interface ReviewStatistics {
  total_reviews: number;
  average_rating: number;
  pending_reviews: number;
  published_reviews: number;
}

export interface CreateReviewData {
  product_slug: string;
  rate: number;
  review: string;
  title?: string;
  photos?: File[];
}

export interface UpdateReviewData {
  rate: number;
  review: string;
  title?: string;
  photos?: File[];
  existing_images?: string[];
}

// Get user reviews
export const getUserReviews = async (page: number = 1, perPage: number = 10): Promise<ReviewsResponse> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required. Please log in.',
        data: undefined
      };
    }

    const response = await fetch(`${API_BASE_URL}/reviews?page=${page}&per_page=${perPage}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Handle non-JSON responses
    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        
        // Notify about auth invalidation
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('authInvalid'));
        }
        
        return {
          success: false,
          message: 'Authentication failed. Please log in again.',
          data: undefined
        };
      }
      
      const errorText = await response.text();
      try {
        const errorResult = JSON.parse(errorText);
        return {
          success: false,
          message: errorResult.message || `HTTP error! status: ${response.status}`,
          data: undefined
        };
      } catch {
        return {
          success: false,
          message: errorText || `HTTP error! status: ${response.status}`,
          data: undefined
        };
      }
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch reviews',
      data: undefined
    };
  }
};

// Create new review
export const createReview = async (reviewData: CreateReviewData): Promise<ReviewResponse> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const formData = new FormData();
    formData.append('product_slug', reviewData.product_slug);
    formData.append('rate', reviewData.rate.toString());
    formData.append('review', reviewData.review);
    
    if (reviewData.title) {
      formData.append('title', reviewData.title);
    }

    if (reviewData.photos) {
      reviewData.photos.forEach(photo => {
        formData.append('photos[]', photo);
      });
    }

    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
        
        return {
          success: false,
          message: 'Authentication failed. Please log in again.'
        };
      }
      
      const errorText = await response.text();
      try {
        const errorResult = JSON.parse(errorText);
        
        if (response.status === 422) {
          const errorMessages = errorResult.errors ? Object.values(errorResult.errors).flat().join(', ') : errorResult.message;
          return {
            success: false,
            message: errorMessages || 'Validation failed'
          };
        }
        
        return {
          success: false,
          message: errorResult.message || 'Failed to create review'
        };
      } catch {
        return {
          success: false,
          message: errorText || 'Failed to create review'
        };
      }
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error creating review:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create review'
    };
  }
};

// Update review
export const updateReview = async (reviewId: number, reviewData: UpdateReviewData): Promise<ReviewResponse> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const formData = new FormData();
    formData.append('rate', reviewData.rate.toString());
    formData.append('review', reviewData.review);
    formData.append('_method', 'PUT');
    
    if (reviewData.title) {
      formData.append('title', reviewData.title);
    }

    if (reviewData.existing_images) {
      reviewData.existing_images.forEach(image => {
        formData.append('existing_images[]', image);
      });
    }

    if (reviewData.photos) {
      reviewData.photos.forEach(photo => {
        formData.append('photos[]', photo);
      });
    }

    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'POST', // Using POST with _method=PUT for file uploads
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
        
        return {
          success: false,
          message: 'Authentication failed. Please log in again.'
        };
      }
      
      const errorText = await response.text();
      try {
        const errorResult = JSON.parse(errorText);
        
        if (response.status === 422) {
          const errorMessages = errorResult.errors ? Object.values(errorResult.errors).flat().join(', ') : errorResult.message;
          return {
            success: false,
            message: errorMessages || 'Validation failed'
          };
        }
        
        if (response.status === 404) {
          return {
            success: false,
            message: errorResult.message || 'Review not found'
          };
        }
        
        return {
          success: false,
          message: errorResult.message || 'Failed to update review'
        };
      } catch {
        return {
          success: false,
          message: errorText || 'Failed to update review'
        };
      }
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error updating review:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update review'
    };
  }
};

// Delete review
export const deleteReview = async (reviewId: number): Promise<ReviewResponse> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
        
        return {
          success: false,
          message: 'Authentication failed. Please log in again.'
        };
      }
      
      const errorText = await response.text();
      try {
        const errorResult = JSON.parse(errorText);
        
        if (response.status === 404) {
          return {
            success: false,
            message: errorResult.message || 'Review not found'
          };
        }
        
        return {
          success: false,
          message: errorResult.message || 'Failed to delete review'
        };
      } catch {
        return {
          success: false,
          message: errorText || 'Failed to delete review'
        };
      }
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error deleting review:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete review'
    };
  }
};

// Get review statistics
export const getReviewStatistics = async (): Promise<ApiResponse & { data?: ReviewStatistics }> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const response = await fetch(`${API_BASE_URL}/reviews/statistics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
        
        return {
          success: false,
          message: 'Authentication failed. Please log in again.'
        };
      }
      
      const errorText = await response.text();
      try {
        const errorResult = JSON.parse(errorText);
        return {
          success: false,
          message: errorResult.message || 'Failed to fetch review statistics'
        };
      } catch {
        return {
          success: false,
          message: errorText || 'Failed to fetch review statistics'
        };
      }
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error fetching review statistics:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch review statistics'
    };
  }
};

// Delete review image
export const deleteReviewImage = async (reviewId: number, imageUrl: string): Promise<ReviewResponse> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const response = await fetch(`${API_BASE_URL}/reviews/delete-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        review_id: reviewId,
        image_url: imageUrl
      })
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
        
        return {
          success: false,
          message: 'Authentication failed. Please log in again.'
        };
      }
      
      const errorText = await response.text();
      try {
        const errorResult = JSON.parse(errorText);
        
        if (response.status === 404) {
          return {
            success: false,
            message: errorResult.message || 'Review or image not found'
          };
        }
        
        return {
          success: false,
          message: errorResult.message || 'Failed to delete image'
        };
      } catch {
        return {
          success: false,
          message: errorText || 'Failed to delete image'
        };
      }
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error deleting review image:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete image'
    };
  }
};

// User Profile Interfaces
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  date_of_birth?: string;
  gender?: string;
  avatar?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  member_since: string;
  total_orders: number;
  completed_orders: number;
  pending_orders: number;
  total_spent: number;
  loyalty_points: number;
  membership_tier: string;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data?: {
    profile: UserProfile;
    stats: UserStats;
  };
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  mobile?: string;
  date_of_birth?: string;
  gender?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

// User Profile API functions
export const getUserProfile = async (): Promise<UserProfileResponse> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required. Please log in.',
      };
    }

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
        
        return {
          success: false,
          message: 'Authentication failed. Please log in again.',
        };
      }
      
      return {
        success: false,
        message: result.message || 'Failed to fetch profile',
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch profile',
    };
  }
};

export const updateUserProfile = async (profileData: UpdateProfileData): Promise<UserProfileResponse> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required',
      };
    }

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData)
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
        
        return {
          success: false,
          message: 'Authentication failed. Please log in again.',
        };
      }
      
      if (response.status === 422) {
        const errorMessages = result.errors ? Object.values(result.errors).flat().join(', ') : result.message;
        return {
          success: false,
          message: errorMessages || 'Validation failed',
        };
      }
      
      return {
        success: false,
        message: result.message || 'Failed to update profile',
      };
    }

    // Update local user data if successful
    if (result.success && result.data?.profile) {
      setUser(result.data.profile);
    }

    return result;
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update profile',
    };
  }
};

export const changePassword = async (passwordData: ChangePasswordData): Promise<ApiResponse> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required',
      };
    }

    const response = await fetch(`${API_BASE_URL}/user/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData)
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
        
        return {
          success: false,
          message: 'Authentication failed. Please log in again.',
        };
      }
      
      if (response.status === 422) {
        const errorMessages = result.errors ? Object.values(result.errors).flat().join(', ') : result.message;
        return {
          success: false,
          message: errorMessages || 'Validation failed',
        };
      }
      
      return {
        success: false,
        message: result.message || 'Failed to change password',
      };
    }

    return result;
  } catch (error) {
    console.error('Error changing password:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to change password',
    };
  }
};


// Address interfaces
export interface Address {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  address_line_1: string;
  address_line_2?: string;
  postal_code: string;
  address_type: 'home' | 'work' | 'other';
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  address_line_1: string;
  address_line_2?: string;
  postal_code: string;
  address_type: 'home' | 'work' | 'other';
  is_default: boolean;
}

export interface AddressesResponse {
  success: boolean;
  message: string;
  data: Address[];
}

export interface AddressResponse {
  success: boolean;
  message: string;
  data?: Address;
}

export interface CountriesResponse {
  success: boolean;
  message: string;
  data: { [key: string]: string };
}

export interface IndianStatesResponse {
  success: boolean;
  message: string;
  data: { [key: string]: string[] };
}

// Address API functions
export const getUserAddresses = async (): Promise<AddressesResponse> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required. Please log in.',
        data: []
      };
    }

    const response = await fetch(`${API_BASE_URL}/addresses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
        
        return {
          success: false,
          message: 'Authentication failed. Please log in again.',
          data: []
        };
      }
      
      return {
        success: false,
        message: result.message || 'Failed to fetch addresses',
        data: []
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch addresses',
      data: []
    };
  }
};

export const createAddress = async (addressData: AddressFormData): Promise<AddressResponse> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const response = await fetch(`${API_BASE_URL}/addresses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData)
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
        
        return {
          success: false,
          message: 'Authentication failed. Please log in again.'
        };
      }
      
      if (response.status === 422) {
        const errorMessages = result.errors ? Object.values(result.errors).flat().join(', ') : result.message;
        return {
          success: false,
          message: errorMessages || 'Validation failed'
        };
      }
      
      return {
        success: false,
        message: result.message || 'Failed to create address'
      };
    }

    return result;
  } catch (error) {
    console.error('Error creating address:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create address'
    };
  }
};

export const updateAddress = async (addressId: number, addressData: AddressFormData): Promise<AddressResponse> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData)
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
        
        return {
          success: false,
          message: 'Authentication failed. Please log in again.'
        };
      }
      
      if (response.status === 422) {
        const errorMessages = result.errors ? Object.values(result.errors).flat().join(', ') : result.message;
        return {
          success: false,
          message: errorMessages || 'Validation failed'
        };
      }
      
      if (response.status === 404) {
        return {
          success: false,
          message: result.message || 'Address not found'
        };
      }
      
      return {
        success: false,
        message: result.message || 'Failed to update address'
      };
    }

    return result;
  } catch (error) {
    console.error('Error updating address:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update address'
    };
  }
};

export const deleteAddress = async (addressId: number): Promise<AddressResponse> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
        
        return {
          success: false,
          message: 'Authentication failed. Please log in again.'
        };
      }
      
      if (response.status === 404) {
        return {
          success: false,
          message: result.message || 'Address not found'
        };
      }
      
      return {
        success: false,
        message: result.message || 'Failed to delete address'
      };
    }

    return result;
  } catch (error) {
    console.error('Error deleting address:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete address'
    };
  }
};

export const setDefaultAddress = async (addressId: number): Promise<AddressResponse> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const response = await fetch(`${API_BASE_URL}/addresses/${addressId}/set-default`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
        
        return {
          success: false,
          message: 'Authentication failed. Please log in again.'
        };
      }
      
      if (response.status === 404) {
        return {
          success: false,
          message: result.message || 'Address not found'
        };
      }
      
      return {
        success: false,
        message: result.message || 'Failed to set default address'
      };
    }

    return result;
  } catch (error) {
    console.error('Error setting default address:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to set default address'
    };
  }
};

export const getCountries = async (): Promise<CountriesResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/addresses/countries`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to fetch countries',
        data: {}
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch countries',
      data: {}
    };
  }
};

export const getIndianStates = async (): Promise<IndianStatesResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/addresses/indian-states`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to fetch states',
        data: {}
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching states:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch states',
      data: {}
    };
  }
};

// Coupon interfaces
export interface Coupon {
  id: number;
  code: string;
  type: 'fixed' | 'percent';
  discount_value: number;
  discount_amount: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  description?: string;
}

export interface ApplyCouponResponse {
  success: boolean;
  message: string;
  data?: Coupon;
  calculated?: {
    cart_total: number;
    discount: number;
    new_total: number;
  };
}

export interface AvailableCouponsResponse {
  success: boolean;
  message: string;
  data?: Coupon[];
}

// Coupon API functions
export const applyCoupon = async (code: string): Promise<ApplyCouponResponse> => {
  try {
    const sessionToken = getSessionPayloadToken();
    
    if (!sessionToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const response = await fetch(`${API_BASE_URL}/coupons/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        code: code.toUpperCase(),
        session_token: sessionToken
      })
    });

    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
      }
      
      return {
        success: false,
        message: result.message || 'Failed to apply coupon'
      };
    }

    return result;
  } catch (error) {
    console.error('Error applying coupon:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to apply coupon'
    };
  }
};

export const removeCoupon = async (): Promise<ApplyCouponResponse> => {
  try {
    const sessionToken = getSessionPayloadToken();
    
    if (!sessionToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

    const response = await fetch(`${API_BASE_URL}/coupons/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        session_token: sessionToken
      })
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        clearSessionToken();
        clearUser();
        window.dispatchEvent(new CustomEvent('authInvalid'));
      }
      
      return {
        success: false,
        message: result.message || 'Failed to remove coupon'
      };
    }

    return result;
  } catch (error) {
    console.error('Error removing coupon:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to remove coupon'
    };
  }
};

export const validateCoupon = async (code: string, cartTotal: number): Promise<ApplyCouponResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        code: code.toUpperCase(),
        cart_total: cartTotal
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Invalid coupon'
      };
    }

    return result;
  } catch (error) {
    console.error('Error validating coupon:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to validate coupon'
    };
  }
};

export const getAvailableCoupons = async (): Promise<AvailableCouponsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons/available`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to fetch available coupons'
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching available coupons:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch available coupons'
    };
  }
};


export const createRazorpayOrder = async (data: {
  address_id: number;
  coupon_code?: string;
  referral_code?: string;
}) => {

  const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payments/create-razorpay-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  });
  console.log("razorpay respone", response);
  return response.json();
};

// Verify payment and complete order
export const verifyPaymentAndCompleteOrder = async (data: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  order_id: number;
}) => {
    const authToken = getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};