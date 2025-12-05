'use client';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faTrash, faPen, faPlus, faUserShield, faUser, faCheck, faBan, faSpinner, faClock 
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hook';
import { deleteUser, fetchUsers, updateUser } from '@/app/lib/redux/features/admin/adminSlice';
import AddUserDrawer from '@/app/lib/component/AddUserDrawer';
import ConfirmModal from '@/app/lib/component/admin/ConfirmModal';

export default function UserManagementPage() {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state: any) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteConfig, setDeleteConfig] = useState<{isOpen: boolean; userId: string | null; userName: string;}>({ isOpen: false, userId: null, userName: '' });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleOpenCreate = () => { setSelectedUser(null); setIsDrawerOpen(true); };
  const handleOpenEdit = (user: any) => { setSelectedUser(user); setIsDrawerOpen(true); };

  const requestDelete = (id: string, name: string) => {
    setDeleteConfig({ isOpen: true, userId: id, userName: name });
  };

  const onConfirmDelete = async () => {
    if (!deleteConfig.userId) return;
    await toast.promise(dispatch(deleteUser(deleteConfig.userId)).unwrap(), {
        loading: 'Đang xóa...', success: 'Đã xóa!', error: 'Lỗi xóa.'
    });
    setDeleteConfig({ isOpen: false, userId: null, userName: '' });
  };

  // --- HÀM ĐỔI TRẠNG THÁI (DUYỆT / KHÓA) ---
  const handleStatusChange = async (userId: string, newStatus: string) => {
    const actionName = newStatus === 'active' ? 'Duyệt' : 'Khóa';
    
    await toast.promise(
      dispatch(updateUser({ id: userId, data: { status: newStatus } })).unwrap(),
      {
        loading: `Đang ${actionName}...`,
        success: `${actionName} thành công!`,
        error: `Lỗi khi ${actionName}`,
      }
    );
  };

  const filteredUsers = users.filter((user: any) => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản Lý Thành Viên</h1>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" placeholder="Tìm tên, email..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button onClick={handleOpenCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap">
            <FontAwesomeIcon icon={faPlus} /> Thêm mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Info</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-10 text-gray-500"><FontAwesomeIcon icon={faSpinner} spin /> Đang tải...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-gray-500">Không tìm thấy user nào.</td></tr>
              ) : (
                filteredUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    
                    {/* Cột Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name || 'Chưa đặt tên'}</div>
                          <div className="text-sm text-gray-500">{user.username || user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Cột Role */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === 'admin' ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 gap-1 items-center">
                          <FontAwesomeIcon icon={faUserShield} /> Admin
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 gap-1 items-center">
                          <FontAwesomeIcon icon={faUser} /> User
                        </span>
                      )}
                    </td>

                    {/* Cột Status (Mới) */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {user.status === 'pending' && (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 gap-1 items-center">
                          <FontAwesomeIcon icon={faClock} /> Chờ duyệt
                        </span>
                      )}
                      {user.status === 'active' && (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 gap-1 items-center">
                          <FontAwesomeIcon icon={faCheck} /> Hoạt động
                        </span>
                      )}
                      {user.status === 'banned' && (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 gap-1 items-center">
                          <FontAwesomeIcon icon={faBan} /> Đã khóa
                        </span>
                      )}
                    </td>

                    {/* Cột Hành động */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      
                      {/* Nút Duyệt (Chỉ hiện khi Pending) */}
                      {user.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusChange(user.id, 'active')}
                          className="text-green-600 hover:text-green-900 mr-3 bg-green-50 p-2 rounded hover:bg-green-100 transition-colors" 
                          title="Duyệt thành viên này"
                        >
                          <FontAwesomeIcon icon={faCheck} /> Duyệt
                        </button>
                      )}

                      {/* Nút Khóa (Chỉ hiện khi Active) */}
                      {user.status === 'active' && user.role !== 'admin' && (
                        <button 
                          onClick={() => handleStatusChange(user.id, 'banned')}
                          className="text-orange-500 hover:text-orange-700 mr-3 p-2 rounded hover:bg-orange-50" 
                          title="Khóa tài khoản"
                        >
                          <FontAwesomeIcon icon={faBan} />
                        </button>
                      )}

                      {/* Nút Mở khóa (Chỉ hiện khi Banned) */}
                      {user.status === 'banned' && (
                        <button 
                          onClick={() => handleStatusChange(user.id, 'active')}
                          className="text-green-600 hover:text-green-900 mr-3 p-2 rounded hover:bg-green-50" 
                          title="Mở khóa"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      )}

                      <button onClick={() => handleOpenEdit(user)} className="text-indigo-600 hover:text-indigo-900 mr-3 p-2 rounded hover:bg-indigo-50" title="Sửa">
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      
                      <button onClick={() => requestDelete(user.id, user.name)} className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50" title="Xóa">
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

      <AddUserDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} initialData={selectedUser} />
      <ConfirmModal isOpen={deleteConfig.isOpen} onClose={() => setDeleteConfig({ ...deleteConfig, isOpen: false })} onConfirm={onConfirmDelete} title="Xóa Thành Viên" message={`Bạn có chắc chắn muốn xóa user "${deleteConfig.userName}"?`} />
    </div>
  );
}