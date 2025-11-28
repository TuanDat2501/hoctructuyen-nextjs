import axiosInstance from '@/app/lib/axios';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';


// --- Types ---
interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// --- Async Thunk ---
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      const data:any = response; // Vì axios config của mình đã return response.data

      // Lưu token
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.token);
      }

      return data; // Trả về { token, user }
    } catch (error: any) {
      // Bắt lỗi từ API trả về (message: 'Mật khẩu không đúng'...)
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; name: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response; // Trả về data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Đăng ký thất bại');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, thunkAPI) => {
    try {
      // Gọi API /api/auth/me (Axios đã tự gắn token vào header rồi)
      const response: any = await axiosInstance.get('/auth/me');
      return response.user;
    } catch (error) {
      // Nếu lỗi (Token hết hạn...) -> Xóa token luôn để khỏi loading
      if (typeof window !== 'undefined') localStorage.removeItem('accessToken');
      return thunkAPI.rejectWithValue('Phiên đăng nhập hết hạn');
    }
  }
);

// --- Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      if (typeof window !== 'undefined') localStorage.removeItem('accessToken');
    },
    // Action nạp user (dùng cho AuthProvider sau này)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    // --- Xử lý Login ---
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // --- Xử lý Fetch User Profile (F5 trang) ---
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      // QUAN TRỌNG: Gộp tất cả logic lỗi vào ĐÂY (chỉ viết 1 lần thôi)
      .addCase(fetchUserProfile.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        
        // Xóa token để AuthGuard biết đường đá về login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
        }
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;