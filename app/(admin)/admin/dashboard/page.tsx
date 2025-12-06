'use client';

import React, { useEffect } from 'react';

import { faUsers, faDollarSign, faUserShield, faChartLine, faBookOpen, faCheck, faClock } from '@fortawesome/free-solid-svg-icons';
import { fetchStats, fetchUsers, updateUser } from '@/app/lib/redux/features/admin/adminSlice';
import StatsCard from '@/app/lib/component/StatsCard';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hook';
import UserGrowthChart from '@/app/lib/component/admin/chart/UserGrowChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toast from 'react-hot-toast';


export default function DashboardPage() {
  const dispatch = useAppDispatch();
  // Lấy dữ liệu từ Redux Store
  const { stats, users, loading } = useAppSelector((state) => state.admin);
  const pendingUsers = users.filter((u: any) => u.status === 'pending');
  // Gọi API ngay khi trang vừa load
  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleQuickApprove = async (userId: string, name: string) => {
    await toast.promise(
      dispatch(updateUser({ id: userId, data: { status: 'active' } })).unwrap(),
      {
        loading: 'Đang duyệt...',
        success: `Đã duyệt thành viên ${name}!`,
        error: 'Lỗi khi duyệt.',
      }
    );
    // Sau khi duyệt xong, user đó sẽ tự biến mất khỏi danh sách này (vì status != pending nữa)
  };

  return (
    <div className="space-y-6">
      {/* 1. Stats Cards (Dữ liệu thật) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Card 1: Tổng User */}
        <StatsCard
          title="Tổng User"
          value={stats.totalUsers}
          icon={faUsers}
          color="bg-blue-500"
        />

        {/* Card 2: Số Admin */}
        <StatsCard
          title="Số lượng Admin"
          value={stats.totalAdmins}
          icon={faUserShield}
          color="bg-purple-500"
        />

        {/* Card 3: User Mới */}
        <StatsCard
          title="User mới (Tháng)"
          value={stats.newUsersThisMonth}
          icon={faChartLine}
          color="bg-orange-500"
        />

        {/* Card 4: Tổng Khóa Học (Đã thay đổi) */}
        <StatsCard
          title="Tổng Khóa Học"
          value={stats.totalCourses} // Số liệu thật từ DB
          icon={faBookOpen}          // Icon quyển sách
          color="bg-green-500"       // Màu xanh lá giống ảnh
        />

      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ Line chiếm 2/3 màn hình */}
        <div className="lg:col-span-2">
          {/* Truyền dữ liệu từ Redux vào Chart */}
          <UserGrowthChart data={stats?.userGrowthChart || []} />
        </div>

        {/* Khu vực bên phải (Có thể để thông báo hoặc Top khóa học sau này) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Hoạt động gần đây</h3>
          <p className="text-sm text-gray-500">Chưa có dữ liệu.</p>
        </div>
      </div>
      
      {/* 2. Bảng User (Dữ liệu thật) */}
      <div className="bg-white rounded-xl shadow-sm border border-yellow-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-yellow-100 flex justify-between items-center bg-yellow-50">
          <h3 className="font-bold text-yellow-800 flex items-center gap-2">
            <FontAwesomeIcon icon={faClock} /> 
            Danh sách chờ duyệt ({pendingUsers.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          {pendingUsers.length === 0 ? (
             <div className="p-10 text-center text-gray-400">
                Không có yêu cầu đăng ký nào mới.
             </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đăng ký</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingUsers.map((u: any) => (
                  <tr key={u.id} className="hover:bg-yellow-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                         <div className="h-8 w-8 rounded-full bg-yellow-200 text-yellow-700 flex items-center justify-center font-bold text-xs mr-3">
                            {u.name?.charAt(0).toUpperCase() || 'U'}
                         </div>
                         <div className="text-sm font-medium text-gray-900">{u.name || 'Chưa đặt tên'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleQuickApprove(u.id, u.name)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1 ml-auto"
                      >
                        <FontAwesomeIcon icon={faCheck} /> DUYỆT NGAY
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}