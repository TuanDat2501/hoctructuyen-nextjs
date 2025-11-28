'use client';
import { useRouter } from 'next/navigation';
// src/app/(main)/layout.tsx
import React from 'react';
import AuthGuard from '../lib/component/AuthGuard';
import { logout } from '../lib/redux/features/auth/authSlice';
import { useAppDispatch } from '../lib/redux/hook';
import Footer from '../lib/component/Footer';
// Giả sử bạn đã tạo component Header và Footer


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    console.log('Logging out...');
    // 1. Xóa dữ liệu trong Redux và LocalStorage
    dispatch(logout());

    // 2. Chuyển hướng về trang Login
    router.push('/');
    
    // Mẹo nhỏ: Refresh lại trang để đảm bảo sạch sẽ mọi state rác (Optional)
    router.refresh(); 
  };
  return (
    <AuthGuard>
    <div className="flex flex-col min-h-screen">
      {/* Header cố định ở trên */}
      <header>
            <div className="top-bar">
              <div className="container">
                <div className="logo" onClick={()=> router.push('/dashboard')}>
                  <img src="123png150.png" alt="Sano Logo"/>
                  <div className="logo-text">
                    Đào Tạo Chuyên Môn Nội Bộ Sano Media
                    {/* <span>TRAINING BIM TOOLS & WORKFLOW</span> */}
                  </div>
                </div>
                {/* <div className="contact-info">
                  <span><i className="fas fa-phone"></i> Tư vấn & hỗ trợ: 0974 114 905</span>
                  <span><i className="fas fa-envelope"></i> training@dscons.vn</span>
                </div> */}
                <div className="auth-buttons" onClick={handleLogout}>
                  {/* <button className="btn btn-register"><i className="fas fa-user-plus"></i> Đăng Ký</button> */}
                  <button className="btn btn-login"><i className="fas fa-sign-in-alt" ></i> Đăng Xuất</button>
                </div>
              </div>
            </div>

            {/* <div className="main-nav">
              <div className="container">
                <div className="logo">
                  <img src="https://via.placeholder.com/150x50?text=DSCons" alt="DSCons Logo" />
                  <div className="logo-text">
                    DSCons
                    <span>TRAINING BIM TOOLS & WORKFLOW</span>
                  </div>
                </div>
                <nav>
                  <ul>
                    <li><a href="#"><i className="fas fa-home"></i> Trang chủ</a></li>
                    <li><a href="#"><i className="fas fa-star"></i> KH mới</a></li>
                    <li><a href="#"><i className="fas fa-gift"></i> KH tặng kèm</a></li>
                    <li><a href="#"><i className="fas fa-clock"></i> Lộ trình</a></li>
                    <li><a href="#"><i className="fas fa-folder-open"></i> Tài liệu <i
                      className="fas fa-chevron-down"></i></a></li>
                    <li><a href="#"><i className="fas fa-chart-line"></i> CTV</a></li>
                    <li><a href="#"><i className="fas fa-user-friends"></i> DSCons</a></li>
                  </ul>
                </nav>
                <div className="cart-icon">
                  <i className="fas fa-shopping-cart"></i>
                  <span className="cart-count">0</span>
                </div>
              </div>
            </div> */}
          </header>

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
