import axiosInstance from '@/app/lib/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// ---------------------- Thunks ----------------------
export const fetchStats = createAsyncThunk('admin/fetchStats', async () => {
  const response = await axiosInstance.get('/admin/stats');
  return response;
});

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async () => {
  const response = await axiosInstance.get('/admin/users');
  return response;
});

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId: string, thunkAPI) => {
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      return userId; // Trả về ID đã xóa để filter khỏi state
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi xóa');
    }
  }
);

export const createUser = createAsyncThunk(
  'admin/createUser',
  async (formData: any, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/admin/users', formData);
      return response; // Trả về user mới
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi thêm mới');
    }
  }
);
// ------------------ Slice -------------------
const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: { 
      totalUsers: 0, 
      totalAdmins: 0, 
      newUsersThisMonth: 0, 
      totalCourses: 0 
    },
    users: [] as any[], // Danh sách user
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Xử lý Stats
      .addCase(fetchStats.fulfilled, (state: any, action) => {
        state.stats = action.payload;
      })
      // Xử lý Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state: any, action) => {
        state.loading = false;
        state.users = action.payload;
      });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      // Lọc bỏ user vừa xóa khỏi danh sách hiện tại (để đỡ phải gọi lại API)
      state.users = state.users.filter((user: any) => user.id !== action.payload);
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      // Thêm user mới vào ĐẦU danh sách (để Admin thấy ngay)
      state.users.unshift(action.payload);
    });
  },
});

export default adminSlice.reducer;