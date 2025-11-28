'use client';
import React, { useState, useEffect } from 'react';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any; // Nếu có -> Sửa, không -> Thêm
}

export default function LessonModal({ isOpen, onClose, onSubmit, initialData }: LessonModalProps) {
  const [formData, setFormData] = useState({ title: '', duration: '', videoId: '' });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        duration: initialData.duration,
        videoId: initialData.videoId
      });
    } else {
      setFormData({ title: '', duration: '', videoId: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h3 className="text-lg font-bold mb-4">{initialData ? 'Sửa Bài Học' : 'Thêm Bài Học Mới'}</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Tên bài học</label>
            <input 
              className="w-full border p-2 rounded" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
               <label className="block text-sm font-medium mb-1">Thời lượng (VD: 05:30)</label>
               <input 
                 className="w-full border p-2 rounded" 
                 value={formData.duration} 
                 onChange={e => setFormData({...formData, duration: e.target.value})}
               />
            </div>
            <div className="flex-1">
               <label className="block text-sm font-medium mb-1">Youtube ID</label>
               <input 
                 className="w-full border p-2 rounded" 
                 value={formData.videoId} 
                 onChange={e => setFormData({...formData, videoId: e.target.value})}
               />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Hủy</button>
          <button 
            onClick={() => onSubmit(formData)} 
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}