import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    // 1. FIX QUAN TRỌNG: Thêm await cho headers() (Next.js 15 bắt buộc)
    const headersList = await headers();
    const token = headersList.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ message: 'Chưa đăng nhập (No Token)' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || 'secret123';
    const decoded: any = jwt.verify(token, secret);
    const userId = decoded.userId;

    // 2. Lấy dữ liệu và Validate kỹ càng
    const body = await request.json();
    const { quizId, userAnswers, courseId, lessonId } = body;

    // Log ra xem Client gửi gì lên (Quan trọng để debug)
    console.log("Submit Payload:", { userId, quizId, lessonId, answersCount: userAnswers?.length });

    if (!quizId || !userAnswers || !Array.isArray(userAnswers)) {
      return NextResponse.json({ message: 'Dữ liệu bài làm không hợp lệ' }, { status: 400 });
    }

    // 3. Lấy đề thi gốc KÈM đáp án đúng
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { answers: true }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json({ message: 'Không tìm thấy đề thi' }, { status: 404 });
    }

    // 4. Chấm điểm (Logic an toàn hơn)
    let correctCount = 0;
    const details: any[] = [];

    quiz.questions.forEach(question => {
      // Tìm đáp án đúng trong DB
      const correctAnswer = question.answers.find(a => a.isCorrect);
      
      // Tìm câu trả lời của user
      const userAnswer = userAnswers.find((ua: any) => ua.questionId === question.id);

      // So sánh (Chỉ tính điểm nếu có chọn đáp án)
      const isCorrect = Boolean(
        correctAnswer && 
        userAnswer && 
        userAnswer.answerId === correctAnswer.id
      );

      if (isCorrect) correctCount++;

      details.push({
        questionId: question.id,
        isCorrect,
        // Chỉ trả về ID đáp án đúng để client hiện màu xanh, không lộ nội dung nếu không cần
        correctAnswerId: correctAnswer?.id 
      });
    });

    // 5. Tính kết quả
    const total = quiz.questions.length;
    // Tránh chia cho 0
    const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const isPassed = scorePercent >= 80; // Điểm chuẩn 80%

    // 6. Nếu đậu -> Lưu tiến độ (Cần có lessonId và courseId)
    if (isPassed && lessonId && courseId) {
      try {
        await prisma.userProgress.upsert({
          where: {
            userId_lessonId: { userId, lessonId }
          },
          update: { isCompleted: true, completedAt: new Date() },
          create: { userId, lessonId, courseId, isCompleted: true }
        });
      } catch (dbError) {
        console.error("Lỗi lưu UserProgress:", dbError);
        // Không return lỗi ở đây để user vẫn nhận được kết quả thi
      }
    }

    return NextResponse.json({
      score: scorePercent,
      total,
      correctCount,
      isPassed,
      details,
      message: isPassed ? "Chúc mừng! Bạn đã vượt qua." : "Chưa đạt, vui lòng thử lại."
    });

  } catch (error: any) {
    // IN LỖI RA TERMINAL
    console.error("🔥 LỖI API SUBMIT:", error);
    
    return NextResponse.json(
      { message: 'Lỗi server chấm bài: ' + error.message }, 
      { status: 500 }
    );
  }
}