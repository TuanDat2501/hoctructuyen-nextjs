'use client';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export default function ConfirmModal({ 
  isOpen, onClose, onConfirm, 
  title = "Xác nhận xóa", 
  message = "Bạn có chắc chắn muốn thực hiện hành động này?" 
}: ConfirmModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-2xl text-center">
        
        <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
           <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl" />
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6">{message}</p>

        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Hủy bỏ
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }} 
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-md"
          >
            Đồng ý Xóa
          </button>
        </div>
      </div>
    </div>
  );
}