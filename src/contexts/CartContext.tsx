import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import * as cartService from "../services/cart-service";
import type { Cart } from "../types/cart";

interface CartContextData {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  itemCount: number;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await cartService.getActiveCart(user.id);
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, user, refreshCart]);

  const addToCart = useCallback(async (productId: number, quantity: number) => {
    if (!user) return;
    await cartService.addItem(user.id, productId, quantity);
    await refreshCart();
  }, [user, refreshCart]);

  const updateQuantity = useCallback(async (cartItemId: number, quantity: number) => {
    if (!user) return;
    await cartService.updateItemQuantity(user.id, cartItemId, quantity);
    await refreshCart();
  }, [user, refreshCart]);

  const removeItem = useCallback(async (cartItemId: number) => {
    if (!user) return;
    await cartService.removeItem(user.id, cartItemId);
    await refreshCart();
  }, [user, refreshCart]);

  const clearCartAction = useCallback(async () => {
    if (!user) return;
    await cartService.clearCart(user.id);
    await refreshCart();
  }, [user, refreshCart]);

  const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeItem, clearCart: clearCartAction, refreshCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
