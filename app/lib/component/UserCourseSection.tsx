'use client';

import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faBookOpen, faUserTie, faLayerGroup, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { fetchCourses, reset } from '../redux/features/course/courseSlice';
import Link from 'next/link';
export default function UserCourseSection() {
  const dispatch = useAppDispatch();
  // Lấy danh sách khóa học từ Redux
  const { items: courses, loading } = useAppSelector((state: any) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses());
    console.log("Courses length:", courses?.length);
    
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
          {courses.map((course: any) => {
            
            // --- TÍNH % TIẾN ĐỘ ---
            const total = course.lessons || 0;
            const completed = course.completedLessons || 0;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-lg transition-all duration-300 group overflow-hidden">
                
                {/* Thumbnail (Giữ nguyên) */}
                <div className="aspect-video w-full bg-gray-100 relative overflow-hidden">
                   <img 
                     src={course.thumbnail || 'https://placehold.co/600x400?text=Course'} 
                     alt={course.title}
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                   />
                   <Link href={`/courses/${course.id}`} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FontAwesomeIcon icon={faPlayCircle} className="text-white text-5xl drop-shadow-lg scale-75 group-hover:scale-100 transition-transform" />
                   </Link>
                </div>

                {/* Thông tin */}
                <div className="p-5 flex flex-col flex-1">
                  
                  {/* Tên khóa học */}
                  <h3 className="font-bold text-gray-800 text-lg leading-snug mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors h-14">
                    <Link href={`/courses/${course.id}`}>{course.title}</Link>
                  </h3>

                  {/* Giảng viên & Số bài */}
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faUserTie} /> {course.instructor}
                    </span>
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                       <FontAwesomeIcon icon={faBookOpen} /> {course.lessons} bài
                    </span>
                  </div>

                  {/* --- THANH TIẾN ĐỘ (MỚI) --- */}
                  <div className="mt-auto mb-4">
                    <div className="flex justify-between text-xs font-bold mb-1">
                       <span className={percent === 100 ? "text-green-600" : "text-gray-500"}>
                          {percent === 100 ? "Đã hoàn thành" : `${percent}% hoàn thành`}
                       </span>
                       <span className="text-gray-400">{completed}/{total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                       <div 
                         className={`h-full rounded-full transition-all duration-500 ${percent === 100 ? 'bg-green-500' : 'bg-indigo-500'}`} 
                         style={{ width: `${percent}%` }}
                       ></div>
                    </div>
                  </div>

                  {/* Nút Vào Học */}
                  <Link 
                    href={`/courses/${course.id}`} 
                    className={`w-full font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm
                      ${percent === 100 
                        ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
                    `}
                  >
                    {percent === 100 ? (
                      <><FontAwesomeIcon icon={faCheckCircle} /> XEM LẠI</>
                    ) : percent > 0 ? (
                      "HỌC TIẾP"
                    ) : (
                      "BẮT ĐẦU HỌC"
                    )}
                  </Link>

                </div>
              </div>
            );
          })}
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