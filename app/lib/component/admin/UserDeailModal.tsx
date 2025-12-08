'use client';
import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBookOpen, faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../axios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export default function UserDetailModal({ isOpen, onClose, userId }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      axiosInstance.get(`/admin/users/${userId}/details`)
        .then(res => setData(res))
        .catch(() => alert('Lỗi tải dữ liệu'))
        .finally(() => setLoading(false));
    } else {
      setData(null);
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">
            Chi tiết học tập: <span className="text-indigo-600">{data?.name || '...'}</span>
          </h3>
          <button onClick={onClose}><FontAwesomeIcon icon={faTimes} className="text-gray-400 hover:text-red-500 cursor-pointer" /></button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
             <div className="flex justify-center py-10"><FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-indigo-500" /></div>
          ) : !data || data.coursesStats.length === 0 ? (
             <div className="text-center py-10 text-gray-400">User này chưa học bài nào.</div>
          ) : (
             <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-600">
                   <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                   Tổng số bài đã hoàn thành: {data.totalCompletedLessons}
                </div>

                {data.coursesStats.map((course: any) => (
                  <div key={course.courseId} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                     <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                           <FontAwesomeIcon icon={faBookOpen} className="text-indigo-500" />
                           {course.title}
                        </h4>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${course.percent === 100 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                           {course.percent}%
                        </span>
                     </div>
                     
                     {/* Thanh Progress */}
                     <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-2.5 rounded-full ${course.percent === 100 ? 'bg-green-500' : 'bg-indigo-500'}`} 
                          style={{ width: `${course.percent}%` }}
                        ></div>
                     </div>
                     <p className="text-xs text-gray-500 mt-1 text-right">
                        {course.completedCount}/{course.totalLessons} bài
                     </p>
                  </div>
                ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}