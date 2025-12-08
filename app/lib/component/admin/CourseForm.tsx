'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faImage, faSpinner } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast'; // <--- Import Toast
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { updateCourse, createCourse } from '../../redux/features/course/courseSlice';
import { fetchCategories } from '../../redux/features/category/categorySlice';
import { useUpload } from '@/hooks/useUpload'; 
import { faCloudUploadAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

interface CourseFormProps {
  initialData?: any;
  isEditMode?: boolean;
}

export default function CourseForm({ initialData, isEditMode = false }: CourseFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { items: categories } = useAppSelector((state: any) => state.categories);
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    thumbnail: '',
    lessons: 0,
    categoryId: '',
  });
  const { uploadFile, uploading } = useUpload();


  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);


  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        instructor: initialData.instructor || '',
        thumbnail: initialData.thumbnail || '',
        lessons: initialData.lessons || 0,
        categoryId: initialData.categoryId || ''
      });
    }
  }, [initialData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Gọi hàm upload
    const url = await uploadFile(file);
    
    // Nếu thành công thì lưu link vào state thumbnail
    if (url) {
      setFormData({ ...formData, thumbnail: url });
    }
    
    // Reset input để cho phép chọn lại file cũ nếu cần
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Tạo Promise xử lý
    const actionPromise = isEditMode && initialData?.id
      ? dispatch(updateCourse({ id: initialData.id, data: formData })).unwrap()
      : dispatch(createCourse(formData)).unwrap();

    // Hiển thị Toast
    toast.promise(actionPromise, {
      loading: isEditMode ? 'Đang cập nhật...' : 'Đang tạo mới...',
      success: isEditMode ? 'Cập nhật thành công! 👌' : 'Tạo khóa học thành công! 🎉',
      error: 'Có lỗi xảy ra. Vui lòng thử lại.',
    });

    try {
      await actionPromise;
      // Thành công thì chuyển hướng về danh sách
      router.push('/admin/courses');
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Cập Nhật Khóa Học' : 'Thêm Khóa Học Mới'}
        </h2>
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700 flex items-center gap-2 font-medium transition-colors">
          <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Tên khóa học */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tên khóa học</label>
            <input
              type="text" required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Nhập tên khóa học..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Giảng viên</label>
              <input
                type="text" required
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            {/*  <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Số bài học</label>
              <input 
                type="number" min="0"
                value={formData.lessons}
                onChange={(e) => setFormData({...formData, lessons: Number(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div> */}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục khóa học</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div> 

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Ảnh bìa khóa học (Thumbnail)</label>
            
            {/* Khung Upload */}
            <div className="w-full h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden relative group hover:border-indigo-400 transition-colors">
               
               {/* A. Khi đang upload -> Hiện loading */}
               {uploading && (
                 <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center text-indigo-600">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-3xl mb-2" />
                    <span className="text-sm font-medium">Đang tải lên...</span>
                 </div>
               )}

               {/* B. Nếu đã có ảnh -> Hiện ảnh + Nút xóa */}
               {formData.thumbnail ? (
                 <>
                   <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                   {/* Nút xóa ảnh (Reset về rỗng) */}
                   <button
                     type="button" // Quan trọng: type button để không submit form
                     onClick={() => setFormData({ ...formData, thumbnail: '' })}
                     className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-20"
                     title="Xóa ảnh"
                   >
                     <FontAwesomeIcon icon={faTrash} className="text-sm" />
                   </button>
                 </>
               ) : (
                 // C. Nếu chưa có ảnh -> Hiện nút chọn file
                 <>
                   <FontAwesomeIcon icon={faCloudUploadAlt} className="text-5xl text-gray-400 mb-4 group-hover:text-indigo-500 transition-colors" />
                   <p className="text-base text-gray-600 font-medium group-hover:text-indigo-600">
                      Kéo thả hoặc bấm để chọn ảnh bìa
                   </p>
                   <p className="text-sm text-gray-400 mt-1">PNG, JPG, GIF (Tối đa 5MB)</p>
                   
                   {/* Input file ẩn */}
                   <input 
                     type="file" 
                     accept="image/*"
                     onChange={handleFileChange}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                     disabled={uploading}
                   />
                 </>
               )}
            </div>
            {/* Nếu vẫn muốn nhập link thủ công (Optional - Có thể bỏ đi cho gọn) */}
            <div className="mt-2">
              <input 
                type="text"
                value={formData.thumbnail}
                onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                placeholder="Hoặc dán link ảnh trực tiếp tại đây..."
                className="w-full text-xs text-gray-500 border-b border-gray-200 focus:border-indigo-500 outline-none py-1"
              />
            </div>
        </div>

          <div className="pt-6 border-t border-gray-100">
            <button
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-lg shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSave} />}
              {isEditMode ? 'Lưu Thay Đổi' : 'Tạo Khóa Học'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}

