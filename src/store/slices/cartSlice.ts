import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '@/store/types';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const isSameLine = (item: CartItem, target: Pick<CartItem, 'productId' | 'variantId'>) =>
  item.variantId > 0 && target.variantId > 0
    ? item.variantId === target.variantId
    : item.productId === target.productId;

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((item) => isSameLine(item, action.payload));
      if (existing) {
        existing.quantity += action.payload.quantity;
        existing.brand = action.payload.brand;
        existing.title = action.payload.title;
        existing.price = action.payload.price;
        existing.currency = action.payload.currency;
        existing.imageSrc = action.payload.imageSrc;
        existing.imageAlt = action.payload.imageAlt;
      } else {
        state.items.push(action.payload);
      }
    },
    setCartItemQuantity(
      state,
      action: PayloadAction<{ productId: number; variantId: number; quantity: number }>,
    ) {
      const existing = state.items.find((item) => isSameLine(item, action.payload));
      if (!existing) return;
      existing.quantity = Math.max(1, action.payload.quantity);
    },
    removeFromCart(state, action: PayloadAction<{ productId: number; variantId: number }>) {
      state.items = state.items.filter((item) => !isSameLine(item, action.payload));
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, setCartItemQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
