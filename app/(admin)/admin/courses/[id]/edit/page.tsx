'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '@/app/lib/axios';
import CourseForm from '@/app/lib/component/admin/CourseForm';

export default function EditCoursePage() {
  const params = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCourseDetail = async () => {
      try {
        const data:any = await axiosInstance.get(`/admin/courses/${params.id}`);
        setCourse(data);
      } catch (error) {
        // Có thể redirect về list nếu lỗi
      } finally {
        setLoading(false);
      }
    };
    if (params.id) getCourseDetail();
  }, [params.id]);

  if (loading) {
    return (
        <div className="flex h-[50vh] items-center justify-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-indigo-500" />
        </div>
    );
  }

  return <CourseForm initialData={course} isEditMode={true} />;
}