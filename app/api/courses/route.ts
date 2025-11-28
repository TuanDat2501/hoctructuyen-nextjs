import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    // Không cần check Admin, chỉ cần lấy danh sách
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        instructor: true,
        lessons: true,
        // Chỉ lấy những trường cần hiển thị
      }
    });
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi tải khóa học' }, { status: 500 });
  }
}