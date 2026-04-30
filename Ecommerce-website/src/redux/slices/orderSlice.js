import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

const initialState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

export const placeOrder = createAsyncThunk('orders/place', async (orderData, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to place order');
  }
});

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/orders/my-orders');
    return response.data.orders || response.data.order || response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchAllAdminOrders = createAsyncThunk('orders/fetchAllAdmin', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/orders/admin/all');
    return response.data.orders;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch all orders');
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ orderId, status, paymentStatus }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`/orders/admin/${orderId}`, { status, paymentStatus });
    return response.data.order;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update order');
  }
});


const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllAdminOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAdminOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllAdminOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });

  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
