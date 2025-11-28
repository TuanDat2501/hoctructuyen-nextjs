import { verifyAdmin } from '@/app/lib/auth-check';
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const body = await request.json();
    const newSection = await prisma.section.create({
      data: {
        title: body.title,
        courseId: body.courseId,
      }
    });
    return NextResponse.json(newSection);
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi tạo chương' }, { status: 500 });
  }
}