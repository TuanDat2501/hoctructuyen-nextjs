'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '../redux/hook';
import { createUser } from '../redux/features/admin/adminSlice';

interface AddUserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddUserDrawer({ isOpen, onClose }: AddUserDrawerProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      username: '',
    password: '',
    role: 'user', // Mặc định là user
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Cách dùng cơ bản (không dùng promise)
    const resultAction = await dispatch(createUser(formData));

    if (createUser.fulfilled.match(resultAction)) {
      toast.success('Thêm thành viên thành công!'); // <--- Thay alert
      setFormData({ name: '', username: '', email: '', password: '', role: 'user' });
      onClose();
    } else {
      toast.error(`Lỗi: ${resultAction.payload}`); // <--- Thay alert
    }
    setLoading(false);
  };

  return (
    <>
      {/* 1. LỚP MÀN ĐEN MỜ (Backdrop) */}
      {/* Chỉ hiện khi isOpen = true */}
      <div 
        className={`fixed inset-0 bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose} // Bấm ra ngoài thì đóng
      ></div>

      {/* 2. DRAWER PANEL (Trượt từ phải sang) */}
      <div 
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header Drawer */}
          <div className="px-6 py-4 border-b flex justify-between items-center bg-indigo-50">
            <h2 className="text-lg font-bold text-indigo-900">Thêm Thành Viên Mới</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors">
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>

          {/* Form Body */}
          <div className="flex-1 p-6 overflow-y-auto">
            <form id="addUserForm" onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
                <input 
                  type="text" name="name" required
                  value={formData.name} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" name="email" required
                  value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="example@gmail.com"
                />
              </div>
                {/* Username */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username (Tên đăng nhập)</label>
                <input 
                  type="text" name="username" required
                  value={formData.username} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="nguyenvana"
                />
              </div>
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input 
                  type="password" name="password" required
                  value={formData.password} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="******"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phân quyền</label>
                <select 
                  name="role" 
                  value={formData.role} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="user">User (Người dùng thường)</option>
                  <option value="admin">Admin (Quản trị viên)</option>
                </select>
              </div>

            </form>
          </div>

          {/* Footer (Actions) */}
          <div className="p-6 border-t bg-gray-50">
            <button 
              type="submit" 
              form="addUserForm" // Link với form ở trên
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-bold flex justify-center items-center gap-2 shadow-lg transition-all
                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30'}
              `}
            >
              {loading ? (
                <span>Đang xử lý...</span>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} /> Lưu Lại
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}