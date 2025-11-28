import { NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/app/lib/prisma';
import { use } from 'react';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username,email, password, name,role } = body;

    // 1. Validate dữ liệu đầu vào
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Vui lòng nhập đầy đủ Email và Mật khẩu' }, 
        { status: 400 }
      );
    }
    // 2. Kiểm tra Email đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email này đã được sử dụng' }, 
        { status: 409 } // 409 Conflict
      );
    }

    // 3. Mã hóa mật khẩu (Bắt buộc)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Tạo User mới
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        name: name || '', // Nếu không nhập tên thì để rỗng
        role: role || 'user',     // Mặc định là user thường
      },
    });

    // 5. Trả về kết quả (Xóa password trước khi trả về cho an toàn)
    const { password: newPassword, ...userWithoutPass } = newUser;

    return NextResponse.json({
      message: 'Đăng ký thành công',
      user: userWithoutPass,
    }, { status: 201 });

  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json(
      { message: 'Lỗi Server, vui lòng thử lại sau' }, 
      { status: 500 }
    );
  }
}