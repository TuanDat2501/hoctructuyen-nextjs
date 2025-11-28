'use client';

import React, { useEffect } from 'react';

import { faUsers, faDollarSign, faUserShield, faChartLine, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { fetchStats, fetchUsers } from '@/app/lib/redux/features/admin/adminSlice';
import StatsCard from '@/app/lib/component/StatsCard';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hook';


export default function DashboardPage() {
  const dispatch = useAppDispatch();
  // Lấy dữ liệu từ Redux Store
  const { stats, users, loading } = useAppSelector((state) => state.admin);

  // Gọi API ngay khi trang vừa load
  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchUsers());
  }, [dispatch]);

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

      {/* 2. Bảng User (Dữ liệu thật) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800">Danh sách User ({users.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-10 text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.name || 'Chưa đặt tên'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString('vi-VN')}
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