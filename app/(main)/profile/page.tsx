'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faSave, faKey } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hook';
import axiosInstance from '@/app/lib/axios';
import { setUser } from '@/app/lib/redux/features/auth/authSlice';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state:any) => state.auth);

  // State cho Info Form
  const [name, setName] = useState('');
  
  // State cho Password Form
  const [passData, setPassData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load dữ liệu ban đầu vào form
  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  // --- 1. XỬ LÝ CẬP NHẬT THÔNG TIN ---
  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    const promise = axiosInstance.put('/auth/profile', { name });

    toast.promise(promise, {
      loading: 'Đang cập nhật...',
      success: (data: any) => {
        // Cập nhật xong thì lưu ngược lại vào Redux để Header tự đổi tên
        dispatch(setUser({ ...user, name: data.name } as any));
        return 'Cập nhật thông tin thành công!';
      },
      error: 'Lỗi cập nhật.',
    });
  };

  // --- 2. XỬ LÝ ĐỔI MẬT KHẨU ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    if (passData.newPassword !== passData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    const promise = axiosInstance.post('/auth/change-password', {
      oldPassword: passData.oldPassword,
      newPassword: passData.newPassword
    });

    toast.promise(promise, {
      loading: 'Đang xử lý...',
      success: () => {
        setPassData({ oldPassword: '', newPassword: '', confirmPassword: '' }); // Reset form
        return 'Đổi mật khẩu thành công!';
      },
      error: (err: any) => err?.response?.data?.message || 'Lỗi đổi mật khẩu',
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-4">Cài đặt tài khoản</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* --- CỘT TRÁI: THÔNG TIN CÁ NHÂN --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="text-indigo-600" />
            Thông tin cá nhân
          </h2>
          
          <form onSubmit={handleUpdateInfo} className="space-y-4">
            {/* Avatar giả lập */}
            <div className="flex justify-center mb-6">
               <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl font-bold border-4 border-white shadow-md">
                 {user?.name?.charAt(0).toUpperCase() || 'U'}
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username (Không thể đổi)</label>
              <input 
                disabled 
                value={user?.username || ''} 
                className="w-full px-4 py-2 border bg-gray-100 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                disabled 
                value={user?.email || ''} 
                className="w-full px-4 py-2 border bg-gray-100 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faSave} /> Lưu thay đổi
            </button>
          </form>
        </div>

        {/* --- CỘT PHẢI: ĐỔI MẬT KHẨU --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faLock} className="text-orange-500" />
            Đổi mật khẩu
          </h2>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
              <div className="relative">
                <input 
                  type="password" required
                  value={passData.oldPassword}
                  onChange={(e) => setPassData({...passData, oldPassword: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="••••••"
                />
                <FontAwesomeIcon icon={faKey} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              </div>
            </div>

            <hr className="border-gray-100 my-2" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
              <input 
                type="password" required
                value={passData.newPassword}
                onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
              <input 
                type="password" required
                value={passData.confirmPassword}
                onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            <button type="submit" className="w-full bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faSave} /> Cập nhật mật khẩu
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}