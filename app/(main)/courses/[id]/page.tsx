'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import axiosInstance from '@/app/lib/axios';
import CourseAccordion from '@/app/lib/component/CourseAccordion';

export default function CourseLearningPage() {
  const params = useParams(); // Lấy ID từ URL
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State: Bài học đang xem (Mặc định null)
  const [activeLesson, setActiveLesson] = useState<any>(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        // Gọi API lấy full dữ liệu
        const data:any = await axiosInstance.get(`/courses/${params.id}`);
        setCourse(data);

        // Tự động chọn bài đầu tiên của chương đầu tiên để phát
        if (data.sections?.length > 0 && data.sections[0].lessons?.length > 0) {
          setActiveLesson(data.sections[0].lessons[0]);
        }
      } catch (error) {
        console.error("Lỗi tải khóa học", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCourseDetail();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <FontAwesomeIcon icon={faCircleNotch} spin className="text-4xl text-indigo-600" />
      </div>
    );
  }

  if (!course) return <div className="p-10 text-center">Khóa học không tồn tại.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]"> {/* Trừ đi chiều cao Header */}
      
      {/* 1. THANH ĐIỀU HƯỚNG NHỎ TRÊN CÙNG */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center gap-4 shrink-0">
        <Link href="/dashboard" className="hover:text-gray-300">
           <FontAwesomeIcon icon={faChevronLeft} /> Quay lại
        </Link>
        <h1 className="font-bold truncate border-l border-gray-700 pl-4">
          {course.title}
        </h1>
      </div>

      {/* 2. KHU VỰC HỌC TẬP (Chia 2 cột) */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        
        {/* --- CỘT TRÁI: VIDEO PLAYER (Chiếm 70%) --- */}
        <div className="flex-1 bg-black flex flex-col relative">
          {activeLesson ? (
            <div className="w-full h-full relative group">
              {/* Iframe Youtube */}
              <iframe 
                className="w-full h-full absolute inset-0"
                src={`https://www.youtube.com/embed/${activeLesson.videoId}?autoplay=1&rel=0&modestbranding=1`} 
                title={activeLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          ) : (
             <div className="flex items-center justify-center h-full text-white">
               Chọn bài học để bắt đầu
             </div>
          )}
        </div>

        {/* --- CỘT PHẢI: DANH SÁCH BÀI HỌC (Chiếm 30%) --- */}
        <div className="w-full lg:w-96 bg-white border-l border-gray-200 overflow-y-auto shrink-0 flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold text-gray-800">Nội dung khóa học</h2>
            <p className="text-xs text-gray-500 mt-1">
              {course.sections.length} chương • {course.lessons} bài học
            </p>
          </div>
          
          {/* Component Accordion danh sách */}
          <div className="flex-1">
             <CourseAccordion 
               sections={course.sections} 
               activeLessonId={activeLesson?.id}
               onSelectLesson={(lesson) => setActiveLesson(lesson)}
             />
          </div>
        </div>

      </div>
      
      {/* 3. Footer thông tin bài học (Dưới video) */}
      <div className="p-6 bg-white border-t overflow-y-auto lg:hidden">
          <h2 className="text-xl font-bold mb-2">{activeLesson?.title}</h2>
          <p className="text-gray-600 text-sm">Cập nhật lần cuối: {new Date(course.updatedAt).toLocaleDateString()}</p>
      </div>

    </div>
  );
}