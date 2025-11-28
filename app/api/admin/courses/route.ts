import { verifyAdmin } from '@/app/lib/auth-check';
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';


// 1. LẤY DANH SÁCH KHÓA HỌC
export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }, // Mới nhất lên đầu
    });
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi lấy danh sách' }, { status: 500 });
  }
}

// 2. TẠO KHÓA HỌC MỚI (Dùng để test)
export async function POST(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const body = await request.json();
    const newCourse = await prisma.course.create({
      data: {
        title: body.title,
        thumbnail: body.thumbnail,
        lessons: Number(body.lessons||0),
        instructor: body.instructor,
      }
    });
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error:any) {
    return NextResponse.json({ message: 'Lỗi tạo khóa học' + error.message}, { status: 500 });
  }
}