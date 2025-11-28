import { verifyAdmin } from '@/app/lib/auth-check';
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';


// 1. LẤY CHI TIẾT (Để đổ dữ liệu vào form Sửa)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const { id } = await params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: { 
        sections: { // Lấy kèm danh sách Chương
          include: {
            lessons: true // Trong chương lấy kèm Bài học
          },
          // Sắp xếp chương theo thứ tự tạo (nếu muốn)
          // orderBy: { createdAt: 'asc' } 
        }
      }
    });
    // const course = await prisma.course.findUnique({ where: { id } });
    
    if (!course) return NextResponse.json({ message: 'Không tìm thấy' }, { status: 404 });
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}

// 2. CẬP NHẬT (SỬA)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const { id } = await params;
    const body = await request.json();

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        title: body.title,
        thumbnail: body.thumbnail,
        instructor: body.instructor,
        lessons: Number(body.lessons),
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi cập nhật' }, { status: 500 });
  }
}

// 3. XÓA KHÓA HỌC
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const { id } = await params;
    
    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Xóa thành công' });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi khi xóa' }, { status: 500 });
  }
}