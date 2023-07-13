import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const createAuthUser = createAsyncThunk(
  'authUser/createAuthUser',
  async (userData, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:8000/api/users/auth', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to auth user.');
    }
  }
);

const authUserSlice = createSlice({
  name: 'authUser',
  initialState: {
    authUser: '',
    loading: false,
    error: null,
  },
  reducers: {
    // Other synchronous reducers can be defined here if needed
  },
  extraReducers: {
    [createAuthUser.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [createAuthUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.authUser = action.payload;
    },
    [createAuthUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
  },
});

export const { actions: authUserActions, reducer: authUserReducer } = authUserSlice;
