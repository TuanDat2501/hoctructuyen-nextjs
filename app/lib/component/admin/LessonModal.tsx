'use client';
import { faCloudUploadAlt, faImage, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import { useUpload } from '@/hooks/useUpload';
interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any; // Nếu có -> Sửa, không -> Thêm
}

export default function LessonModal({ isOpen, onClose, onSubmit, initialData }: LessonModalProps) {
  const [formData, setFormData] = useState({ title: '', type: '', duration: '', videoId: '', poster: '' });
  const { uploadFile, uploading } = useUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Gọi hàm upload
    const url = await uploadFile(file);

    // Nếu thành công thì lưu link vào state
    if (url) {
      setFormData({ ...formData, poster: url });
    }

    // Reset input để cho phép chọn lại file cũ nếu cần
    e.target.value = '';
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        duration: initialData.duration,
        videoId: initialData.videoId,
        poster: initialData.poster || '',
        type:initialData.type ||'VIDEO'
      });
    } else {
      setFormData({ title: '', duration: '', videoId: '', poster: '',type: '' });
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
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Thời lượng (VD: 05:30)</label>
              <input
                className="w-full border p-2 rounded"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Youtube ID</label>
              <input
                className="w-full border p-2 rounded"
                value={formData.videoId}
                onChange={e => setFormData({ ...formData, videoId: e.target.value })}
              />
            </div>
          </div>
        </div>
        <select value={formData.type} onChange={(e) =>{
          
          
          setFormData({ ...formData, type: e.target.value })
          
          }}>
          <option value="VIDEO">Video Bài Giảng</option>
          <option value="QUIZ">Bài Kiểm Tra</option>
        </select>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Ảnh bìa (Poster)</label>

          <div className="w-full h-48 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden relative group hover:border-indigo-400 transition-colors">

            {/* A. Khi đang upload -> Hiện loading */}
            {uploading && (
              <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center text-indigo-600">
                <FontAwesomeIcon icon={faSpinner} spin className="text-3xl mb-2" />
                <span className="text-sm font-medium">Đang tải lên...</span>
              </div>
            )}

            {/* B. Nếu đã có ảnh -> Hiện ảnh + Nút xóa */}
            {formData.poster ? (
              <>
                <img src={formData.poster} alt="Preview" className="w-full h-full object-cover" />
                {/* Nút xóa ảnh */}
                <button
                  onClick={() => setFormData({ ...formData, poster: '' })}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Xóa ảnh"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-sm" />
                </button>
              </>
            ) : (
              // C. Nếu chưa có ảnh -> Hiện nút chọn file
              <>
                <FontAwesomeIcon icon={faCloudUploadAlt} className="text-4xl text-gray-400 mb-3 group-hover:text-indigo-500 transition-colors" />
                <p className="text-sm text-gray-500 font-medium group-hover:text-indigo-600">
                  Kéo thả hoặc bấm để chọn ảnh
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF (Tối đa 5MB)</p>

                {/* Input file ẩn */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
              </>
            )}
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