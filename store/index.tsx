import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import wishlistReducer from './wishlistSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    wishlist: wishlistReducer,
});

export default configureStore({
    reducer: rootReducer,
});

// تعریف تایپ استیت اصلی
export type IRootState = ReturnType<typeof rootReducer>;
