import axiosInstance from '@/app/lib/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchCategories = createAsyncThunk('categories/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/categories');
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue('Lỗi tải danh mục');
  }
});

const categorySlice = createSlice({
  name: 'categories',
  initialState: { items: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action: any) => {
      state.items = action.payload;
    });
  },
});

export default categorySlice.reducer;