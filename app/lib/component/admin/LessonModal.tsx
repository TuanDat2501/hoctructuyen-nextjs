'use client';
import { faCheckCircle, faCloudUploadAlt, faImage, faListCheck, faSpinner, faTrash, faVideo } from '@fortawesome/free-solid-svg-icons';
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
        type: initialData.type || 'VIDEO'
      });
    } else {
      setFormData({ title: '', duration: '', videoId: '', poster: '', type: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-6 text-gray-800 border-b pb-3">
          {initialData ? 'Cập nhật nội dung' : 'Thêm nội dung mới'}
        </h3>

        <div className="space-y-6">

          {/* --- 1. CHỌN LOẠI BÀI HỌC (DESIGN MỚI) --- */}
          <div>
            <label className="block text-sm font-bold mb-3 text-gray-700">Loại nội dung</label>
            <div className="grid grid-cols-2 gap-4">

              {/* Card Video */}
              <div
                onClick={() => setFormData({ ...formData, type: 'VIDEO' })}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 relative
                  ${formData.type === 'VIDEO'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-300 text-gray-500'}
                `}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${formData.type === 'VIDEO' ? 'bg-indigo-200' : 'bg-gray-100'}`}>
                  <FontAwesomeIcon icon={faVideo} />
                </div>
                <span className="font-bold text-sm">Video Bài Giảng</span>

                {/* Dấu tích khi chọn */}
                {formData.type === 'VIDEO' && (
                  <div className="absolute top-2 right-2 text-indigo-600">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                )}
              </div>

              {/* Card Quiz */}
              <div
                onClick={() => setFormData({ ...formData, type: 'QUIZ' })}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 relative
                  ${formData.type === 'QUIZ'
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300 text-gray-500'}
                `}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${formData.type === 'QUIZ' ? 'bg-purple-200' : 'bg-gray-100'}`}>
                  <FontAwesomeIcon icon={faListCheck} />
                </div>
                <span className="font-bold text-sm">Bài Kiểm Tra</span>

                {/* Dấu tích khi chọn */}
                {formData.type === 'QUIZ' && (
                  <div className="absolute top-2 right-2 text-purple-600">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                )}
              </div>

            </div>
          </div>
          {/* ------------------------------------------- */}

          {/* Tên bài học (Luôn hiện) */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Tiêu đề</label>
            <input
              className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder={formData.type === 'VIDEO' ? "VD: Bài 1 - Giới thiệu" : "VD: Bài kiểm tra cuối khóa"}
            />
          </div>

          {/* CÁC TRƯỜNG DÀNH RIÊNG CHO VIDEO (Ẩn đi nếu chọn Quiz) */}
          {formData.type === 'VIDEO' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Thời lượng</label>
                  <input className="w-full border p-2.5 rounded-lg outline-none" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="05:30" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Video ID</label>
                  <input className="w-full border p-2.5 rounded-lg outline-none" value={formData.videoId} onChange={e => setFormData({ ...formData, videoId: e.target.value })} placeholder="Youtube ID" />
                </div>
              </div>

              {/* Phần upload Poster cũ (Giữ nguyên hoặc dùng component Upload nếu đã làm) */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Poster</label>
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
            </div>
          )}

          {/* Thông báo cho Quiz */}
          {formData.type === 'QUIZ' && (
            <div className="bg-purple-50 text-purple-700 p-4 rounded-lg text-sm border border-purple-100 flex items-start gap-2">
              <FontAwesomeIcon icon={faListCheck} className="mt-1" />
              <div>
                Bạn đang tạo một bài kiểm tra trắc nghiệm.
                <br />Sau khi lưu, hãy bấm nút <b>"Soạn câu hỏi"</b> ở danh sách để nhập nội dung đề thi.
              </div>
            </div>
          )}

        </div>

        <div className="mt-8 flex justify-end gap-3 pt-4 border-t">
          <button onClick={onClose} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Hủy</button>
          <button
            onClick={() => onSubmit(formData)}
            className={`px-6 py-2.5 text-white rounded-lg font-bold shadow-md transition-colors ${formData.type === 'QUIZ' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            Lưu Lại
          </button>
        </div>
      </div>
    </div>
  );
}