import { verifyAdmin } from '@/app/lib/auth-check';
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';


// TẠO HOẶC CẬP NHẬT QUIZ
export async function POST(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const body = await request.json();
    const { lessonId, questions } = body;

    // 1. Xóa Quiz cũ (nếu có) để tạo mới cho sạch (hoặc dùng update nested nhưng phức tạp hơn)
    // Cách đơn giản nhất để update Quiz là xóa hết câu hỏi cũ đi tạo lại
    await prisma.quiz.deleteMany({ where: { lessonId } });

    // 2. Tạo Quiz mới kèm câu hỏi và đáp án
    const newQuiz = await prisma.quiz.create({
      data: {
        lessonId,
        questions: {
          create: questions.map((q: any) => ({
            title: q.title,
            answers: {
              create: q.answers.map((a: any) => ({
                content: a.content,
                isCorrect: a.isCorrect
              }))
            }
          }))
        }
      },
      include: {
        questions: { include: { answers: true } }
      }
    });

    return NextResponse.json(newQuiz);

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'Lỗi lưu Quiz' }, { status: 500 });
  }
}