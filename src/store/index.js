// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import orderReducer from './orderSlice';
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    orders: orderReducer,
    cart: cartReducer,
  },
});