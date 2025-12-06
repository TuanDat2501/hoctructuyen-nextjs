import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/app/lib/prisma';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    // 1. Lấy User ID từ Token (để biết đang lấy tiến độ cho ai)
    const headersList = await headers();
    const token = headersList.get('authorization')?.split(' ')[1];
    let userId = null;

    if (token) {
      try {
        const secret = process.env.JWT_SECRET || 'secret123';
        const decoded: any = jwt.verify(token, secret);
        userId = decoded.userId;
      } catch (e) {
        // Token lỗi thì thôi, coi như khách vãng lai (userId = null)
      }
    }

    // 2. Query Database
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        category: true,
        instructor: true,
        lessons: true, // Tổng số bài học
        // Nếu đã login -> Lấy thêm danh sách bài đã học của user này
        ...(userId ? {
          userProgress: {
            where: {
              userId: userId,
              isCompleted: true
            },
            select: { id: true } // Chỉ cần đếm số lượng
          }
        } : {})
      }
    });

    // 3. Tính toán số lượng đã học trước khi trả về
    const data = courses.map((course: any) => ({
      ...course,
      // Đếm số record trong userProgress
      completedLessons: course.userProgress ? course.userProgress.length : 0,
      // Xóa field userProgress đi cho nhẹ response
      userProgress: undefined 
    }));

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ message: 'Lỗi tải khóa học' }, { status: 500 });
  }
}