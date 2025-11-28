'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faTrash, faPen, faVideo, faArrowLeft, faFolderOpen, faLayerGroup 
} from '@fortawesome/free-solid-svg-icons';

import toast from 'react-hot-toast'; // <--- Import Toast
import axiosInstance from '@/app/lib/axios';
import LessonModal from '@/app/lib/component/admin/LessonModal';
import SectionModal from '@/app/lib/component/admin/SectionModal';
import ConfirmModal from '@/app/lib/component/admin/ConfirmModal';

export default function CourseContentPage() {
  const params = useParams();
  const router = useRouter();
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- STATE MODAL ---
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<{ id: string, title: string } | null>(null);
  
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    type: 'section' | 'lesson' | null;
    id: string | null;
    message: string;
  }>({ isOpen: false, type: null, id: null, message: '' });

  // --- FETCH DATA ---
  const fetchContent = async () => {
    try {
      const data = await axiosInstance.get(`/admin/courses/${params.id}`);
      setCourse(data);
    } catch (error) { 
      toast.error('Không thể tải dữ liệu khóa học');
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (params.id) fetchContent();
  }, [params.id]);

  // ============================================================
  // 1. XỬ LÝ CHƯƠNG (SECTION): THÊM & SỬA (CÓ TOAST)
  // ============================================================
  const openEditSection = (section: any) => {
    setEditingSection(section);
    setIsSectionModalOpen(true);
  };

  const handleSaveSection = async (title: string) => {
    // Định nghĩa hành động (Promise)
    const savePromise = editingSection
      ? axiosInstance.put(`/admin/sections/${editingSection.id}`, { title })
      : axiosInstance.post('/admin/sections', { title, courseId: params.id });

    // Hiển thị Toast
    toast.promise(savePromise, {
      loading: editingSection ? 'Đang cập nhật chương...' : 'Đang thêm chương...',
      success: 'Lưu chương thành công! 🎉',
      error: 'Lỗi khi lưu chương.',
    });

    try {
      await savePromise;
      // Thành công thì mới đóng modal và reload
      setIsSectionModalOpen(false);
      setEditingSection(null);
      fetchContent();
    } catch (e) { console.error(e); }
  };

  const handleCloseSectionModal = () => {
    setIsSectionModalOpen(false);
    setEditingSection(null);
  }

  // Nút xóa Section -> Mở Confirm
  const requestDeleteSection = (id: string) => {
    setConfirmConfig({
      isOpen: true,
      type: 'section',
      id: id,
      message: 'Cảnh báo: Xóa chương này sẽ xóa vĩnh viễn tất cả bài học bên trong!'
    });
  };

  // ============================================================
  // 2. XỬ LÝ BÀI HỌC (LESSON): THÊM & SỬA (CÓ TOAST)
  // ============================================================
  const openAddLesson = (sectionId: string) => {
    setEditingLesson(null);
    setSelectedSectionId(sectionId);
    setIsLessonModalOpen(true);
  };

  const openEditLesson = (lesson: any, sectionId: string) => {
    setEditingLesson(lesson);
    setSelectedSectionId(sectionId);
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = async (formData: any) => {
    // Định nghĩa hành động
    const savePromise = editingLesson
        ? axiosInstance.put(`/admin/lessons/${editingLesson.id}`, formData)
        : axiosInstance.post('/admin/lessons', { ...formData, sectionId: selectedSectionId });

    // Hiển thị Toast
    toast.promise(savePromise, {
       loading: 'Đang lưu bài học...',
       success: 'Đã lưu bài học! 📝',
       error: 'Lỗi khi lưu bài học.',
    });

    try {
      await savePromise;
      setIsLessonModalOpen(false);
      fetchContent();
    } catch (e) { console.error(e); }
  };
  
  // Nút xóa Lesson -> Mở Confirm
  const requestDeleteLesson = (id: string) => {
    setConfirmConfig({
      isOpen: true,
      type: 'lesson',
      id: id,
      message: 'Bạn có chắc chắn muốn xóa bài học này không?'
    });
  };

  // ============================================================
  // 3. XỬ LÝ XÓA CHUNG (DELETE) (CÓ TOAST)
  // ============================================================
  const handleConfirmDelete = async () => {
    if (!confirmConfig.id) return;

    let deletePromise;
    if (confirmConfig.type === 'section') {
      deletePromise = axiosInstance.delete(`/admin/sections/${confirmConfig.id}`);
    } else {
      deletePromise = axiosInstance.delete(`/admin/lessons/${confirmConfig.id}`);
    }

    toast.promise(deletePromise, {
      loading: 'Đang xóa...',
      success: 'Đã xóa thành công! 🗑️',
      error: 'Có lỗi xảy ra khi xóa.',
    });

    try {
      await deletePromise;
      fetchContent();
    } catch (e) { console.error(e); }
  };

  // ============================================================
  // RENDER UI
  // ============================================================
  if (loading) return <div className="p-10 text-center text-gray-500">Đang tải giáo trình...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* Header Page */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-800 transition-colors">
                <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            </button>
            <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Soạn thảo nội dung</p>
                <h1 className="text-xl font-bold text-gray-800">{course?.title}</h1>
            </div>
        </div>
        
        <button 
          onClick={() => setIsSectionModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-all"
        >
          <FontAwesomeIcon icon={faLayerGroup} /> Thêm Chương
        </button>
      </div>

      {/* DANH SÁCH */}
      <div className="space-y-6">
        {course?.sections.map((section: any, sIndex: number) => (
          <div key={section.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            
            {/* Header Chương */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center group">
              <h3 className="font-bold text-gray-800 text-base">
                <span className="text-indigo-500 mr-2">Chương {sIndex + 1}:</span> {section.title}
              </h3>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 {/* Nút Sửa Chương */}
                 <button 
                    onClick={() => openEditSection(section)}
                    className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50" 
                    title="Đổi tên chương"
                 >
                    <FontAwesomeIcon icon={faPen} />
                 </button>

                 {/* Nút Xóa Chương */}
                 <button 
                    onClick={() => requestDeleteSection(section.id)}
                    className="text-red-400 hover:text-red-600 p-2 rounded hover:bg-red-50" 
                    title="Xóa chương"
                 >
                    <FontAwesomeIcon icon={faTrash} />
                 </button>
              </div>
            </div>

            {/* Danh sách Bài học */}
            <div className="divide-y divide-gray-100">
              {section.lessons.map((lesson: any, lIndex: number) => (
                <div key={lesson.id} className="px-6 py-3 flex items-center justify-between hover:bg-indigo-50 transition-colors group/lesson">
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs shadow-sm">
                        {lIndex + 1}
                      </div>
                      <div>
                         <p className="font-medium text-gray-700 text-sm">{lesson.title}</p>
                         <p className="text-[10px] text-gray-400 flex items-center gap-2 mt-0.5">
                            <FontAwesomeIcon icon={faVideo} /> {lesson.duration} <span>•</span> ID: {lesson.videoId}
                         </p>
                      </div>
                   </div>
                   
                   {/* Action buttons Bài học */}
                   <div className="flex gap-1 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                      <button onClick={() => openEditLesson(lesson, section.id)} className="text-blue-400 hover:text-blue-600 p-2" title="Sửa bài">
                         <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button onClick={() => requestDeleteLesson(lesson.id)} className="text-red-400 hover:text-red-600 p-2" title="Xóa bài">
                         <FontAwesomeIcon icon={faTrash} />
                      </button>
                   </div>
                </div>
              ))}

              {/* Nút Thêm bài học */}
              <div 
                onClick={() => openAddLesson(section.id)}
                className="px-6 py-3 bg-gray-50 hover:bg-gray-100 cursor-pointer text-xs font-bold text-indigo-600 flex items-center justify-center gap-2 transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} /> Thêm bài học vào chương này
              </div>
            </div>

          </div>
        ))}

        {course?.sections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
             <div className="text-gray-300 text-6xl mb-4"><FontAwesomeIcon icon={faFolderOpen} /></div>
             <p className="text-gray-500 font-medium">Khóa học này chưa có nội dung.</p>
             <p className="text-sm text-gray-400 mt-1">Hãy bấm "Thêm Chương" để bắt đầu soạn giáo trình.</p>
          </div>
        )}
      </div>

      {/* --- CÁC POPUP (MODAL) --- */}
      
      <LessonModal 
        isOpen={isLessonModalOpen} 
        onClose={() => setIsLessonModalOpen(false)}
        onSubmit={handleSaveLesson}
        initialData={editingLesson}
      />

      <SectionModal
        isOpen={isSectionModalOpen}
        onClose={handleCloseSectionModal}
        onSubmit={handleSaveSection}
        initialTitle={editingSection?.title}
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={handleConfirmDelete}
        message={confirmConfig.message}
      />

    </div>
  );
}