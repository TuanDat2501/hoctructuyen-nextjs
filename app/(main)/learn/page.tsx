// src/app/course/page.tsx
'use client';

import CourseAccordion, { Lesson, Section } from '@/app/lib/component/CourseAccordion';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';


// --- DỮ LIỆU GIẢ LẬP (Thực tế bạn sẽ lấy từ API) ---
const mockData: Section[] = [
  {
    id: 's1',
    title: 'Phần 1: Nhập môn Edit',
    lessons: [
      { id: 'l1', title: 'Film là gì?', duration: '05:20', videoId: 'RG36k8bTuUc' }, // Youtube ID ví dụ
      { id: 'l2', title: 'Kịch bản', duration: '10:15', videoId: '7D3dej9Dxa0' },
      { id: 'l3', title: 'Nhịp', duration: '10:15', videoId: 'TWwgGS6vORU' },
      { id: 'l4', title: 'Sound Effect', duration: '10:15', videoId: 'JCsi4JeyEq8' },
    ],
  },
  /* {
    id: 's2',
    title: 'Phần 2: Routing cơ bản',
    lessons: [
      { id: 'l3', title: 'Tạo trang mới (Page & Layout)', duration: '08:40', videoId: 'NDt7dKk3kQA' },
      { id: 'l4', title: 'Dynamic Routes là gì?', duration: '12:00', videoId: '9J5J7J4J5J4' }, // Fake ID
      { id: 'l5', title: 'Sử dụng Link Component', duration: '06:30', videoId: '1J5J7J4J5J4' },
    ],
  }, */
];

export default function CourseViewerPage() {
  const param = useSearchParams();
  // State: Bài học đang chọn (Mặc định bài đầu tiên)
  const [activeLesson, setActiveLesson] = useState<Lesson>(mockData[0].lessons[0]);
  const [khoaHoc, setKhoaHoc] = useState<string>(param.get('name') || 'Edit');
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      
      {/* HEADER (Optional) */}
      <header className="h-14 bg-white shadow-sm flex items-center px-6 border-b shrink-0 z-10">
        <h1 className="font-bold text-gray-800">Khóa học {khoaHoc}</h1>
      </header>

      {/* BODY CONTENT */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* --- CỘT TRÁI: ACCORDION LIST --- */}
        {/* w-full trên mobile, w-96 (cố định 384px) trên desktop */}
        <div className="w-full lg:w-96 bg-white h-full overflow-y-auto border-r border-gray-200 order-2 lg:order-1">
          <CourseAccordion 
            sections={mockData}
            activeLessonId={activeLesson.id}
            onSelectLesson={(lesson) => setActiveLesson(lesson)}
          />
        </div>

        {/* --- CỘT PHẢI: VIDEO PLAYER --- */}
        <div className="flex-1 bg-gray-900 flex flex-col order-1 lg:order-2 overflow-y-auto">
          
          {/* Vùng chứa Video (Aspect Ratio 16:9) */}
          <div className="w-full bg-black aspect-video relative shadow-lg">
             <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${activeLesson.videoId}?autoplay=1?modestbranding=1&rel=0&iv_load_policy=3&showinfo=0`} 
                
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
             ></iframe>
          </div>

          {/* Thông tin bài học bên dưới video */}
          <div className="p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
            <p className="text-gray-400 mb-4">Thời lượng: {activeLesson.duration}</p>
            
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="font-bold text-gray-200 mb-2">Mô tả bài học</h3>
              <p className="text-sm text-gray-400">
                Trong bài này chúng ta sẽ tìm hiểu về {activeLesson.title}. 
                Hãy đảm bảo bạn đã xem các bài trước để hiểu rõ ngữ cảnh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}