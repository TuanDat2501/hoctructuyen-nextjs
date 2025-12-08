import { useState } from 'react';
import toast from 'react-hot-toast';

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
    // 1. Kiểm tra file
    if (!file) return null;
    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ được upload file ảnh!');
      return null;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('File quá lớn (Tối đa 5MB)');
      return null;
    }

    try {
      setUploading(true);
      
      // 2. Chuẩn bị dữ liệu gửi lên Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'lms_preset'); // Tên preset bạn vừa tạo

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      // 3. Gọi API upload
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Upload thất bại');
      }
      
      // 4. Trả về link ảnh (secure_url là link https)
      return data.secure_url;

    } catch (error: any) {
      console.error('Upload Error:', error);
      toast.error(`Lỗi upload: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading };
};