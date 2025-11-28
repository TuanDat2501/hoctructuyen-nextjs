'use client';

import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faBookOpen, faUserTie, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { fetchCourses } from '../redux/features/course/courseSlice';
import Link from 'next/link';
export default function UserCourseSection() {
  const dispatch = useAppDispatch();
  // Lấy danh sách khóa học từ Redux
  const { items: courses, loading } = useAppSelector((state: any) => state.courses);

  useEffect(() => {
    // Chỉ gọi API nếu danh sách đang rỗng (để tránh gọi lại nhiều lần nếu dashboard re-render)
    if (courses?.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, courses?.length]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-100vh">
      
      {/* Tiêu đề Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FontAwesomeIcon icon={faLayerGroup} className="text-indigo-600" />
          Khóa Học Dành Cho Bạn
        </h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {courses?.length} khóa học
        </span>
      </div>

      {/* Grid danh sách */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {[1, 2, 3].map(i => (
             <div key={i} className="bg-gray-100 h-64 rounded-xl animate-pulse"></div>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses?.map((course: any) => (
            <div key={course.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
              
              {/* Ảnh Thumbnail */}
              <div className="aspect-video w-full bg-gray-100 relative overflow-hidden">
                 <img 
                   src={course.thumbnail || 'https://placehold.co/600x400?text=Course'} 
                   alt={course.title}
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                 />
                 {/* Nút Play hiện khi hover */}
                 <Link href={`/courses/${course.id}`} className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FontAwesomeIcon icon={faPlayCircle} className="text-white text-4xl drop-shadow-md" />
                 </Link>
              </div>

              {/* Thông tin */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors h-12">
                  {course.title}
                </h3>

                <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faUserTie} /> {course.instructor}
                  </span>
                  <span className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
                    <FontAwesomeIcon icon={faBookOpen} /> {course.lessons} bài
                  </span>
                </div>

                <Link 
                  href={`/courses/${course.id}`}
                  className="w-full mt-auto bg-gray-50 hover:bg-indigo-600 hover:text-white text-gray-700 font-bold py-2 rounded-lg transition-all text-sm border border-gray-200 hover:border-indigo-600 flex items-center justify-center"
                >
                  VÀO HỌC
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State nếu không có khóa học */}
      {!loading && courses?.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          Hiện chưa có khóa học nào được kích hoạt.
        </div>
      )}
    </div>
  );
}