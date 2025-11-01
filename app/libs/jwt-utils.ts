// libs/jwt-utils.ts
import { jwtDecode } from 'jwt-decode';

// Simple JWT encoder (for guest tokens only)
export const encodeJWT = (payload: any, secret: string = 'guest_secret'): string => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  
  // In a real app, you'd properly sign this with HMAC
  // For demo purposes, we're creating a simple token
  const signature = btoa(secret);
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const decodeJWT = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return true;
    
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};