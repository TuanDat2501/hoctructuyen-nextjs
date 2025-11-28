import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/app/lib/prisma';

// API: Cập nhật thông tin (Tên)
export async function PUT(request: Request) {
  try {
    // 1. Xác thực Token (Vì user thường cũng gọi được)
    const headersList = await headers();
    const token = headersList.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const secret = process.env.JWT_SECRET || 'secret123';
    const decoded: any = jwt.verify(token, secret);
    const userId = decoded.userId;

    // 2. Lấy dữ liệu gửi lên
    const body = await request.json();
    const { name } = body; // Chỉ cho sửa tên (Username/Email thường cố định)

    // 3. Update DB
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    // Bỏ pass trước khi trả về
    const { password: _, ...userWithoutPass } = updatedUser;

    return NextResponse.json(userWithoutPass);

  } catch (error) {
    return NextResponse.json({ message: 'Lỗi cập nhật' }, { status: 500 });
  }
}