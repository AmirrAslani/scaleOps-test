import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice, // ریدوسر تم
    cart: cartReducer, // ریدوسر سبد خرید
    wishlist: wishlistReducer,
});

export default configureStore({
    reducer: rootReducer,
});

// تعریف تایپ استیت اصلی
export type IRootState = ReturnType<typeof rootReducer>;
