import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// نوع داده‌های محصول
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

// نوع داده‌های استیت
interface CartState {
  cart: Product[];
}

// استیت اولیه
const initialState: CartState = {
  cart: [],
};

// ایجاد Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      state.cart.push(action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.cart)); // ذخیره در Local Storage
      }
    },
    loadCart: (state) => {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          state.cart = JSON.parse(savedCart);
        }
      }
    },
  },
});

// اکشن‌ها و Reducer
export const { addToCart, loadCart } = cartSlice.actions;
export default cartSlice.reducer;
