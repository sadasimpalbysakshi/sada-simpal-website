import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import type { Product } from '@/data/products';

export interface CartItem {
  variantId: string; // which exact size/colour the customer picked
  id: string; // product web name (for links)
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  maxQty?: number; // most the customer can buy right now
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  syncWithCatalog: (products: Product[]) => void;
  totalItems: number;
  totalPrice: number;
}

export const cartItemKey = (i: Pick<CartItem, 'variantId'>) => i.variantId;

const capQty = (item: Pick<CartItem, 'maxQty'>, qty: number) =>
  Math.max(0, Math.min(qty, item.maxQty ?? 10));

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.variantId === action.payload.variantId);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.variantId === existing.variantId
              ? { ...i, ...action.payload, quantity: capQty(action.payload, i.quantity + action.payload.quantity) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { ...action.payload, quantity: Math.max(1, capQty(action.payload, action.payload.quantity)) },
        ],
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.variantId !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.variantId === action.payload.id
              ? { ...i, quantity: capQty(i, action.payload.quantity) }
              : i
          )
          .filter((i) => i.quantity > 0),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.payload };
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sadasimpal-cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        // carts saved by the older version of the site have no variantId — drop them
        const valid = Array.isArray(parsed) ? parsed.filter((i: CartItem) => i && i.variantId) : [];
        dispatch({ type: 'LOAD_CART', payload: valid });
      }
    } catch {
      /* ignore broken saved cart */
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('sadasimpal-cart', JSON.stringify(state.items));
    } catch {
      /* private mode */
    }
  }, [state.items]);

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity } });
  };
  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const setCartOpen = (open: boolean) => dispatch({ type: 'SET_CART_OPEN', payload: open });

  /** Refresh prices / availability of items already in the bag from the live catalogue. */
  const syncWithCatalog = (products: Product[]) => {
    const byVariant = new Map<string, { p: Product; v: Product['variants'][number] }>();
    products.forEach((p) => p.variants.forEach((v) => byVariant.set(v.id, { p, v })));
    let removed = 0;
    let changed = false;
    const next: CartItem[] = [];
    state.items.forEach((item) => {
      const hit = byVariant.get(item.variantId);
      if (!hit || !hit.v.available) {
        removed++;
        changed = true;
        return;
      }
      const maxQty = hit.v.madeToOrder ? 10 : Math.max(1, Math.min(10, hit.v.stock));
      const updated: CartItem = {
        ...item,
        name: hit.p.name,
        price: hit.v.price,
        image: hit.p.images[0] ?? item.image,
        size: hit.v.size,
        color: hit.v.color,
        maxQty,
        quantity: Math.min(item.quantity, maxQty),
      };
      if (JSON.stringify(updated) !== JSON.stringify(item)) changed = true;
      next.push(updated);
    });
    if (!changed) return;
    dispatch({ type: 'LOAD_CART', payload: next });
    if (removed > 0) {
      toast.info(
        removed === 1
          ? 'An item in your bag is no longer available and was removed.'
          : `${removed} items in your bag are no longer available and were removed.`
      );
    }
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        setCartOpen,
        syncWithCatalog,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
