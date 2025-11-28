import axios from 'axios';

// 1. Tạo instance với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL:'/api', // Lấy từ biến môi trường
  timeout: 10000, // Hủy request sau 10s nếu không có phản hồi
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor cho Request (Gửi đi)
// Thường dùng để gắn Token vào Header
axiosInstance.interceptors.request.use(
  (config) => {
    // Ví dụ: Lấy token từ localStorage (chỉ chạy ở Client)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor cho Response (Nhận về)
// Xử lý lỗi chung (VD: Token hết hạn -> logout)
axiosInstance.interceptors.response.use(
  (response) => {
    // Trả về data trực tiếp cho gọn (đỡ phải gọi response.data ở nơi khác)
    return response.data;
  },
  (error) => {
    // Xử lý lỗi tập trung
    if (error.response && error.response.status === 401) {
      // Logic logout hoặc refresh token ở đây
      console.log('Hết phiên đăng nhập!');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;