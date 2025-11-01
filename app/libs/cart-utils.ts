import { addToCartBySlug } from "./api";

// libs/cart-utils.ts
export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  category: string;
  slug: string;
  cap_id?: number;
  thread_id?: number;
}

// Guest cart management
export const getGuestCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const cart = localStorage.getItem('guest_cart');
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const saveGuestCart = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('guest_cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving guest cart:', error);
  }
};

export const clearGuestCart = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('guest_cart');
  } catch (error) {
    console.error('Error clearing guest cart:', error);
  }
};

// Transfer guest cart to user
export const transferGuestCartToUser = async (userId: number): Promise<void> => {
  const guestCart = getGuestCart();
  
  if (guestCart.length === 0) return;

  try {
    // Add each item to user's cart via API
    for (const item of guestCart) {
      await addToCartBySlug(item.slug, item.cap_id, item.thread_id);
    }
    
    // Clear guest cart after successful transfer
    clearGuestCart();
  } catch (error) {
    console.error('Error transferring cart:', error);
  }
};