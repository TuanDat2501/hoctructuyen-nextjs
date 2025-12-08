'use client';

import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faRedo, faSpinner } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../redux/hook';
import axiosInstance from '../axios';
import { fetchProgress } from '../redux/features/progress/progressSlice';


interface Props {
  lessonId: string;
  courseId: string;
  title: string;
}

export default function QuizPlayer({ lessonId, courseId, title }: Props) {
  const dispatch = useAppDispatch();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State bài làm: { questionId: answerId }
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // State kết quả
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // 1. Load đề thi
  useEffect(() => {

    setLoading(true);
    axiosInstance.get(`/quiz/${lessonId}`) // Có thể dùng chung API admin hoặc tạo API riêng user
      .then(res => {
        
        setQuiz(res)})
      .catch(() => toast.error('Không tải được bài kiểm tra'))
      .finally(() => setLoading(false));
  }, [lessonId]);

  // 2. Chọn đáp án
  const handleSelect = (qId: string, aId: string) => {
    setAnswers({ ...answers, [qId]: aId });
  };

  // 3. Nộp bài
  const handleSubmit = async () => {
    // Check xem làm hết chưa
    if (Object.keys(answers).length < quiz.questions.length) {
      toast.error('Vui lòng trả lời hết các câu hỏi!');
      return;
    }

    setSubmitting(true);
    try {
      // Convert state answers sang mảng object để gửi API
      const userAnswersArray = Object.keys(answers).map(qId => ({
        questionId: qId,
        answerId: answers[qId]
      }));

      const res = await axiosInstance.post('/quiz/submit', {
        quizId: quiz.id,
        lessonId,
        courseId,
        userAnswers: userAnswersArray
      });

      setResult(res);
      
      if (res.isPassed) {
        toast.success('Chúc mừng! Bạn đã vượt qua bài kiểm tra.');
        dispatch(fetchProgress(courseId)); // Cập nhật lại thanh tiến độ bên ngoài
      } else {
        toast.error('Chưa đạt yêu cầu. Hãy thử lại!');
      }

    } catch (error) {
      toast.error('Lỗi nộp bài');
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Làm lại
  const handleRetry = () => {
    setResult(null);
    setAnswers({});
  };

  if (loading) return <div className="h-full flex items-center justify-center text-white"><FontAwesomeIcon icon={faSpinner} spin /> Đang tải đề thi...</div>;
  if (!quiz || quiz.questions.length === 0) return <div className="h-full flex items-center justify-center text-white">Chưa có câu hỏi nào.</div>;

  // --- MÀN HÌNH KẾT QUẢ ---
  if (result) {
    return (
      <div className="h-full bg-gray-100 flex flex-col items-center justify-center p-8 text-center overflow-y-auto">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg ${result.isPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          <FontAwesomeIcon icon={result.isPassed ? faCheckCircle : faTimesCircle} />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {result.isPassed ? 'Hoàn thành xuất sắc!' : 'Chưa đạt yêu cầu'}
        </h2>
        <p className="text-gray-600 mb-6">
          Bạn trả lời đúng <span className="font-bold text-lg">{result.correctCount}/{result.total}</span> câu hỏi ({result.score}%)
        </p>

        {result.isPassed ? (
          <div className="bg-green-50 text-green-700 px-6 py-3 rounded-lg border border-green-200">
             Bài học đã được đánh dấu hoàn thành ✅
          </div>
        ) : (
          <button 
            onClick={handleRetry}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faRedo} /> Làm lại bài kiểm tra
          </button>
        )}
      </div>
    );
  }

  // --- MÀN HÌNH LÀM BÀI ---
  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header Quiz */}
      <div className="bg-white p-6 border-b shadow-sm shrink-0">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">Vui lòng chọn đáp án đúng nhất cho mỗi câu hỏi.</p>
      </div>

      {/* List Câu hỏi */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {quiz.questions.map((q: any, idx: number) => (
          <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex gap-3">
              <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0">
                {idx + 1}
              </span>
              {q.title}
            </h3>

            <div className="space-y-2 ml-11">
              {q.answers.map((a: any) => (
                <label 
                  key={a.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                    ${answers[q.id] === a.id 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm' 
                      : 'border-gray-200 hover:bg-gray-50'}
                  `}
                >
                  <input 
                    type="radio" 
                    name={q.id} 
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    checked={answers[q.id] === a.id}
                    onChange={() => handleSelect(q.id, a.id)}
                  />
                  <span>{a.content}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Submit */}
      <div className="p-4 bg-white border-t shrink-0 flex justify-end">
        <button 
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold shadow-md disabled:opacity-50"
        >
          {submitting ? 'Đang nộp bài...' : 'Nộp Bài'}
        </button>
      </div>
    </div>
  );
}