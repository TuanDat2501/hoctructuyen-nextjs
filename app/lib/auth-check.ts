import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function verifyAdmin() {
  const headersList = headers();
  const token =  (await headersList).get('authorization')?.split(' ')[1];

  
  if (!token) return null;

  try {
    const secret = process.env.JWT_SECRET || 'secret123';
    const decoded: any = jwt.verify(token, secret);

    // Kiểm tra role
    if (decoded.role === 'admin') {
      return decoded; // Trả về thông tin admin nếu hợp lệ
    }
    return null; // Có token nhưng không phải admin
  } catch (error) {
    return null; // Token lỗi hoặc hết hạn
  }
}