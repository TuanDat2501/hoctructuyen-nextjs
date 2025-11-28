'use client';

import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faTrash, faPen, faPlus, faUserShield, faUser 
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hook';
import { deleteUser, fetchUsers } from '@/app/lib/redux/features/admin/adminSlice';
import AddUserDrawer from '@/app/lib/component/AddUserDrawer';

export default function UserManagementPage() {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.admin);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // State tìm kiếm cục bộ
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch dữ liệu khi vào trang
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Logic lọc user theo ô tìm kiếm
  const filteredUsers = users.filter((user: any) => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hàm xử lý xóa
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa user "${name}" không?`)) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* --- HEADER & TOOLBAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản Lý Thành Viên</h1>
        
        <div className="flex gap-3 w-full md:w-auto">
          {/* Ô tìm kiếm */}
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="Tìm theo tên, email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Nút thêm mới (Demo UI) */}
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm" onClick={() => setIsDrawerOpen(true)}>
            <FontAwesomeIcon icon={faPlus} />
            <span className="hidden sm:inline">Thêm mới</span>
          </button>
        </div>
      </div>

      {/* --- TABLE DANH SÁCH --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Info</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-10 text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-gray-500">Không tìm thấy user nào.</td></tr>
              ) : (
                filteredUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    
                    {/* Cột 1: Thông tin User */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name || 'Chưa đặt tên'}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Cột 2: Role (Badge màu) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === 'admin' ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 items-center gap-1">
                          <FontAwesomeIcon icon={faUserShield} /> Admin
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 items-center gap-1">
                          <FontAwesomeIcon icon={faUser} /> User
                        </span>
                      )}
                    </td>

                    {/* Cột 3: Ngày tạo */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>

                    {/* Cột 4: Hành động */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-4" title="Sửa">
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id, user.name || user.email)}
                        className="text-red-500 hover:text-red-700" 
                        title="Xóa"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer phân trang (UI Demo) */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Hiển thị {filteredUsers.length} kết quả
            </span>
            <div className="flex gap-2">
                <button className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-100 disabled:opacity-50" disabled>Trước</button>
                <button className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-100">Sau</button>
            </div>
        </div>
      </div>
      <AddUserDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </div>
  );
}