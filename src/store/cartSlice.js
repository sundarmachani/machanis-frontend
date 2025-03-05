/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCart, removeFromCart } from "../api/apiServices";

export const loadCart = createAsyncThunk("cart/loadCart", async (_, thunkAPI) => {
  try {
    const data = await fetchCart();
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue("Failed to load cart");
  }
});

export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async (productId, thunkAPI) => {
    try {
      await removeFromCart(productId);
      return productId;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to remove item");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalAmount: 0,
    loading: false,
    error: "",
  },
  reducers: {
    restoreItem: (state, action) => {
      state.items.push(action.payload);
      state.totalAmount +=
        action.payload.productId.price * action.payload.quantity;
    },
    calculateTotal: (state) => {
      state.totalAmount = state.items.reduce(
        (acc, item) => acc + item.productId.price * item.quantity,
        0
      );
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCart.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalAmount = state.items.reduce(
          (acc, item) => acc + item.productId.price * item.quantity,
          0
        );
        state.loading = false;
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.productId._id !== action.payload
        );
        state.totalAmount = state.items.reduce(
          (acc, item) => acc + item.productId.price * item.quantity,
          0
        );
        state.loading = false;
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { restoreItem, calculateTotal, clearCart } = cartSlice.actions;
export default cartSlice.reducer;