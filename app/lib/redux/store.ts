import { configureStore, UnknownAction } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';
// Import AuthReducer thật từ file slice
import authReducer from './features/auth/authSlice';
import adminReducer from './features/admin/adminSlice';
import courseReducer from './features/course/courseSlice';
import progressReducer from './features/progress/progressSlice';
export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      // Thêm các reducers khác vào đây
      auth: authReducer,
      admin: adminReducer,
      courses: courseReducer,
      progress: progressReducer,
    },
  });
};

// Định nghĩa các kiểu dữ liệu cho TypeScript
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];




