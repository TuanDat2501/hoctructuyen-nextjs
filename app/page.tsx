'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from './lib/redux/hook';
import { loginUser } from './lib/redux/features/auth/authSlice';
import { RootState } from './lib/redux/store';

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Lấy state từ Redux
  const { loading, error, user } = useAppSelector((state:RootState) => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Nếu login thành công -> Chuyển sang Dashboard
  useEffect(() => {
    if (user) {
      // Nếu là Admin -> Vào trang quản trị riêng
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } 
      // Nếu là User thường -> Vào trang Dashboard chung
      else {
        router.push('/dashboard'); 
        // Hoặc router.push('/'); tùy trang chủ của bạn
      }
    }
  }, [user, router]);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-500 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Please login to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Thông báo lỗi */}
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          {/* username */}
          <div className="relative">
            <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-indigo-500 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              required
            />
          </div>

          {/* Button */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 shadow-lg
              ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30'}
            `}
          >
            {loading ? 'Processing...' : 'LOGIN'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;