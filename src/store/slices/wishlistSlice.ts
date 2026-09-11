import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { WishlistItem } from '@/store/types';
import { logout } from '@/store/slices/userSlice';

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

function sameItem(left: WishlistItem, right: WishlistItem) {
  if (left.productId && right.productId && left.productId === right.productId) return true;
  if (left.variantId && right.variantId && left.variantId === right.variantId) return true;
  return false;
}

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<WishlistItem>) {
      const exists = state.items.some((item) => sameItem(item, action.payload));
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    upsertWishlistItem(state, action: PayloadAction<WishlistItem>) {
      const index = state.items.findIndex((item) => sameItem(item, action.payload));
      if (index >= 0) {
        state.items[index] = { ...state.items[index], ...action.payload };
        return;
      }
      state.items.push(action.payload);
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    mergeRemoteWishlist(state, action: PayloadAction<WishlistItem[]>) {
      const remote = action.payload.filter((item) => item.productId || item.variantId);
      const localOnly = state.items.filter(
        (item) => !remote.some((remoteItem) => sameItem(item, remoteItem)),
      );
      state.items = [...remote, ...localOnly];
    },
    setWishlist(state, action: PayloadAction<WishlistItem[]>) {
      state.items = action.payload;
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
  mergeRemoteWishlist,
  setWishlist,
  clearWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
