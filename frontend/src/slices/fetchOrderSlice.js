import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to create order.');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Other synchronous reducers can be defined here if needed
  },
  extraReducers: {
    [createOrder.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [createOrder.fulfilled]: (state, action) => {
      state.loading = false;
      state.orders.push(action.payload);
    },
    [createOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
  },
});

export const { actions: ordersActions, reducer: ordersReducer } = ordersSlice;
