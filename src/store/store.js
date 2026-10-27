import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

const CART_STORAGE_KEY = 'eventease_cart';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// Subscribe to store updates to persist cart in localStorage automatically
store.subscribe(() => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const state = store.getState();
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart.items));
  } catch (err) {
    console.error('Failed to save cart to localStorage:', err);
  }
});

export default store;
