'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faImage, faSpinner } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast'; // <--- Import Toast
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { updateCourse, createCourse } from '../../redux/features/course/courseSlice';
import { fetchCategories } from '../../redux/features/category/categorySlice';

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
            <label className="block text-sm font-bold text-gray-700 mb-2">Link Ảnh Bìa</label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="https://..."
            />
            {/* Preview Ảnh */}
            <div className="mt-4 w-full h-48 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              {formData.thumbnail ? (
                <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <FontAwesomeIcon icon={faImage} className="text-3xl mb-2" />
                  <span className="text-sm">Xem trước ảnh bìa</span>
                </div>
              )}
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
        </form>
      </div>
    </div>
  );
}

