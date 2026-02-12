import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import * as cartService from "../services/cart-service";
import type { Cart, CartItem } from "../types/cart";

interface LocalCartItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
}

interface CartContextData {
  cart: Cart | null;
  localItems: LocalCartItem[];
  loading: boolean;
  isLocalCart: boolean;
  addToCart: (productId: number, quantity: number, productName?: string, unitPrice?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  syncLocalCartToApi: () => Promise<void>;
  itemCount: number;
  items: CartItem[];
  total: number;
}

const LOCAL_CART_KEY = "localCart";

function getLocalCart(): LocalCartItem[] {
  try {
    const stored = localStorage.getItem(LOCAL_CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveLocalCart(items: LocalCartItem[]) {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
}

function clearLocalCart() {
  localStorage.removeItem(LOCAL_CART_KEY);
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [localItems, setLocalItems] = useState<LocalCartItem[]>(getLocalCart());
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

  const syncLocalCartToApi = useCallback(async () => {
    if (!user) return;
    const local = getLocalCart();
    if (local.length === 0) return;

    for (const item of local) {
      try {
        await cartService.addItem(user.id, item.productId, item.quantity);
      } catch {}
    }
    clearLocalCart();
    setLocalItems([]);
    await refreshCart();
  }, [user, refreshCart]);

  useEffect(() => {
    if (isAuthenticated && user) {
      syncLocalCartToApi().then(() => refreshCart());
    } else {
      setCart(null);
      setLocalItems(getLocalCart());
    }
  }, [isAuthenticated, user, refreshCart, syncLocalCartToApi]);

  const addToCart = useCallback(async (productId: number, quantity: number, productName?: string, unitPrice?: number) => {
    if (isAuthenticated && user) {
      await cartService.addItem(user.id, productId, quantity);
      await refreshCart();
    } else {
      setLocalItems(prev => {
        const existing = prev.find(i => i.productId === productId);
        let updated: LocalCartItem[];
        if (existing) {
          updated = prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
        } else {
          updated = [...prev, { productId, productName: productName ?? "Produto", unitPrice: unitPrice ?? 0, quantity }];
        }
        saveLocalCart(updated);
        return updated;
      });
    }
  }, [isAuthenticated, user, refreshCart]);

  const updateQuantity = useCallback(async (cartItemId: number, quantity: number) => {
    if (isAuthenticated && user) {
      await cartService.updateItemQuantity(user.id, cartItemId, quantity);
      await refreshCart();
    } else {
      setLocalItems(prev => {
        const updated = prev.map((item, index) => index === cartItemId ? { ...item, quantity } : item);
        saveLocalCart(updated);
        return updated;
      });
    }
  }, [isAuthenticated, user, refreshCart]);

  const removeItem = useCallback(async (cartItemId: number) => {
    if (isAuthenticated && user) {
      await cartService.removeItem(user.id, cartItemId);
      await refreshCart();
    } else {
      setLocalItems(prev => {
        const updated = prev.filter((_, index) => index !== cartItemId);
        saveLocalCart(updated);
        return updated;
      });
    }
  }, [isAuthenticated, user, refreshCart]);

  const clearCartAction = useCallback(async () => {
    if (isAuthenticated && user) {
      await cartService.clearCart(user.id);
      await refreshCart();
    } else {
      clearLocalCart();
      setLocalItems([]);
    }
  }, [isAuthenticated, user, refreshCart]);

  const isLocalCart = !isAuthenticated;

  const items: CartItem[] = isAuthenticated
    ? (cart?.items ?? [])
    : localItems.map((item, index) => ({
        id: index,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.unitPrice * item.quantity,
      }));

  const total = items.reduce((acc, item) => acc + item.subtotal, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, localItems, loading, isLocalCart, addToCart, updateQuantity, removeItem, clearCart: clearCartAction, refreshCart, syncLocalCartToApi, itemCount, items, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
