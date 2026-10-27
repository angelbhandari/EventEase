import { createSlice } from '@reduxjs/toolkit';
import { staticCartItems } from '../data/eventsData.js';

const CART_STORAGE_KEY = 'eventease_cart';

// Safe localStorage initialization with fallback to default demo cart items
const loadInitialCart = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return staticCartItems || [];
  }
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse cart from localStorage:', err);
  }
  return staticCartItems || [];
};

const initialState = {
  items: loadInitialCart(),
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.themeId === newItem.themeId &&
          (item.selectedPackage || 'Standard') === (newItem.selectedPackage || 'Standard')
      );

      const qtyToAdd = Number(newItem.quantity) > 0 ? Number(newItem.quantity) : 1;

      if (existingItem) {
        existingItem.quantity += qtyToAdd;
      } else {
        state.items.push({
          id: newItem.id || `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          themeId: newItem.themeId,
          eventName: newItem.eventName || 'Curated Event',
          themeName: newItem.themeName || newItem.name,
          category: newItem.category || newItem.categoryName || 'Celebration',
          image: newItem.image,
          price: Number(newItem.price) || 0,
          quantity: qtyToAdd,
          selectedPackage: newItem.selectedPackage || 'Standard',
          eventDate: newItem.eventDate || '',
          guests: newItem.guests || '50-100',
        });
      }
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
    },

    increaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter((i) => i.id !== id);
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    setCart: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  setCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((acc, item) => acc + (item.quantity || 0), 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);
export const selectCartTax = (state) => Math.round(selectCartSubtotal(state) * 0.05);
export const selectCartGrandTotal = (state) =>
  selectCartSubtotal(state) + selectCartTax(state);

export default cartSlice.reducer;
