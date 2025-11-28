import { NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
   const body = await request.json();
    // 1. Nhận username thay vì email
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ message: 'Vui lòng nhập Username và Mật khẩu' }, { status: 400 });
    }

    // 2. Tìm User theo USERNAME
    const user = await prisma.user.findUnique({
      where: { username }, // <--- Thay đổi ở đây
    });

    if (!user) {
      return NextResponse.json({ message: 'Username không tồn tại' }, { status: 401 });
    }

    // 3. So sánh mật khẩu (Input vs Database)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Mật khẩu không đúng' }, { status: 401 });
    }

    // 4. Tạo JWT Token
    // Lấy mã bí mật từ .env
    const secret = process.env.JWT_SECRET || 'secret-mac-dinh';
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role }, // Payload (thông tin gói trong token)
      secret,
      { expiresIn: '1d' } // Token hết hạn sau 1 ngày
    );

    // 5. Trả về kết quả (Loại bỏ password ra khỏi object user)
    const { password: _, ...userWithoutPass } = user;

    return NextResponse.json({
      message: 'Đăng nhập thành công',
      token,
      user: userWithoutPass,
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Lỗi Server' }, { status: 500 });
  }
}