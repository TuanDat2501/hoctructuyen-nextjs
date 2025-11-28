import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/app/lib/prisma';


export async function GET() {
  try {
    // 1. Lấy token từ header
    const headersList = await headers();
    const token = headersList.get('authorization')?.split(' ')[1];

    if (!token) return NextResponse.json({ message: 'No token' }, { status: 401 });

    // 2. Verify token
    const secret = process.env.JWT_SECRET || 'secret123';
    const decoded: any = jwt.verify(token, secret);

    // 3. Lấy thông tin mới nhất từ DB (để lỡ admin đổi quyền thì cập nhật ngay)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true } // Không lấy pass
    });

    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid Token' }, { status: 401 });
  }
}