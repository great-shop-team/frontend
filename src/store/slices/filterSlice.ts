import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  searchQuery: string;
  categoryId: number | null;
  sortBy: 'price_asc' | 'price_desc' | 'popular' | null;
  currentPage: number;
}

const initialState: FilterState = {
  searchQuery: '',
  categoryId: null,
  sortBy: null,
  currentPage: 1,
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Скидаємо на 1 сторінку при пошуку
    },
    setCategory(state, action: PayloadAction<number | null>) {
      state.categoryId = action.payload;
      state.currentPage = 1;
    },
    setSort(state, action: PayloadAction<FilterState['sortBy']>) {
      state.sortBy = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    resetFilters() {
      return initialState; // Повертаємо початковий стан
    },
  },
});

export const { setSearchQuery, setCategory, setSort, setPage, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
