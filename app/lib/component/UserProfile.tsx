'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '../redux/hook';
import LogoutButton from './LogoutButton';
import { useRouter } from 'next/navigation';

export default function UserProfile() {
    // Lấy thông tin user từ Redux Store
    const { user } = useAppSelector((state: any) => state.auth);
    const router = useRouter();
    // Nếu chưa đăng nhập (hoặc chưa load xong) thì không hiện gì
    if (!user) return null;
    const handleGotoProfile = () => {
        router.push('/profile');
    }
    // Lấy chữ cái đầu của tên để làm Avatar giả (VD: "Nam" -> "N")
    const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : 'U';
    return (
        <div className="flex items-center gap-3">
            {/* 1. Phần Thông tin User (Tên + Avatar) */}
            <div className="flex items-center gap-2 text-right" onClick={handleGotoProfile} style={{ cursor: 'pointer' }}>

                {/* Tên User */}
                <div className="hidden md:block"> {/* Ẩn trên mobile cho gọn */}
                    <p className="text-sm font-bold text-gray-700 leading-none">
                        {user.name || "Người dùng"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {user.username ? `@${user.username}` : 'Học viên'}
                    </p>
                </div>

                {/* Avatar tròn */}
                <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                    {firstLetter}
                </div>
            </div>

            {/* Đường kẻ dọc ngăn cách (Trang trí) */}
            <div className="h-8 w-[1px] bg-gray-300 mx-1"></div>

            {/* 2. Nút Đăng Xuất (Component cũ của bạn) */}
            <div>
                <LogoutButton />
            </div>

        </div>
    );
}