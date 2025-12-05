import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/app/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    // 1. Xác thực User
    const headersList = await headers();
    const token = headersList.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const secret = process.env.JWT_SECRET || 'secret123';
    const decoded: any = jwt.verify(token, secret);
    const userId = decoded.userId;

    const { courseId } = await params;

    // 2. Lấy danh sách các bài ĐÃ HỌC XONG của user trong khóa này
    const completedLessons = await prisma.userProgress.findMany({
      where: {
        userId,
        courseId,
        isCompleted: true
      },
      select: {
        lessonId: true // Chỉ cần lấy ID bài học là đủ
      }
    });

    // Trả về mảng các ID bài học đã xong: ['lesson_1', 'lesson_3'...]
    const completedLessonIds = completedLessons.map(p => p.lessonId);

    return NextResponse.json(completedLessonIds);

  } catch (error) {
    return NextResponse.json({ message: 'Lỗi lấy tiến độ' }, { status: 500 });
  }
}