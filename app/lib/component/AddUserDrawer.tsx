'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../redux/hook';
import { createUser, updateUser } from '../redux/features/admin/adminSlice';

interface AddUserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any; // <--- Thêm prop này để nhận dữ liệu khi sửa
}

export default function AddUserDrawer({ isOpen, onClose, initialData }: AddUserDrawerProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'user',
  });

  // Khi mở Drawer: Nếu có initialData -> Điền vào form (Chế độ Sửa)
  // Nếu không -> Reset form (Chế độ Thêm)
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          username: initialData.username || '',
          email: initialData.email || '',
          password: '', // Password để trống, nhập mới đổi
          role: initialData.role || 'user',
        });
      } else {
        setFormData({ name: '', username: '', email: '', password: '', role: 'user' });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ( (!initialData && formData.password.length < 6) || 
         (initialData && formData.password && formData.password.length < 6) ) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    setLoading(true);
    
    try {
      if (initialData?.id) {
        // --- LOGIC SỬA (UPDATE) ---
        await toast.promise(
          dispatch(updateUser({ id: initialData.id, data: formData })).unwrap(),
          {
            loading: 'Đang cập nhật...',
            success: 'Cập nhật thành công! 👌',
            error: 'Lỗi cập nhật.',
          }
        );
      } else {
        // --- LOGIC THÊM MỚI (CREATE) ---
        await toast.promise(
          dispatch(createUser(formData)).unwrap(),
          {
            loading: 'Đang tạo mới...',
            success: 'Thêm user thành công! 🎉',
            error: 'Lỗi thêm mới.',
          }
        );
      }
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      ></div>

      <div 
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b flex justify-between items-center bg-indigo-50">
            {/* Đổi tiêu đề linh hoạt */}
            <h2 className="text-lg font-bold text-indigo-900">
              {initialData ? 'Cập Nhật Thành Viên' : 'Thêm Thành Viên Mới'}
            </h2>
            <button onClick={onClose}><FontAwesomeIcon icon={faTimes} className="text-xl text-gray-500" /></button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <form id="userForm" onSubmit={handleSubmit} className="space-y-5">
              {/* Các ô input giữ nguyên như cũ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                {/* Username thường không nên cho sửa, hoặc tùy bạn. Ở đây mình disable khi sửa */}
                <input type="text" name="username" required value={formData.username} onChange={handleChange} 
                  // disabled={!!initialData} // Nếu đang sửa thì không cho đổi username
                  className={"w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu {initialData && <span className="text-xs text-gray-400 font-normal">(Để trống nếu không đổi)</span>}
                </label>
                <input 
                  type="password" name="password" 
                  required={!initialData} // Bắt buộc khi Thêm mới, không bắt buộc khi Sửa
                  value={formData.password} onChange={handleChange} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phân quyền</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </form>
          </div>
          <div className="p-6 border-t bg-gray-50">
            <button type="submit" form="userForm" disabled={loading} className="w-full py-3 rounded-lg text-white font-bold bg-indigo-600 hover:bg-indigo-700 flex justify-center items-center gap-2 shadow-lg">
              {loading ? 'Đang xử lý...' : <><FontAwesomeIcon icon={faSave} /> {initialData ? 'Lưu Thay Đổi' : 'Tạo Mới'}</>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}