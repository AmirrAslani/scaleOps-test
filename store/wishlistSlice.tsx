import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// نوع داده برای محصول
type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

// تعریف نوع داده برای state
interface WishlistState {
  items: Product[];
}

// مقداردهی اولیه state
const initialState: WishlistState = {
  items: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('wishlist') || '[]') : [], // بررسی برای مرورگر
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // افزودن محصول به لیست علاقه‌مندی‌ها
    addToWishlist(state, action: PayloadAction<Product>) {
      const existingProduct = state.items.find(
        (product) => product.id === action.payload.id
      );

      // اگر محصول قبلاً در لیست نبود، آن را اضافه کنیم
      if (!existingProduct) {
        state.items.push(action.payload);

        if (typeof window !== 'undefined') {
          localStorage.setItem('wishlist', JSON.stringify(state.items)); // ذخیره‌سازی داده‌ها در localStorage
        }
      }
    },

    // حذف محصول از لیست علاقه‌مندی‌ها
    removeFromWishlist(state, action: PayloadAction<number>) {
      state.items = state.items.filter((product) => product.id !== action.payload);

      if (typeof window !== 'undefined') {
        localStorage.setItem('wishlist', JSON.stringify(state.items)); // بروزرسانی localStorage
      }
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
