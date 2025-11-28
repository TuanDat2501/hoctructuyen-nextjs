import { verifyAdmin } from '@/app/lib/auth-check';
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const body = await request.json();
    const newLesson = await prisma.lesson.create({
      data: {
        title: body.title,
        duration: body.duration,
        videoId: body.videoId,
        sectionId: body.sectionId,
      }
    });
    const section = await prisma.section.findUnique({
      where: { id: body.sectionId },
      select: { courseId: true }
    });

    if (section) {
      // Đếm tổng số bài học của khóa đó
      const totalLessons = await prisma.lesson.count({
        where: {
          section: {
            courseId: section.courseId
          }
        }
      });

      // Cập nhật ngược lại vào bảng Course
      await prisma.course.update({
        where: { id: section.courseId },
        data: { lessons: totalLessons }
      });
    }
    return NextResponse.json(newLesson);
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi tạo bài học' }, { status: 500 });
  }
}