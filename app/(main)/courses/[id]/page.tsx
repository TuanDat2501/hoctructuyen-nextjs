'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hook';
import axiosInstance from '@/app/lib/axios';
import { fetchProgress, markLessonComplete } from '@/app/lib/redux/features/progress/progressSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faChevronLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

// Import Redux
import toast from 'react-hot-toast';
import CourseAccordion from '@/app/lib/component/CourseAccordion';

export default function CourseLearningPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<any>(null);

  // Lấy state tiến độ từ Redux
  const { completedLessonIds } = useAppSelector((state: any) => state.progress);

  // 1. Load Course Detail
  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const data:any = await axiosInstance.get(`/courses/${params.id}`);
        setCourse(data);

        // Chọn bài đầu tiên (Nếu chưa chọn)
        if (data.sections?.length > 0 && data.sections[0].lessons?.length > 0) {
          setActiveLesson(data.sections[0].lessons[0]);
        }
        // --- GỌI API LẤY TIẾN ĐỘ ---
        dispatch(fetchProgress(data.id));

      } catch (error) {
        console.error("Lỗi tải khóa học", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCourseDetail();
    }
  }, [params.id, dispatch]);

  // 2. Hàm xử lý: Hoàn thành bài học
  const handleMarkCompleted = async () => {
    if (!activeLesson || !course) return;

    await toast.promise(
      dispatch(markLessonComplete({ 
        lessonId: activeLesson.id, 
        courseId: course.id 
      })).unwrap(),
      {
        loading: 'Đang lưu...',
        success: 'Đã hoàn thành bài học! 🎉',
        error: 'Lỗi lưu tiến độ.',
      }
    );
    
    // Logic tự động chuyển bài (Optional): Bạn có thể code thêm ở đây để find next lesson
  };

  // Check xem bài hiện tại đã học xong chưa
  const isLessonCompleted = activeLesson && completedLessonIds.includes(activeLesson.id);

  if (loading) return <div className="h-screen flex items-center justify-center"><FontAwesomeIcon icon={faCircleNotch} spin className="text-4xl text-indigo-600" /></div>;
  if (!course) return <div className="p-10 text-center">Khóa học không tồn tại.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      
      {/* Top Bar */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center gap-4 shrink-0">
        <Link href="/dashboard" className="hover:text-gray-300 flex items-center gap-2 text-sm">
           <FontAwesomeIcon icon={faChevronLeft} /> Quay lại
        </Link>
        <h1 className="font-bold truncate border-l border-gray-700 pl-4 text-sm md:text-base">
          {course.title}
        </h1>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* CỘT TRÁI: VIDEO & CONTROLS */}
        <div className="flex-1 bg-black flex flex-col relative overflow-y-auto">
        <div className=""></div>
          {/* Video Player */}
          <div className="w-full aspect-video bg-black relative shadow-lg shrink-0">
            {activeLesson ? (
              <iframe 
                className="w-full h-full absolute inset-0"
                src={`https://www.youtube.com/embed/${activeLesson.videoId}?autoplay=1&rel=0&modestbranding=1`} 
                title={activeLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            ) : (
               <div className="flex items-center justify-center h-full text-white">Chọn bài học để bắt đầu</div>
            )}
          </div>

          {/* Action Bar (Dưới video) */}
          <div className="p-4 bg-white border-b flex justify-between items-center">
             <div>
                <h2 className="text-lg font-bold text-gray-800">{activeLesson?.title}</h2>
                <p className="text-xs text-gray-500">Cập nhật: {new Date(course.updatedAt).toLocaleDateString()}</p>
             </div>

             {/* --- NÚT HOÀN THÀNH --- */}
             <button 
               onClick={handleMarkCompleted}
               disabled={isLessonCompleted} // Nếu xong rồi thì disable nút
               className={`
                 px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all shadow-sm
                 ${isLessonCompleted 
                   ? 'bg-green-100 text-green-700 cursor-default' 
                   : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'}
               `}
             >
               {isLessonCompleted ? (
                 <><FontAwesomeIcon icon={faCheck} /> Đã hoàn thành</>
               ) : (
                 <>Đánh dấu hoàn thành</>
               )}
             </button>
          </div>

          {/* Description (Optional) */}
          <div className="p-6">
             <h3 className="font-bold text-gray-700 mb-2">Ghi chú bài học</h3>
             <p className="text-gray-600 text-sm">Nội dung ghi chú hoặc tài liệu đính kèm sẽ hiển thị ở đây...</p>
          </div>
        </div>

        {/* CỘT PHẢI: LIST BÀI HỌC */}
        <div className="w-full lg:w-96 bg-white border-l border-gray-200 overflow-y-auto shrink-0 flex flex-col h-full">
          <div className="p-4 border-b bg-gray-50 sticky top-0 z-10">
            <h2 className="font-bold text-gray-800">Nội dung khóa học</h2>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
               {/* Thanh Process Bar nhỏ */}
               <div 
                 className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                 style={{ width: `${(completedLessonIds.length / course.lessons) * 100}%` }}
               ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">
              {completedLessonIds.length}/{course.lessons} bài ({Math.round((completedLessonIds.length / course.lessons) * 100) || 0}%)
            </p>
          </div>
          
          <div className="flex-1">
             <CourseAccordion 
               sections={course.sections} 
               activeLessonId={activeLesson?.id}
               completedLessonIds={completedLessonIds} // <--- TRUYỀN MẢNG ID ĐÃ HỌC
               onSelectLesson={(lesson) => setActiveLesson(lesson)}
             />
          </div>
        </div>

      </div>
    </div>
  );
}