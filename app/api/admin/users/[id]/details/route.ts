import { verifyAdmin } from '@/app/lib/auth-check';
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const { id } = await params;

    // Lấy user kèm theo thông tin tiến độ
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        progress: { // Lấy bảng UserProgress
          where: { isCompleted: true },
          include: {
            course: { // Lấy thông tin khóa học tương ứng
              select: { id: true, title: true, lessons: true }
            }
          }
        }
      }
    });

    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    // --- XỬ LÝ SỐ LIỆU (GROUP BY COURSE) ---
    // Vì bảng Progress lưu theo bài học, ta cần gom nhóm lại theo Khóa học
    const courseProgressMap = new Map();

    user.progress.forEach(p => {
      const courseId = p.courseId;
      if (!courseProgressMap.has(courseId)) {
        courseProgressMap.set(courseId, {
          courseId: p.course.id,
          title: p.course.title,
          totalLessons: p.course.lessons,
          completedCount: 0,
        });
      }
      const current = courseProgressMap.get(courseId);
      current.completedCount += 1;
    });

    // Chuyển Map thành Array và tính %
    const coursesStats = Array.from(courseProgressMap.values()).map((c: any) => ({
      ...c,
      percent: c.totalLessons > 0 ? Math.round((c.completedCount / c.totalLessons) * 100) : 0
    }));

    return NextResponse.json({
      id: user.id,
      name: user.name,
      coursesStats, // Danh sách khóa học và tiến độ
      totalCompletedLessons: user.progress.length // Tổng số bài đã học
    });

  } catch (error) {
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}