/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchOrders, fetchAllOrders, updateOrderStatus } from "../api/apiServices";

export const loadUserOrders = createAsyncThunk(
  "orders/loadUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchOrders();
    } catch (err) {
      return rejectWithValue("Failed to fetch user orders");
    }
  }
);

export const loadAllOrders = createAsyncThunk(
  "orders/loadAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllOrders();
    } catch (err) {
      return rejectWithValue("Failed to fetch admin orders");
    }
  }
);

export const setOrderStatus = createAsyncThunk(
  "orders/setOrderStatus",
  async ({ orderId, status }) => {
    await updateOrderStatus(orderId, status);
    return { orderId, status };
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserOrders.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(loadUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loadAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadAllOrders.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(loadAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(setOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        const order = state.items.find((o) => o._id === orderId);
        if (order) order.status = status;
      });
  },
});

export default orderSlice.reducer;