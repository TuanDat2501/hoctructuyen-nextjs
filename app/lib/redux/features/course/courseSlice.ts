import axiosInstance from '@/app/lib/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
interface CourseState {
  items: any[]; // <--- Quan trọng: Khai báo đây là mảng chứa 'any' (bất cứ thứ gì)
  loading: boolean;
}

const initialState: CourseState = {
  items: [],
  loading: false,
};

//------------- Thunk: Lấy danh sách khóa học--------------
export const fetchCourses = createAsyncThunk('courses/fetch', async (_, thunkAPI) => {
  try {
    // Sửa đường dẫn: /admin/courses -> /courses
    const response = await axiosInstance.get('/courses');
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue('Lỗi tải khóa học');
  }
});

export const updateCourse = createAsyncThunk(
  'courses/update',
  async ({ id, data }: { id: string; data: any }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/admin/courses/${id}`, data);
      return response; // Trả về course đã update
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Lỗi cập nhật');
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/delete',
  async (id: string, thunkAPI) => {
    try {
      await axiosInstance.delete(`/admin/courses/${id}`);
      return id; // Trả về ID để xóa khỏi state
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Lỗi xóa');
    }
  }
);

export const createCourse = createAsyncThunk(
  'courses/create',
  async (data: any, thunkAPI) => {
    try {
      // Gọi API POST tạo mới
      const response = await axiosInstance.post('/admin/courses', data);
      return response; // Trả về object khóa học vừa tạo
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi thêm mới');
    }
  }
);
//------------- Course Slice --------------
const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action:any) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else if (action.payload && Array.isArray(action.payload.data)) {
          state.items = action.payload.data;
        } else {
          state.items = [];
          console.error("Dữ liệu khóa học không đúng định dạng mảng:", action.payload);
        }
      })
      .addCase(fetchCourses.rejected, (state) => {
        state.loading = false;
      });
      builder.addCase(createCourse.fulfilled, (state, action:any) => {
      // Thêm khóa học mới vào ĐẦU danh sách (unshift) để nó hiện lên trên cùng
      state.items.unshift(action.payload);
    });
    builder.addCase(updateCourse.fulfilled, (state, action:any) => {
      if (!action.payload || !action.payload.id) {
        console.error("❌ LỖI: Payload bị rỗng!");
        return;
      }
      // Tìm và cập nhật item trong mảng
      const index = state.items.findIndex((c: any) => c?.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        console.log("✅ Đã cập nhật state thành công!");
      }
    });
    builder.addCase(deleteCourse.fulfilled, (state, action) => {
      state.items = state.items.filter((c: any) => c.id !== action.payload);
    });
  },
});

export default courseSlice.reducer;