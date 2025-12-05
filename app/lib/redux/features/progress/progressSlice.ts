import axiosInstance from '@/app/lib/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { logout } from '../auth/authSlice';
// 1. Thunk: Lấy tiến độ
export const fetchProgress = createAsyncThunk(
  'progress/fetch',
  async (courseId: string, thunkAPI) => {
    try {
      // Gọi API GET /api/progress/[courseId]
      const response = await axiosInstance.get(`/progress/${courseId}`);
      return response; // Trả về mảng string []
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Lỗi tải tiến độ');
    }
  }
);

// 2. Thunk: Đánh dấu hoàn thành
export const markLessonComplete = createAsyncThunk(
  'progress/markComplete',
  async (data: { lessonId: string, courseId: string }, thunkAPI) => {
    try {
      await axiosInstance.post('/progress/complete', data);
      return data.lessonId; // Trả về ID bài vừa học xong để cập nhật state
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Lỗi lưu tiến độ');
    }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    completedLessonIds: [] as string[], // Danh sách ID bài đã học
    loading: false,
  },
  reducers: {
    resetProgress: (state) => {
      state.completedLessonIds = [];
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchProgress.fulfilled, (state, action: any) => {
      state.completedLessonIds = action.payload;
    });

    // Mark Complete
    builder.addCase(markLessonComplete.fulfilled, (state, action: any) => {
      // Nếu ID chưa có trong mảng thì thêm vào (tránh trùng)
      if (!state.completedLessonIds.includes(action.payload)) {
        state.completedLessonIds.push(action.payload);
      }
    });
    /* builder.addCase(logout, (state) => {
      state.completedLessonIds = []; // Xóa sạch danh sách bài đã học
      state.loading = false;
    }); */
  },
});
export const { resetProgress } = progressSlice.actions
export default progressSlice.reducer;