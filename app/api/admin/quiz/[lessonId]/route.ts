import { verifyAdmin } from '@/app/lib/auth-check';
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const { lessonId } = await params;
    const quiz = await prisma.quiz.findUnique({
      where: { lessonId },
      include: {
        questions: {
          include: { answers: true }
        }
      }
    });
    
    return NextResponse.json(quiz || { questions: [] }); // Trả về rỗng nếu chưa có
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi lấy Quiz' }, { status: 500 });
  }
}