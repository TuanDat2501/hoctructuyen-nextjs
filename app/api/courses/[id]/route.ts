import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        sections: {
          include: {
            lessons: true // Lấy luôn bài học trong chương
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ message: 'Không tìm thấy khóa học' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}