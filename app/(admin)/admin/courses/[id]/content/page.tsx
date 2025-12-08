'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faTrash, faPen, faVideo, faArrowLeft, faFolderOpen, 
  faLayerGroup, faSpinner, faQuestionCircle, faListCheck 
} from '@fortawesome/free-solid-svg-icons';

import toast from 'react-hot-toast';
import axiosInstance from '@/app/lib/axios';
import ConfirmModal from '@/app/lib/component/admin/ConfirmModal';
import QuizModal from '@/app/lib/component/admin/QuizModal';
import SectionModal from '@/app/lib/component/admin/SectionModal';
import LessonModal from '@/app/lib/component/admin/LessonModal';

export default function CourseContentPage() {
  const params = useParams();
  const router = useRouter();
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- STATE MODAL ---
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<{ id: string, title: string } | null>(null);

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // State cho Quiz Modal (Mới)
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedQuizLessonId, setSelectedQuizLessonId] = useState<string | null>(null);

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean; type: 'section' | 'lesson' | null; id: string | null; message: string;
  }>({ isOpen: false, type: null, id: null, message: '' });

  // Fetch Data
  const fetchContent = async () => {
    try {
      const data = await axiosInstance.get(`/admin/courses/${params.id}`);
      setCourse(data);
    } catch (error) { toast.error('Lỗi tải dữ liệu'); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (params.id) fetchContent();
  }, [params.id]);

  // --- SECTION LOGIC ---
  const handleSaveSection = async (title: string) => {
    const promise = editingSection
      ? axiosInstance.put(`/admin/sections/${editingSection.id}`, { title })
      : axiosInstance.post('/admin/sections', { title, courseId: params.id });

    await toast.promise(promise, { loading: 'Đang lưu...', success: 'Thành công!', error: 'Lỗi.' });
    setIsSectionModalOpen(false); setEditingSection(null); fetchContent();
  };

  // --- LESSON LOGIC ---
  const handleSaveLesson = async (formData: any) => {
    const promise = editingLesson
      ? axiosInstance.put(`/admin/lessons/${editingLesson.id}`, formData)
      : axiosInstance.post('/admin/lessons', { ...formData, sectionId: selectedSectionId });

    await toast.promise(promise, { loading: 'Đang lưu...', success: 'Thành công!', error: 'Lỗi.' });
    setIsLessonModalOpen(false); fetchContent();
  };

  // --- DELETE LOGIC ---
  const handleConfirmDelete = async () => {
    if (!confirmConfig.id) return;
    const url = confirmConfig.type === 'section' ? `/admin/sections/${confirmConfig.id}` : `/admin/lessons/${confirmConfig.id}`;
    await toast.promise(axiosInstance.delete(url), { loading: 'Đang xóa...', success: 'Đã xóa!', error: 'Lỗi xóa.' });
    fetchContent();
  };

  // --- QUIZ LOGIC (MỞ MODAL) ---
  const openQuizBuilder = (lessonId: string) => {
    setSelectedQuizLessonId(lessonId);
    setIsQuizModalOpen(true);
  };

  if (loading) return <div className="p-20 text-center text-gray-500"><FontAwesomeIcon icon={faSpinner} spin /> Đang tải...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-800"><FontAwesomeIcon icon={faArrowLeft} className="text-xl" /></button>
            <div><p className="text-xs text-gray-500 uppercase font-bold">Nội dung</p><h1 className="text-xl font-bold text-gray-800">{course?.title}</h1></div>
        </div>
        <button onClick={() => { setEditingSection(null); setIsSectionModalOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
          <FontAwesomeIcon icon={faLayerGroup} /> Thêm Chương
        </button>
      </div>

      {/* CONTENT LIST */}
      <div className="space-y-6">
        {course?.sections.map((section: any, sIndex: number) => (
          <div key={section.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center group">
              <h3 className="font-bold text-gray-800 text-base"><span className="text-indigo-500 mr-2">Chương {sIndex + 1}:</span> {section.title}</h3>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => { setEditingSection(section); setIsSectionModalOpen(true); }} className="text-blue-500 hover:bg-blue-100 p-2 rounded"><FontAwesomeIcon icon={faPen} /></button>
                 <button onClick={() => { setConfirmConfig({ isOpen: true, type: 'section', id: section.id, message: 'Xóa chương này?' }); }} className="text-red-500 hover:bg-red-100 p-2 rounded"><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {section.lessons.map((lesson: any, lIndex: number) => (
                <div key={lesson.id} className="px-6 py-3 flex items-center justify-between hover:bg-indigo-50 transition-colors group/lesson">
                   <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs ${lesson.type === 'QUIZ' ? 'bg-purple-100 text-purple-600 border-purple-200' : 'bg-white text-gray-500 border-gray-200'}`}>
                        {lesson.type === 'QUIZ' ? 'Q' : lIndex + 1}
                      </div>
                      <div>
                         <p className="font-medium text-gray-700 text-sm flex items-center gap-2">
                           {lesson.title}
                           {lesson.type === 'QUIZ' && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 rounded border border-purple-200 font-bold">QUIZ</span>}
                         </p>
                         <p className="text-[10px] text-gray-400 flex items-center gap-2 mt-0.5">
                            <FontAwesomeIcon icon={lesson.type === 'QUIZ' ? faListCheck : faVideo} /> 
                            {lesson.type === 'QUIZ' ? 'Bài kiểm tra' : `${lesson.duration} • ID: ${lesson.videoId}`}
                         </p>
                      </div>
                   </div>
                   
                   <div className="flex gap-1 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                      
                      {/* --- NÚT SOẠN CÂU HỎI (CHỈ HIỆN KHI LÀ QUIZ) --- */}
                      {lesson.type === 'QUIZ' && (
                        <button 
                          onClick={() => openQuizBuilder(lesson.id)}
                          className="bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100 px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors mr-2"
                          title="Soạn câu hỏi"
                        >
                          <FontAwesomeIcon icon={faQuestionCircle} /> Soạn câu hỏi
                        </button>
                      )}
                      {/* ------------------------------------------------ */}

                      <button onClick={() => { setEditingLesson(lesson); setSelectedSectionId(section.id); setIsLessonModalOpen(true); }} className="text-blue-400 hover:text-blue-600 p-2"><FontAwesomeIcon icon={faPen} /></button>
                      <button onClick={() => { setConfirmConfig({ isOpen: true, type: 'lesson', id: lesson.id, message: 'Xóa bài này?' }); }} className="text-red-400 hover:text-red-600 p-2"><FontAwesomeIcon icon={faTrash} /></button>
                   </div>
                </div>
              ))}
              <div onClick={() => { setEditingLesson(null); setSelectedSectionId(section.id); setIsLessonModalOpen(true); }} className="px-6 py-3 bg-gray-50 hover:bg-gray-100 cursor-pointer text-xs font-bold text-indigo-600 flex items-center justify-center gap-2 transition-colors">
                <FontAwesomeIcon icon={faPlus} /> Thêm bài học
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <LessonModal isOpen={isLessonModalOpen} onClose={() => setIsLessonModalOpen(false)} onSubmit={handleSaveLesson} initialData={editingLesson} />
      <SectionModal isOpen={isSectionModalOpen} onClose={() => setIsSectionModalOpen(false)} onSubmit={handleSaveSection} initialTitle={editingSection?.title} />
      
      {/* Quiz Builder Modal */}
      <QuizModal 
        isOpen={isQuizModalOpen} 
        onClose={() => setIsQuizModalOpen(false)} 
        lessonId={selectedQuizLessonId} 
      />

      <ConfirmModal isOpen={confirmConfig.isOpen} onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })} onConfirm={handleConfirmDelete} message={confirmConfig.message} />

    </div>
  );
}