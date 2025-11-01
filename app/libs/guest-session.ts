// libs/guest-session.ts
import { encodeJWT, decodeJWT, isTokenExpired } from './jwt-utils';

export interface GuestSession {
  guest_id: string;
  guest_token: string;
  created_at: number;
  expires_at: number;
  email?: string;
  cart_items: any[];
}

// Generate proper JWT token for guest
export const generateGuestToken = (guestId: string): string => {
  const payload = {
    sub: guestId,
    type: 'guest',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
    guest_id: guestId
  };
  
  return encodeJWT(payload);
};

// Get or create guest session with JWT token
export const getGuestSession = (): GuestSession => {
  if (typeof window === 'undefined') {
    const guestId = generateGuestId();
    return {
      guest_id: guestId,
      guest_token: generateGuestToken(guestId),
      created_at: Date.now(),
      expires_at: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
      cart_items: []
    };
  }

  try {
    const stored = localStorage.getItem('guest_session');
    if (stored) {
      const session: GuestSession = JSON.parse(stored);
      
      // Check if token is expired
      if (isTokenExpired(session.guest_token)) {
        // Generate new token
        const newToken = generateGuestToken(session.guest_id);
        const updatedSession = {
          ...session,
          guest_token: newToken,
          expires_at: Date.now() + (30 * 24 * 60 * 60 * 1000)
        };
        
        localStorage.setItem('guest_session', JSON.stringify(updatedSession));
        return updatedSession;
      }
      
      return session;
    }
    
    // Create new guest session
    const guestId = generateGuestId();
    const newSession: GuestSession = {
      guest_id: guestId,
      guest_token: generateGuestToken(guestId),
      created_at: Date.now(),
      expires_at: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
      cart_items: []
    };
    
    localStorage.setItem('guest_session', JSON.stringify(newSession));
    return newSession;
  } catch (error) {
    console.error('Error getting guest session:', error);
    const guestId = generateGuestId();
    return {
      guest_id: guestId,
      guest_token: generateGuestToken(guestId),
      created_at: Date.now(),
      expires_at: Date.now() + (30 * 24 * 60 * 60 * 1000),
      cart_items: []
    };
  }
};

// Update getGuestSessionToken to return JWT token
export const getGuestSessionToken = (): string => {
  const session = getGuestSession();
  return session.guest_token;
};

// Check if current session is guest
export const isGuestSession = (token?: string): boolean => {
  if (!token) {
    token = getGuestSessionToken();
  }
  
  try {
    const payload = decodeJWT(token);
    return payload?.type === 'guest';
  } catch {
    return false;
  }
};

// Rest of the functions remain the same...
export const generateGuestId = (): string => {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const updateGuestSession = (updates: Partial<GuestSession>): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const currentSession = getGuestSession();
    const updatedSession = { ...currentSession, ...updates };
    localStorage.setItem('guest_session', JSON.stringify(updatedSession));
  } catch (error) {
    console.error('Error updating guest session:', error);
  }
};

export const clearGuestSession = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('guest_session');
    localStorage.removeItem('guest_cart');
  } catch (error) {
    console.error('Error clearing guest session:', error);
  }
};