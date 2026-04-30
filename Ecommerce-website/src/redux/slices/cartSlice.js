import { createSlice } from '@reduxjs/toolkit';

const getSafeCart = () => {
  try {
    const items = localStorage.getItem('cartItems');
    return items ? JSON.parse(items) : [];
  } catch (e) {
    return [];
  }
};

const initialItems = getSafeCart();
const initialTotals = initialItems.reduce((acc, item) => ({
  totalQuantity: acc.totalQuantity + (item.quantity || 0),
  totalAmount: acc.totalAmount + (item.price * (item.quantity || 0))
}), { totalQuantity: 0, totalAmount: 0 });

const initialState = {
  items: initialItems,
  totalQuantity: initialTotals.totalQuantity,
  totalAmount: initialTotals.totalAmount,
};

const calculateTotals = (items) => {
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return { totalQuantity, totalAmount };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      
      if (!existingItem) {
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1,
        });
      } else {
        existingItem.quantity += newItem.quantity || 1;
      }
      
      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      
      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
      
      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      localStorage.removeItem('cartItems');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
