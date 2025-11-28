import { verifyAdmin } from '@/app/lib/auth-check';
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';


export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const { id } = await params;
        const body = await request.json();
        const updatedLesson = await prisma.lesson.update({
            where: { id },
            data: {
                title: body.title,
                duration: body.duration,
                videoId: body.videoId,
                // Không update sectionId để tránh bài học nhảy lung tung
            },
        });
        return NextResponse.json(updatedLesson);
    } catch (error) { return NextResponse.json({ message: 'Lỗi' }, { status: 500 }); }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const { id } = await params;

    // 1. Lấy thông tin bài học trước khi xóa (để biết nó thuộc khóa nào)
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { section: true } // Lấy kèm section để biết courseId
    });

    if (!lesson) return NextResponse.json({ message: 'Không tìm thấy' }, { status: 404 });

    // 2. Xóa bài học
    await prisma.lesson.delete({ where: { id } });

    // 3. --- LOGIC TỰ ĐỘNG CẬP NHẬT SỐ BÀI ---
    const courseId = lesson.section.courseId;

    // Đếm lại
    const totalLessons = await prisma.lesson.count({
      where: {
        section: { courseId: courseId }
      }
    });

    // Update Course
    await prisma.course.update({
      where: { id: courseId },
      data: { lessons: totalLessons }
    });
    // ----------------------------------------

    return NextResponse.json({ message: 'Xóa thành công' });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi xóa bài học' }, { status: 500 });
  }
}