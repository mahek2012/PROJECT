import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

// Async Thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/cart/all');
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

export const addItemToCart = createAsyncThunk('cart/addItemToCart', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/cart/add', { productId, quantity });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

export const updateCartItemQuantity = createAsyncThunk('cart/updateCartItemQuantity', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/cart/add', { productId, quantity, behavior: 'set' });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

export const removeItemFromCart = createAsyncThunk('cart/removeItemFromCart', async (productId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/cart/product/${productId}`);
    return { productId, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

const calculateTotals = (items) => {
  const totalQuantity = items.reduce((total, item) => total + (item.quantity || 0), 0);
  const totalAmount = items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
  return { totalQuantity, totalAmount };
};

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  isLoading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const items = action.payload || [];
        state.items = items
          .filter(item => item && item.productId) // Safety check
          .map(item => ({
            id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            image: item.productId.images?.[0] || item.productId.image,
            category: item.productId.category,
            quantity: item.quantity,
            productId: item.productId._id
          }));


        const { totalQuantity, totalAmount } = calculateTotals(state.items);
        state.totalQuantity = totalQuantity;
        state.totalAmount = totalAmount;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload.productId);
        const { totalQuantity, totalAmount } = calculateTotals(state.items);
        state.totalQuantity = totalQuantity;
        state.totalAmount = totalAmount;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        const cartItems = action.payload.cart || [];
        state.items = cartItems
          .filter(item => item && item.productId)
          .map(item => ({
            id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            image: item.productId.images?.[0] || item.productId.image,
            category: item.productId.category,
            quantity: item.quantity,
            productId: item.productId._id
          }));
        const { totalQuantity, totalAmount } = calculateTotals(state.items);
        state.totalQuantity = totalQuantity;
        state.totalAmount = totalAmount;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const cartItems = action.payload.cart || [];
        state.items = cartItems
          .filter(item => item && item.productId)
          .map(item => ({
            id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            image: item.productId.images?.[0] || item.productId.image,
            category: item.productId.category,
            quantity: item.quantity,
            productId: item.productId._id
          }));
        const { totalQuantity, totalAmount } = calculateTotals(state.items);
        state.totalQuantity = totalQuantity;
        state.totalAmount = totalAmount;
      });


  }
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
