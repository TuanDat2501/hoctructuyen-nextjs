'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartPie, faUsers, faCogs, faSignOutAlt, faUserCircle, 
  faBook
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../lib/redux/hook';
import { logout } from '../lib/redux/features/auth/authSlice';
import AuthGuard from '../lib/component/AuthGuard';

// Import các thứ đã setup trước đó


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  // Lấy user từ Redux để hiển thị lên Header
  const { user } = useAppSelector((state) => state.auth);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  // Danh sách menu sidebar
  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: faChartPie },
    { href: '/admin/users', label: 'Quản lý Users', icon: faUsers },
    { href: '/admin/courses', label: 'Quản lý Khóa học', icon: faBook },
    { href: '/admin/settings', label: 'Cài đặt', icon: faCogs },
  ];

  return (
    // 1. BẢO VỆ ROUTE BẰNG AUTHGUARD
    <AuthGuard>
      <div className="flex h-screen bg-gray-100">
        
        {/* === SIDEBAR (Cột trái) === */}
        {/* hidden md:flex: Ẩn trên mobile, hiện trên desktop (md trở lên) */}
        <aside className="w-64 bg-indigo-900 text-white hidden md:flex flex-col shadow-xl z-10">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center font-bold text-xl border-b border-indigo-800 shadow-sm">
            <span className="text-indigo-300 mx-2">Next</span>Admin
          </div>

          {/* Menu items */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors font-medium
                    ${isActive 
                      ? 'bg-indigo-800 text-white shadow-inner' 
                      : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}
                  `}
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-3 w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          {/* Nút Logout */}
          <div className="p-4 border-t border-indigo-800">
             <button 
               onClick={handleLogout}
               className="w-full flex items-center px-4 py-3 text-indigo-200 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors font-medium"
             >
               <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 w-5 h-5" />
               Đăng xuất
             </button>
          </div>
        </aside>

        {/* === MAIN AREA (Khu vực chính bên phải) === */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* --- Header --- */}
          <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800 text-lg">
              {/* Lấy tiêu đề dựa trên path hiện tại */}
              {navItems.find(i => i.href === pathname)?.label || 'Tổng quan'}
            </h2>

            {/* User info góc phải */}
            <div className="flex items-center space-x-3 border-l pl-6 border-gray-200">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-gray-800">{user?.name || 'Admin'}</p>
                 <p className="text-xs text-gray-500">{user?.role || 'Super Admin'}</p>
               </div>
               <FontAwesomeIcon icon={faUserCircle} className="text-indigo-600 text-4xl shadow-sm rounded-full" />
            </div>
          </header>

          {/* --- Content Body (Phần thay đổi giữa các trang) --- */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            {children}
          </main>

        </div>
      </div>
    </AuthGuard>
  );
}