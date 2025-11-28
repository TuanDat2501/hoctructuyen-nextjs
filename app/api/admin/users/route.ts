import { verifyAdmin } from '@/app/lib/auth-check';
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
  // 1. Check quyền
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    // 2. Lấy danh sách (Sắp xếp mới nhất lên đầu)
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { // Chỉ lấy trường cần thiết, bỏ password
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json(users);

  } catch (error) {
    return NextResponse.json({ message: 'Lỗi Server' }, { status: 500 });
  }
}
export async function POST(request: Request) {
  // 1. Check quyền Admin
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const body = await request.json();
    // 1. Nhận thêm username
    const { email, username, password, name, role } = body;

    if (!email || !username || !password || !name) {
      return NextResponse.json({ message: 'Vui lòng nhập đủ thông tin' }, { status: 400 });
    }

    // 2. Check trùng cả Email HOẶC Username
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existing) {
      return NextResponse.json({ message: 'Email hoặc Username đã tồn tại' }, { status: 400 });
    }

    // 4. Mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Tạo User mới
    const newUser = await prisma.user.create({
      data: {
        username, // Lưu username
        email,
        name,
        password: hashedPassword,
        role: role || 'user',
      },
    });

    // Trả về user (bỏ password)
    const { password: _, ...userResponse } = newUser;

    return NextResponse.json(userResponse, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: 'Lỗi tạo user' }, { status: 500 });
  }
}