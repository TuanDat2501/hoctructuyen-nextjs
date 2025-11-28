'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hook';
import { fetchUserProfile } from '../redux/features/auth/authSlice';



export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check xem có token không
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (token) {
      // Nếu có token -> Gọi API lấy thông tin User nạp vào Redux
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  return <>{children}</>;
}