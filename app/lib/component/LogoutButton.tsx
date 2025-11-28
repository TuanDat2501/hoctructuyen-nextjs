'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '../redux/hook';
import { logout } from '../redux/features/auth/authSlice';

export default function LogoutButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // 1. Dispatch action logout để xóa state và token
    dispatch(logout());

    // 2. Chuyển hướng về trang đăng nhập
    router.push('/login');
    router.refresh(); // Refresh để xóa sạch các cache cũ của Next.js
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all flex items-center gap-2"
      title="Đăng xuất khỏi hệ thống"
    >
      <FontAwesomeIcon icon={faRightFromBracket} />
      <span>Đăng Xuất</span>
    </button>
  );
}