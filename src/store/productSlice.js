import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, addProduct, updateProduct } from '../api/apiServices';

export const loadProducts = createAsyncThunk('products/load', fetchProducts);
export const createProduct = createAsyncThunk('products/add', addProduct);
export const editProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }) => {
    const updated = await updateProduct(id, data);
    return { id, updated };
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(loadProducts.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load products';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p._id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload.updated;
        }
      });
  },
});

export default productSlice.reducer;