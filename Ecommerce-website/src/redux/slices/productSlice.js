import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

const initialState = {
  products: [],
  product: null,
  categories: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  }
};

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/products', { params });
    return response.data; // Expected { products, totalPages, totalProducts }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch product details');
  }
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/products/categories');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
  }
});

export const createProduct = createAsyncThunk('products/create', async (productData, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/products/add', productData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create product');
  }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, data }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`/products/${id}`, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update product');
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, thunkAPI) => {
  try {
    await axiosInstance.delete(`/products/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete product');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    clearProduct: (state) => {
      state.product = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        // Normalize products to ensure consistent id, image, etc.
        const rawProducts = action.payload.products || [];
        state.products = rawProducts.map(p => ({
          ...p,
          id: p._id || p.id,
          image: p.images?.[0] || 'https://placehold.co/400x400?text=No+Image',
          isNew: p.isNewproduct
        }));
        state.pagination = {
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          totalProducts: action.payload.totalProducts || rawProducts.length || 0,
        };
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        const rawProduct = action.payload?.product || action.payload;
        if (rawProduct) {
          state.product = {
            ...rawProduct,
            id: rawProduct._id || rawProduct.id,
            image: rawProduct.images?.[0] || 'https://placehold.co/400x400?text=No+Image',
            isNew: rawProduct.isNewproduct
          };
        } else {
          state.product = null;
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        const rawProduct = action.payload?.product || action.payload;
        if (rawProduct && (rawProduct._id || rawProduct.id)) {
          const normalized = {
            ...rawProduct,
            id: rawProduct._id || rawProduct.id,
            image: rawProduct.images?.[0] || 'https://placehold.co/400x400?text=No+Image',
            isNew: rawProduct.isNewproduct
          };
          state.products.unshift(normalized);
        }
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const rawUpdated = action.payload?.updatedProduct || action.payload?.product || action.payload;
        const normalized = {
          ...rawUpdated,
          id: rawUpdated._id || rawUpdated.id,
          image: rawUpdated.images?.[0] || 'https://placehold.co/400x400?text=No+Image',
          isNew: rawUpdated.isNewproduct
        };
        const index = state.products.findIndex(
          (p) => p.id === normalized.id
        );
        if (index !== -1) {
          state.products[index] = normalized;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p._id !== action.payload && p.id !== action.payload
        );
      });
  },
});

export const { setProduct, clearProduct } = productSlice.actions;
export default productSlice.reducer;
