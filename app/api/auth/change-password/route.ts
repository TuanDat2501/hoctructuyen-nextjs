import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    // 1. Xác thực User
    const headersList = await headers();
    const token = headersList.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const secret = process.env.JWT_SECRET || 'secret123';
    const decoded: any = jwt.verify(token, secret);
    const userId = decoded.userId;

    const body = await request.json();
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ message: 'Vui lòng nhập đủ thông tin' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ message: 'Mật khẩu mới quá ngắn (tối thiểu 6 ký tự)' }, { status: 400 });
    }
    // 2. Lấy mật khẩu cũ trong DB ra so sánh
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ message: 'User không tồn tại' }, { status: 404 });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Mật khẩu cũ không đúng' }, { status: 400 });
    }

    // 3. Mã hóa mật khẩu mới và Lưu
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({ message: 'Đổi mật khẩu thành công' });

  } catch (error) {
    return NextResponse.json({ message: 'Lỗi Server' }, { status: 500 });
  }
}