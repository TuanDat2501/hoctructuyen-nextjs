'use client';
import { useRouter } from 'next/navigation';
// src/app/(main)/layout.tsx
import React from 'react';
import AuthGuard from '../lib/component/AuthGuard';
import { logout } from '../lib/redux/features/auth/authSlice';
import { useAppDispatch } from '../lib/redux/hook';
import Footer from '../lib/component/Footer';
import Header from '../lib/component/Header';
// Giả sử bạn đã tạo component Header và Footer


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  return (
    <AuthGuard>
    <div className="flex flex-col min-h-screen">
      {/* Header cố định ở trên */}
      <Header />

      {/* Phần giữa thay đổi (children) */}
      {/* flex-grow giúp nó đẩy Footer xuống đáy nếu nội dung ngắn */}
      <main className="flex-grow bg-gray-50 p-6">
        {children}
      </main>

      {/* Footer cố định ở dưới */}
      <Footer />
    </div>
  </AuthGuard>
  );
}

function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
