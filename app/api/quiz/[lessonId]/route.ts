import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/app/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    // 1. Check Login (Bắt buộc phải đăng nhập mới được thi)
    const headersList = await headers();
    const token = headersList.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // Verify token để đảm bảo user hợp lệ
    const secret = process.env.JWT_SECRET || 'secret123';
    jwt.verify(token, secret);

    const { lessonId } = await params;

    // 2. Lấy đề thi (QUAN TRỌNG: Dùng select để giấu đáp án đúng)
    const quiz = await prisma.quiz.findUnique({
      where: { lessonId },
      include: {
        questions: {
          select: {
            id: true,
            title: true,
            answers: {
              select: {
                id: true,
                content: true,
                // ⚠️ TUYỆT ĐỐI KHÔNG SELECT 'isCorrect' Ở ĐÂY
              }
            }
          }
        }
      }
    });

    if (!quiz) {
      // Trả về rỗng hoặc lỗi tùy logic, ở đây mình trả về rỗng để UI xử lý
      return NextResponse.json({ questions: [] }); 
    }

    return NextResponse.json(quiz);

  } catch (error) {
    console.error("Lỗi lấy đề thi:", error);
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}