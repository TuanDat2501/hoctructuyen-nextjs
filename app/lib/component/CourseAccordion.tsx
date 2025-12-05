'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faPlay, faCirclePlay, faVideo,faCheckCircle } from '@fortawesome/free-solid-svg-icons';

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU (Giống hệt Prisma trả về) ---
export type Lesson = {
  id: string;
  title: string;
  duration: string | null; // Database có thể null
  videoId: string;
};

export type Section = {
  id: string;
  title: string;
  lessons: Lesson[];
};

interface AccordionProps {
  sections: Section[]; // Nhận vào mảng các chương
  activeLessonId?: string; // ID bài đang học
  onSelectLesson: (lesson: Lesson) => void; // Hàm chọn bài
  completedLessonIds?: string[];
}

export default function CourseAccordion({ sections = [], activeLessonId, onSelectLesson,completedLessonIds = [] }: AccordionProps) {
  // State quản lý việc mở/đóng các chương
  const [openSections, setOpenSections] = useState<string[]>([]);

  // Effect: Tự động mở chương chứa bài học đang học (activeLessonId)
  useEffect(() => {
    if (activeLessonId && sections.length > 0) {
      const activeSection = sections.find(sec => sec.lessons.some(l => l.id === activeLessonId));
      if (activeSection) {
        setOpenSections(prev => 
          prev.includes(activeSection.id) ? prev : [...prev, activeSection.id]
        );
      }
    } else if (sections.length > 0 && openSections.length === 0) {
      // Mặc định mở chương đầu tiên nếu chưa mở gì
      setOpenSections([sections[0].id]);
    }
  }, [activeLessonId, sections]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Nếu không có dữ liệu
  if (!sections || sections.length === 0) {
    return <div className="p-4 text-gray-500 text-sm text-center">Chưa có nội dung bài học.</div>;
  }

  return (
    <div className="bg-white h-full">
      {sections.map((section, index) => {
        const isOpen = openSections.includes(section.id);
        
        return (
          <div key={section.id} className="border-b border-gray-100 last:border-none">
            
            {/* --- HEADER CHƯƠNG --- */}
            <div 
              onClick={() => toggleSection(section.id)}
              className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors select-none"
            >
              <div className="flex-1 pr-2">
                <h3 className="font-bold text-sm text-gray-800">
                  {index + 1}. {section.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {section.lessons.length} bài học
                </p>
              </div>
              <FontAwesomeIcon 
                icon={isOpen ? faMinus : faPlus} 
                className="text-gray-400 text-xs"
              />
            </div>

            {/* --- DANH SÁCH BÀI HỌC --- */}
            {isOpen && (
              <div>
                {section.lessons.map((lesson, lIndex) => {
                  const isActive = lesson.id === activeLessonId;
                  const isCompleted = completedLessonIds.includes(lesson.id); // Check xem đã học chưa
                  
                  return (
                    <div 
                      key={lesson.id} 
                      onClick={() => onSelectLesson(lesson)}
                      className={`
                        flex items-start gap-3 p-3 pl-4 cursor-pointer border-l-4 transition-all
                        ${isActive 
                          ? 'bg-indigo-50 border-indigo-600' 
                          : 'border-transparent hover:bg-gray-50'}
                      `}
                    >
                      {/* --- LOGIC ICON --- */}
                      <div className="mt-0.5">
                        {isCompleted ? (
                          // Nếu xong rồi -> Hiện tích xanh
                          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-sm" />
                        ) : isActive ? (
                          // Nếu đang học -> Hiện Play đậm
                          <FontAwesomeIcon icon={faCirclePlay} className="text-indigo-600 text-sm" />
                        ) : (
                          // Chưa học -> Hiện Play nhạt
                          <FontAwesomeIcon icon={faPlay} className="text-gray-300 text-xs" />
                        )}
                      </div>

                      {/* Thông tin bài */}
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium leading-tight ${isActive ? 'text-indigo-700' : isCompleted ? 'text-gray-500' : 'text-gray-700'}`}>
                          {index + 1}.{lIndex + 1} {lesson.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <FontAwesomeIcon icon={faVideo} className="text-[10px] text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {lesson.duration || '00:00'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}