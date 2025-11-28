'use client';
import { useRouter } from 'next/navigation';
import './style.scss';
import UserCourseSection from '@/app/lib/component/UserCourseSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faFire } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '@/app/lib/redux/hook';

export default function LearnComponent() {
  const router = useRouter();
  const handleClick = (param:any) => {
    // Xử lý logic login ở đây...
    // Sau đó chuyển hướng:
    router.push(param);
  };
  const { user } = useAppSelector((state) => state.auth);
  return (
    <>
     {/* <section className="course-section">
        <div className="container course" >
          <h2 className="section-title">KHÓA HỌC MỚI 2025</h2>
          <div className="course-grid">
            <div className="course-card" onClick={() => handleClick('/learn?name=Edit')}>
              <div className="course-image-wrapper">
                <img src="https://via.placeholder.com/400x225?text=Mô+hình+hóa+hệ+thống+Điện"
                  alt="Mô hình hóa 3D hệ thống Điện trong công trình"/>
              </div>
              <div className="course-details">
                <div className="course-meta">
                  <span><i className="far fa-clock"></i> 10h học</span>
                  <span><i className="fas fa-file-alt"></i> 10 phần/58 bài</span>
                  <span><i className="fas fa-eye"></i> 20075</span>
                </div>
                <h3 className="course-title">EDIT</h3>
                <div className="course-instructor">
                  <i className="fas fa-user-circle"></i> Mai Hoàng Nam
                </div>
              </div>
            </div>

            <div className="course-card"  onClick={() => handleClick('/learn?name=Content')}>
              <div className="course-image-wrapper">
                <img src="https://via.placeholder.com/400x225?text=Hướng+dẫn+thiết+kế+CV"
                  alt="Thiết kế CV kiểu mới & Kỹ năng phỏng vấn hiệu quả"/>
              </div>
              <div className="course-details">
                <div className="course-meta">
                  <span><i className="far fa-clock"></i> 9 giờ</span>
                  <span><i className="fas fa-file-alt"></i> 7 phần/64 bài</span>
                  <span><i className="fas fa-eye"></i> 10581</span>
                </div>
                <h3 className="course-title">CONTENT</h3>
                <div className="course-instructor">
                  <i className="fas fa-user-circle"></i> Mai Hoàng Nam
                </div>
              </div>
            </div>

            <div className="course-card">
              <div className="course-image-wrapper">
                <img src="https://via.placeholder.com/400x225?text=Revit+Central"
                  alt="Triển khai Revit Central & Phối hợp làm việc nhóm hiệu quả"/>
              </div>
              <div className="course-details">
                <div className="course-meta">
                  <span><i className="far fa-clock"></i> 6 giờ</span>
                  <span><i className="fas fa-file-alt"></i> 6 phần/65 bài</span>
                  <span><i className="fas fa-eye"></i> 16046</span>
                </div>
                <h3 className="course-title">Triển khai Revit Central - Làm việc nhóm hiệu quả</h3>
                <div className="course-instructor">
                  <i className="fas fa-user-circle"></i> Mai Hoàng Nam
                </div>
                <div className="course-price">
                  <span className="old-price">2.500.000₫</span>
                  <span className="current-price">996.000₫</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <div className="space-y-8">
      
      {/* 1. Phần Welcome & Thống kê nhanh */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Box Chào mừng */}
        <div className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Xin chào, {user?.name || 'Học viên'}! 👋</h1>
          <p className="opacity-90">Chào mừng bạn quay trở lại hệ thống đào tạo nội bộ.</p>
          {/* <div className="mt-6 flex gap-4">
             <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-white text-indigo-600 rounded-full flex items-center justify-center font-bold">
                   <FontAwesomeIcon icon={faFire} />
                </div>
                <div>
                   <p className="text-xs opacity-80">Đang học</p>
                   <p className="font-bold text-lg">3 Khóa</p>
                </div>
             </div>
             <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-white text-green-600 rounded-full flex items-center justify-center font-bold">
                   <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <div>
                   <p className="text-xs opacity-80">Hoàn thành</p>
                   <p className="font-bold text-lg">12 Bài</p>
                </div>
             </div>
          </div> */}
        </div>

        {/* Box Thông báo / News (Demo UI) */}
        <div className="w-full md:w-1/3 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
           <h3 className="font-bold text-gray-800 mb-4">Thông báo mới</h3>
           <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-2">
                 <span className="w-2 h-2 mt-1.5 rounded-full bg-red-500 shrink-0"></span>
                 Lịch training Revit dời sang thứ 6.
              </li>
              <li className="flex gap-2">
                 <span className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0"></span>
                 Cập nhật tài liệu khóa M&E.
              </li>
              <li className="flex gap-2">
                 <span className="w-2 h-2 mt-1.5 rounded-full bg-gray-300 shrink-0"></span>
                 Bảo trì hệ thống vào cuối tuần.
              </li>
           </ul>
        </div>
      </div>

      {/* 2. Phần Danh sách Khóa học (Component bạn cần) */}
      <UserCourseSection />
      
    </div>
    </>
  );
}