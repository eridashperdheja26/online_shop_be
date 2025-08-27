import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem, Product } from '../types';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartItemCount: () => number;
  getCartTotal: () => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await cartAPI.getUserCart(user.id);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to load cart:', error);
      // Initialize empty cart if none exists
      setCart({
        id: 0,
        userId: user.id,
        cartItems: [],
        totalPrice: 0,
        totalItems: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await cartAPI.addItem(user.id, {
        productId: product.id,
        quantity,
      });
      setCart(response.data);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await cartAPI.removeItem(user.id, cartItemId);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await cartAPI.updateItemQuantity(user.id, cartItemId, quantity);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to update item quantity:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await cartAPI.clearCart(user.id);
      setCart({
        id: 0,
        userId: user.id,
        cartItems: [],
        totalPrice: 0,
        totalItems: 0,
      });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCartItemCount = () => {
    return cart?.totalItems || 0;
  };

  const getCartTotal = () => {
    return cart?.totalPrice || 0;
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    getCartTotal,
    loading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
