'use client';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faTrash, faPen, faPlus, faUserShield, faUser, faSpinner 
} from '@fortawesome/free-solid-svg-icons';
// 1. IMPORT COMPONENT VÀ TOAST
import toast from 'react-hot-toast';
import { deleteUser, fetchUsers } from '@/app/lib/redux/features/admin/adminSlice';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hook';
import AddUserDrawer from '@/app/lib/component/AddUserDrawer';
import ConfirmModal from '@/app/lib/component/admin/ConfirmModal';

export default function UserManagementPage() {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state: any) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State cho Drawer Thêm/Sửa
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // 2. STATE CHO MODAL XÓA
  const [deleteConfig, setDeleteConfig] = useState<{
    isOpen: boolean;
    userId: string | null;
    userName: string;
  }>({ isOpen: false, userId: null, userName: '' });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Handle Open Drawer (Thêm/Sửa) - Giữ nguyên
  const handleOpenCreate = () => { setSelectedUser(null); setIsDrawerOpen(true); };
  const handleOpenEdit = (user: any) => { setSelectedUser(user); setIsDrawerOpen(true); };

  // 3. HÀM MỞ MODAL XÓA (Thay thế hàm handleDelete cũ)
  const requestDelete = (id: string, name: string) => {
    setDeleteConfig({
      isOpen: true,
      userId: id,
      userName: name
    });
  };

  // 4. HÀM THỰC THI XÓA (Chạy khi bấm Đồng ý)
  const onConfirmDelete = async () => {
    if (!deleteConfig.userId) return;

    // Gọi Redux xóa + hiện Toast
    await toast.promise(
      dispatch(deleteUser(deleteConfig.userId)).unwrap(),
      {
        loading: 'Đang xóa thành viên...',
        success: 'Đã xóa thành công! 🗑️',
        error: (err) => `Lỗi: ${err}`,
      }
    );
    
    // Xóa xong thì tự modal đóng do state change hoặc component unmount logic
    // Nhưng để chắc ăn ta reset config
    setDeleteConfig({ isOpen: false, userId: null, userName: '' });
  };

  const filteredUsers = users.filter((user: any) => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER ... (Giữ nguyên) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản Lý Thành Viên</h1>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" placeholder="Tìm theo tên, email..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button onClick={handleOpenCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
            <FontAwesomeIcon icon={faPlus} /> <span className="hidden sm:inline">Thêm mới</span>
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Info</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500"><FontAwesomeIcon icon={faSpinner} spin /> Đang tải...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500">Không tìm thấy user nào.</td></tr>
              ) : (
                filteredUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
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
                    <td className="px-6 py-4 text-sm text-gray-500">{user.username}</td>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleOpenEdit(user)} className="text-indigo-600 hover:text-indigo-900 mr-4" title="Sửa">
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      
                      {/* 5. NÚT XÓA GỌI HÀM requestDelete */}
                      <button 
                        onClick={() => requestDelete(user.id, user.name || user.email)}
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
      </div>

      {/* Drawer Thêm/Sửa */}
      <AddUserDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        initialData={selectedUser} 
      />

      {/* 6. MODAL XÓA (MỚI) */}
      <ConfirmModal 
        isOpen={deleteConfig.isOpen}
        onClose={() => setDeleteConfig({ ...deleteConfig, isOpen: false })}
        onConfirm={onConfirmDelete}
        title="Xóa Thành Viên"
        message={`Bạn có chắc chắn muốn xóa user "${deleteConfig.userName}"? Hành động này không thể hoàn tác.`}
      />

    </div>
  );
}