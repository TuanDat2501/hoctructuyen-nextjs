'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '../redux/hook';


export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  // State này để tránh flash nội dung khi chưa check xong
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    // 1. TRƯỜNG HỢP: Không có token -> Đá về Login ngay
    if (!token) {
      router.push('/');
      return;
    }

    // 2. TRƯỜNG HỢP: Có token nhưng chưa có User (Đang F5 hoặc đang load)
    if (token && !user) {
      // KHÔNG LÀM GÌ CẢ (return). 
      // Hãy để giao diện hiện Loading và chờ AuthProvider gọi API xong.
      // Nếu API lỗi -> AuthProvider sẽ tự xóa token -> Lúc đó AuthGuard sẽ chạy lại vào case 1.
      return; 
    }

    // 3. TRƯỜNG HỢP: Đã có User (Load xong xuôi) -> Check quyền
    if (user) {
      // Nếu vào trang admin mà không phải admin -> Đá về Dashboard thường
      if (pathname.startsWith('/admin') && user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      
      // Mọi thứ OK -> Cho phép hiển thị
      setIsChecking(false);
    }
  }, [user, router, pathname]);

  // --- LOGIC HIỂN THỊ LOADING ---
  // Lấy token trực tiếp từ localStorage để check
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  // Nếu đang check, HOẶC (có token mà chưa có user) -> Thì hiện Loading
  if (isChecking || (token && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
            <span className="text-gray-500 text-sm font-medium">Đang khôi phục dữ liệu...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}