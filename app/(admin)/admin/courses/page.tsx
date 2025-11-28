'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faPlus, faEdit, faTrash, faFileAlt, faBookOpen, faChalkboardTeacher, faSpinner 
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hook';
import { deleteCourse, fetchCourses } from '@/app/lib/redux/features/course/courseSlice';

export default function CoursesPage() {
  const dispatch = useAppDispatch();
  
  // Lấy dữ liệu từ Redux (Sử dụng optional chaining ?. để tránh lỗi nếu state chưa init)
  const { items: courses = [], loading } = useAppSelector((state: any) => state.courses || {});
  
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Load dữ liệu khi vào trang
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // 2. Logic Xóa khóa học
  const handleDelete = async (id: string, title: string) => {
    if (confirm(`CẢNH BÁO: Bạn có chắc muốn xóa khóa học:\n"${title}"?\n\nHành động này sẽ xóa luôn các chương và bài học bên trong!`)) {
      await dispatch(deleteCourse(id));
    }
  };

  // 3. Logic Tìm kiếm (Client-side search)
  const filteredCourses = Array.isArray(courses) ? courses.filter((c: any) => 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="space-y-6">
      
      {/* --- HEADER: Tiêu đề + Tìm kiếm + Nút Thêm --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-2">
           <h1 className="text-xl font-bold text-gray-800">Quản Lý Khóa Học</h1>
           <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold">
             {filteredCourses.length}
           </span>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          {/* Ô tìm kiếm */}
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="Nhập tên khóa học..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Nút Thêm Mới */}
          <Link 
            href="/admin/courses/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm flex items-center gap-2 transition-all text-sm whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faPlus} /> <span className="hidden sm:inline">Thêm mới</span>
          </Link>
        </div>
      </div>

      {/* --- CONTENT: Danh sách khóa học --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
           <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-indigo-500 mb-3" />
           <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {filteredCourses.length === 0 ? (
            // Empty State
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="text-gray-300 text-5xl mb-4">
                 <FontAwesomeIcon icon={faBookOpen} />
              </div>
              <p className="text-gray-500 font-medium">Không tìm thấy khóa học nào.</p>
              <p className="text-xs text-gray-400 mt-1">Hãy thử từ khóa khác hoặc thêm khóa học mới.</p>
            </div>
          ) : (
            // Grid Layout
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: any) => (
                <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow overflow-hidden group">
                  
                  {/* Phần Ảnh Thumbnail */}
                  <div className="aspect-video w-full bg-gray-100 relative overflow-hidden border-b border-gray-50">
                     <img 
                       src={course.thumbnail || 'https://placehold.co/600x400?text=Course'} 
                       alt={course.title}
                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                       onError={(e) => {
                          // Fallback nếu ảnh lỗi
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                       }}
                     />
                     {/* Badge số bài học */}
                     <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm shadow-sm">
                        <FontAwesomeIcon icon={faBookOpen} className="mr-1" />
                        {course.lessons || 0} bài
                     </div>
                  </div>

                  {/* Phần Thông tin */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Tên khóa học */}
                    <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-2 min-h-[3rem] group-hover:text-indigo-600 transition-colors" title={course.title}>
                      {course.title}
                    </h3>
                    
                    {/* Giảng viên */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                       <FontAwesomeIcon icon={faChalkboardTeacher} className="text-indigo-400" />
                       <span className="truncate">{course.instructor || 'Chưa cập nhật'}</span>
                    </div>

                    {/* Toolbar Hành động (Footer Card) */}
                    <div className="mt-auto flex items-center justify-between border-t pt-3 border-gray-100 gap-2">
                      
                      <div className="flex gap-1 flex-1">
                        {/* Nút Sửa (Thông tin chung) */}
                        <Link 
                          href={`/admin/courses/${course.id}/edit`} 
                          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold py-2 rounded flex items-center justify-center gap-1 transition-colors border border-blue-100" 
                          title="Sửa thông tin"
                        >
                           <FontAwesomeIcon icon={faEdit} /> Sửa
                        </Link>
                        
                        {/* Nút Nội dung (Quản lý video) */}
                        <Link 
                          href={`/admin/courses/${course.id}/content`} 
                          className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold py-2 rounded flex items-center justify-center gap-1 transition-colors border border-indigo-100" 
                          title="Soạn thảo nội dung"
                        >
                           <FontAwesomeIcon icon={faFileAlt} /> Nội dung
                        </Link>
                      </div>
                      
                      {/* Nút Xóa */}
                      <button 
                        onClick={() => handleDelete(course.id, course.title)}
                        className="bg-white hover:bg-red-50 text-red-500 border border-gray-200 hover:border-red-200 p-2 rounded transition-colors" 
                        title="Xóa khóa học"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}