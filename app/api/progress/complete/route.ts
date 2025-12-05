import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    // 1. FIX QUAN TRỌNG: Thêm await cho headers()
    const headersList = await headers(); 
    const token = headersList.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Chưa đăng nhập (No Token)' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || 'secret123';
    const decoded: any = jwt.verify(token, secret);
    const userId = decoded.userId;

    // 2. Lấy dữ liệu
    const body = await request.json();
    const { lessonId, courseId } = body;

    // console.log("Đang lưu progress:", { userId, lessonId, courseId }); // Bật log để debug

    if (!lessonId || !courseId) {
      return NextResponse.json({ message: 'Thiếu ID bài học hoặc khóa học' }, { status: 400 });
    }

    // 3. Lưu vào DB (Upsert)
    const progress = await prisma.userProgress.upsert({
      where: {
        // Quan trọng: Tên này phải khớp với @@unique trong schema.prisma
        userId_lessonId: {
          userId: userId,
          lessonId: lessonId
        }
      },
      update: {
        isCompleted: true,
        completedAt: new Date()
      },
      create: {
        userId: userId,
        lessonId: lessonId,
        courseId: courseId,
        isCompleted: true
      }
    });

    return NextResponse.json(progress);

  } catch (error: any) {
    // IN LỖI RA TERMINAL ĐỂ XEM
    console.error("🔥 LỖI API COMPLETE:", error);
    
    return NextResponse.json(
      { message: 'Lỗi server: ' + error.message }, 
      { status: 500 }
    );
  }
}