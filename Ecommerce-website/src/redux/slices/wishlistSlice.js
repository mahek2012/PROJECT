import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

// Async Thunks
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/wishlist/all');
    return response.data.wishlist;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async (productId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/wishlist/add', { productId });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async (productId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/wishlist/product/${productId}`);
    return { productId, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const initialState = {
  items: [],
  isLoading: false,
  error: null
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        const items = action.payload || [];
        state.items = items
          .filter(item => item && item.productId) // Safety check: skip if product was deleted
          .map(item => ({
            id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            image: item.productId.images?.[0],
            productId: item.productId._id
          }));
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload.productId);
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const wishlistItems = action.payload.wishlist || [];
        state.items = wishlistItems
          .filter(item => item && item.productId)
          .map(item => ({
            id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            image: item.productId.images?.[0],
            productId: item.productId._id
          }));
      });


  }
});

export default wishlistSlice.reducer;

