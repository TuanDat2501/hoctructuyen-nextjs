'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Dùng axios để gọi register
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faIdCard, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from './lib/redux/hook';
import axiosInstance from './lib/axios';
import { loginUser } from './lib/redux/features/auth/authSlice';

export default function AuthPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading: loginLoading } = useAppSelector((state) => state.auth);

  // State chuyển đổi giữa Login và Register
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false); // Local loading cho Register

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: ''
  });

  // Nếu đã login thì đá sang dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') router.push('/admin/dashboard');
      else router.push('/dashboard');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- XỬ LÝ SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegisterMode) {
      // --- LOGIC ĐĂNG KÝ ---
      try {
        setLoading(true);
        await axiosInstance.post('/auth/register', formData);
        toast.success('Đăng ký thành công! Vui lòng chờ Admin xác nhận.');
        setIsRegisterMode(false); // Chuyển về tab Login
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Đăng ký thất bại');
      } finally {
        setLoading(false);
      }
    } else {
      // --- LOGIC ĐĂNG NHẬP ---
      const resultAction = await dispatch(loginUser({
        username: formData.username,
        password: formData.password
      }));

      if (loginUser.fulfilled.match(resultAction)) {
        toast.success('Đăng nhập thành công!');
      } else {
        // Lỗi từ API (bao gồm cả lỗi "Chờ phê duyệt") sẽ hiện ở đây
        toast.error(resultAction.payload as string);
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* --- CỘT TRÁI: ẢNH CÔNG TY (Ẩn trên mobile) --- */}
      <div className="hidden lg:flex w-1/2 bg-indigo-900 relative items-center justify-center overflow-hidden">
        {/* Ảnh nền (Thay link ảnh công ty của bạn vào đây) */}
        <img
          src="login.webp"
          alt="Sano Media Office"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />

        {/* Text đè lên ảnh */}
        <div className="relative z-10 p-12 text-white max-w-xl">
          <h2 className="text-5xl font-bold mb-6">Sano Media Academy</h2>
          <p className="text-lg text-indigo-100 leading-relaxed">
            Chào mừng bạn đến với chương trình đào tạo nội bộ.
            Nơi nâng cao kỹ năng, chia sẻ kiến thức và cùng nhau phát triển.
          </p>
        </div>
      </div>

      {/* --- CỘT PHẢI: FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">

          {/* Header Mobile (Chỉ hiện khi mất cột ảnh) */}
          <div className="lg:hidden text-center mb-8">

            <h1 className="text-3xl font-bold text-indigo-700">Sano Media</h1>
            <p className="text-gray-500 text-sm">Chương trình đào tạo nội bộ</p>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {isRegisterMode ? 'Đăng ký tài khoản' : 'Đăng nhập hệ thống'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isRegisterMode ? 'Điền thông tin để tham gia' : 'Nhập thông tin xác thực của bạn'}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">

              {/* Username (Dùng chung) */}
              <div className="relative">
                <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Tên đăng nhập"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              {/* Các trường chỉ hiện khi Đăng ký */}
              {isRegisterMode && (
                <>
                  <div className="relative">
                    <FontAwesomeIcon icon={faIdCard} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="name"
                      type="text"
                      required
                      className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Họ và tên đầy đủ"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative">
                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      required
                      className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Email công ty (@sanomedia.vn)"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {/* Password (Dùng chung) */}
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loginLoading || loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-lg"
              >
                {(loginLoading || loading) ? (
                  <><FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Đang xử lý...</>
                ) : (
                  isRegisterMode ? 'Gửi yêu cầu đăng ký' : 'Đăng nhập'
                )}
              </button>
            </div>

            {/* Footer Form: Chuyển đổi Mode */}
            <div className="flex items-center justify-center text-sm">
              <span className="text-gray-500">
                {isRegisterMode ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setFormData({ username: '', password: '', email: '', name: '' }); // Reset form
                }}
                className="ml-2 font-medium text-indigo-600 hover:text-indigo-500"
              >
                {isRegisterMode ? 'Đăng nhập ngay' : 'Đăng ký tài khoản'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}