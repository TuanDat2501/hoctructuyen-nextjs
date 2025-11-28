import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { verifyAdmin } from '@/app/lib/auth-check';
import { prisma } from '@/app/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. CHỐT CHẶN: Chỉ Admin mới được vào đây
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, role, password, username } = body;

    // Dữ liệu chuẩn bị update
    const updateData: any = {
      name,
      email,
      role,
      // Username chỉ được update ở API này (Admin)
      username, 
    };

    // 2. CHECK TRÙNG USERNAME (Logic quan trọng)
    // Nếu admin có gửi username mới lên để sửa
    if (username) {
      // Tìm xem có ai KHÁC đang dùng username này không?
      const existingUser = await prisma.user.findFirst({
        where: {
          username: username,
          NOT: {
            id: id // Trừ chính thằng user đang được sửa ra
          }
        }
      });

      if (existingUser) {
        return NextResponse.json({ message: 'Username này đã có người sử dụng!' }, { status: 400 });
      }
    }

    // 3. Xử lý Mật khẩu (Nếu có nhập thì mới đổi)
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return NextResponse.json({ message: 'Mật khẩu phải từ 6 ký tự' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    // 4. Tiến hành Update
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Bỏ password trước khi trả về
    const { password: _, ...userResponse } = updatedUser;

    return NextResponse.json(userResponse);

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: 'Lỗi cập nhật user' }, { status: 500 });
  }
}