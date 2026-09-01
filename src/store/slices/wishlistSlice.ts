import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { toApiProductId } from '@/features/wishlist/lib/favorites';
import type { WishlistItem } from '@/store/types';
import { logout } from '@/store/slices/userSlice';

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<WishlistItem>) {
      const exists = state.items.some((item) => item.productId === action.payload.productId);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    upsertWishlistItem(state, action: PayloadAction<WishlistItem>) {
      const index = state.items.findIndex((item) => item.productId === action.payload.productId);
      if (index >= 0) {
        state.items[index] = action.payload;
        return;
      }
      state.items.push(action.payload);
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    setWishlist(state, action: PayloadAction<WishlistItem[]>) {
      const localOnly = state.items.filter((item) => toApiProductId(item.productId) == null);
      const remoteIds = new Set(action.payload.map((item) => item.productId));
      state.items = [
        ...action.payload,
        ...localOnly.filter((item) => !remoteIds.has(item.productId)),
      ];
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.items = [];
    });
  },
});

export const {
  addToWishlist,
  upsertWishlistItem,
  removeFromWishlist,
  setWishlist,
  clearWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
