'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hook';
import { fetchCourses } from '@/app/lib/redux/features/course/courseSlice';
import UserCourseSection from '@/app/lib/component/UserCourseSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function UserDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items: courses, loading } = useAppSelector((state: any) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // --- LOGIC NHÓM KHÓA HỌC THEO DANH MỤC ---
  const groupedCourses = courses.reduce((acc: any, course: any) => {
    // Lấy tên danh mục, nếu không có thì cho vào nhóm "Khác"
    const catName = course.category?.name || 'Khóa học khác';
    
    if (!acc[catName]) {
      acc[catName] = [];
    }
    acc[catName].push(course);
    return acc;
  }, {});
  // Kết quả groupedCourses sẽ là: { "Văn hoá": [...], "Kỹ năng": [...] }

  return (
    <div className="space-y-8 pb-10">
      
      {/* 1. Phần Welcome (Giữ nguyên) */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Xin chào, {user?.name || 'Học viên'}! 👋</h1>
          <p className="opacity-90 text-indigo-100">Chúc bạn một ngày làm việc và học tập hiệu quả.</p>
          
          {/* Thống kê nhanh */}
          <div className="mt-8 flex gap-6">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-xl">
                   <FontAwesomeIcon icon={faFire} className="text-yellow-300" />
                </div>
                <div>
                   <p className="text-xs uppercase font-bold opacity-70 tracking-wider">Tổng khóa</p>
                   <p className="text-2xl font-bold">{courses.length}</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 2. Phần Danh sách Khóa học (Đã chia nhóm) */}
      <div>
        {loading ? (
           <div className="flex justify-center py-20 text-gray-400">
              <FontAwesomeIcon icon={faSpinner} spin className="text-3xl" />
           </div>
        ) : (
           // Duyệt qua từng nhóm danh mục để render Section
           Object.entries(groupedCourses).map(([categoryName, categoryCourses]: [string, any]) => (
             <UserCourseSection 
               key={categoryName} 
               title={categoryName} 
               courses={categoryCourses} 
             />
           ))
        )}

        {/* Nếu không có khóa học nào */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Hiện chưa có khóa học nào được kích hoạt.
          </div>
        )}
      </div>

    </div>
  );
}