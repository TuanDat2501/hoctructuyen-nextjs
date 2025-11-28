'use client';
import React, { useState, useEffect } from 'react';

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  initialTitle?: string; // Dùng nếu sau này muốn sửa tên chương
}

export default function SectionModal({ isOpen, onClose, onSubmit, initialTitle = '' }: SectionModalProps) {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (isOpen) setTitle(initialTitle);
  }, [isOpen, initialTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title);
      setTitle(''); // Reset
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-2xl">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          {initialTitle ? 'Đổi tên chương' : 'Thêm Chương Mới'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <input 
            autoFocus
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none mb-6" 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            placeholder="Nhập tên chương..."
          />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Hủy</button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Lưu lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}