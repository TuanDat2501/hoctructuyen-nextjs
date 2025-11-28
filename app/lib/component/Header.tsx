'use client';
import { useAppDispatch } from '../redux/hook';
import { useRouter } from 'next/navigation';
import { logout } from '../redux/features/auth/authSlice';
import UserProfile from './UserProfile';
export default function Header() {
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
                <div className="contact-info">
                  <UserProfile />
                </div>
                {/* <div className="auth-buttons" onClick={handleLogout}>
                  <button className="btn btn-register"><i className="fas fa-user-plus"></i> Đăng Ký</button>
                  <button className="btn btn-login"><i className="fas fa-sign-in-alt" ></i> Đăng Xuất</button>
                </div> */}
              </div>
            </div>
          </header>
  );
}