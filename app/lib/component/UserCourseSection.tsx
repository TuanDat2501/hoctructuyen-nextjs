'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faBookOpen, faUserTie, faLayerGroup, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

// Thêm props đầu vào
interface SectionProps {
  title: string;
  courses: any[];
}

export default function UserCourseSection({ title, courses }: SectionProps) {
  
  // Nếu không có khóa học nào trong danh mục này thì không hiện gì cả
  if (!courses || courses.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
      
      {/* Tiêu đề Section (Lấy từ Prop title) */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 uppercase">
          <FontAwesomeIcon icon={faLayerGroup} className="text-indigo-600" />
          {title}
        </h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {courses.length} khóa học
        </span>
      </div>

      {/* Grid danh sách */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course: any) => {
          
          // Tính % Tiến độ
          const total = course.lessons || 0;
          const completed = course.completedLessons || 0;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <div key={course.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
              
              {/* Thumbnail */}
              <div className="aspect-video w-full bg-gray-100 relative overflow-hidden">
                 <img 
                   src={course.thumbnail || 'https://placehold.co/600x400?text=Course'} 
                   alt={course.title}
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                 />
                 <Link href={`/courses/${course.id}`} className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FontAwesomeIcon icon={faPlayCircle} className="text-white text-4xl drop-shadow-md" />
                 </Link>
              </div>

              {/* Thông tin */}
              <div className="p-4 flex flex-col flex-1">
                
                {/* Badge Danh mục nhỏ (Optional) */}
                {course.category && (
                  <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                      {course.category.name}
                    </span>
                  </div>
                )}

                <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors h-12">
                  <Link href={`/courses/${course.id}`}>
                    {course.title}
                  </Link>
                </h3>

                <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faUserTie} /> {course.instructor}
                  </span>
                  <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
                    <FontAwesomeIcon icon={faBookOpen} /> {course.lessons} bài
                  </span>
                </div>

                {/* Thanh tiến độ */}
                <div className="mt-auto mb-3">
                    <div className="flex justify-between text-[10px] font-bold mb-1">
                       <span className={percent === 100 ? "text-green-600" : "text-gray-400"}>
                          {percent === 100 ? "Hoàn thành" : `${percent}%`}
                       </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                       <div 
                         className={`h-full rounded-full ${percent === 100 ? 'bg-green-500' : 'bg-indigo-500'}`} 
                         style={{ width: `${percent}%` }}
                       ></div>
                    </div>
                </div>

                <Link 
                  href={`/courses/${course.id}`}
                  className={`w-full font-bold py-2 rounded-lg transition-all text-sm border flex items-center justify-center gap-2
                    ${percent === 100 
                      ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-indigo-600 hover:text-indigo-600'}
                  `}
                >
                  {percent === 100 ? (
                    <><FontAwesomeIcon icon={faCheckCircle} /> XEM LẠI</>
                  ) : percent > 0 ? "HỌC TIẾP" : "BẮT ĐẦU HỌC"}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}