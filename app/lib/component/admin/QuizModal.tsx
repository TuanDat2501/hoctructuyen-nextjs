'use client';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../axios';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string | null;
}

export default function QuizModal({ isOpen, onClose, lessonId }: QuizModalProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load dữ liệu cũ khi mở Modal
  useEffect(() => {
    if (isOpen && lessonId) {
      axiosInstance.get(`/admin/quiz/${lessonId}`)
        .then((res: any) => {
          if (res.questions) setQuestions(res.questions);
          else setQuestions([]); // Chưa có thì reset
        })
        .catch(() => toast.error('Lỗi tải câu hỏi'));
    }
  }, [isOpen, lessonId]);

  // --- CÁC HÀM XỬ LÝ FORM ---
  const addQuestion = () => {
    setQuestions([...questions, { title: '', answers: [{ content: '', isCorrect: false }] }]);
  };

  const removeQuestion = (idx: number) => {
    const newQ = [...questions];
    newQ.splice(idx, 1);
    setQuestions(newQ);
  };

  const updateQuestionTitle = (idx: number, val: string) => {
    const newQ = [...questions];
    newQ[idx].title = val;
    setQuestions(newQ);
  };

  const addAnswer = (qIdx: number) => {
    const newQ = [...questions];
    newQ[qIdx].answers.push({ content: '', isCorrect: false });
    setQuestions(newQ);
  };

  const removeAnswer = (qIdx: number, aIdx: number) => {
    const newQ = [...questions];
    newQ[qIdx].answers.splice(aIdx, 1);
    setQuestions(newQ);
  };

  const updateAnswerContent = (qIdx: number, aIdx: number, val: string) => {
    const newQ = [...questions];
    newQ[qIdx].answers[aIdx].content = val;
    setQuestions(newQ);
  };

  const setCorrectAnswer = (qIdx: number, aIdx: number) => {
    const newQ = [...questions];
    // Reset hết về false trước (nếu là trắc nghiệm 1 đáp án đúng)
    newQ[qIdx].answers.forEach((a: any) => a.isCorrect = false);
    newQ[qIdx].answers[aIdx].isCorrect = true;
    setQuestions(newQ);
  };

  const handleSave = async () => {
    if (!lessonId) return;
    
    // Validate sơ sơ
    for (const q of questions) {
      if (!q.title) return toast.error('Có câu hỏi chưa nhập đề bài!');
      if (q.answers.length < 2) return toast.error('Mỗi câu phải có ít nhất 2 đáp án!');
      if (!q.answers.some((a: any) => a.isCorrect)) return toast.error('Có câu hỏi chưa chọn đáp án đúng!');
    }

    setLoading(true);
    try {
      await axiosInstance.post('/admin/quiz', { lessonId, questions });
      toast.success('Lưu bài kiểm tra thành công!');
      onClose();
    } catch (error) {
      toast.error('Lỗi khi lưu.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl h-[90vh] flex flex-col">
        
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold">Soạn Thảo Bài Kiểm Tra</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">Đóng</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              
              {/* Header Câu hỏi */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Câu hỏi số {qIdx + 1}</label>
                  <input 
                    className="w-full text-lg font-medium border-b-2 border-gray-200 focus:border-indigo-500 outline-none pb-1"
                    placeholder="Nhập nội dung câu hỏi..."
                    value={q.title}
                    onChange={(e) => updateQuestionTitle(qIdx, e.target.value)}
                  />
                </div>
                <button onClick={() => removeQuestion(qIdx)} className="text-red-400 hover:text-red-600 ml-4">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>

              {/* Danh sách Đáp án */}
              <div className="space-y-3 pl-4 border-l-2 border-gray-100">
                {q.answers.map((a: any, aIdx: number) => (
                  <div key={aIdx} className="flex items-center gap-3">
                    {/* Nút chọn đáp án đúng */}
                    <button 
                      onClick={() => setCorrectAnswer(qIdx, aIdx)}
                      className={`text-xl transition-colors ${a.isCorrect ? 'text-green-500' : 'text-gray-300 hover:text-green-300'}`}
                      title="Đánh dấu là đáp án đúng"
                    >
                      <FontAwesomeIcon icon={a.isCorrect ? faCheckCircle : faCircle} />
                    </button>
                    
                    <input 
                      className={`flex-1 border px-3 py-2 rounded text-sm outline-none ${a.isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                      placeholder={`Đáp án ${aIdx + 1}`}
                      value={a.content}
                      onChange={(e) => updateAnswerContent(qIdx, aIdx, e.target.value)}
                    />
                    
                    <button onClick={() => removeAnswer(qIdx, aIdx)} className="text-gray-400 hover:text-red-500">
                      <FontAwesomeIcon icon={faTrash} className="text-sm" />
                    </button>
                  </div>
                ))}
                
                <button 
                  onClick={() => addAnswer(qIdx)}
                  className="text-sm text-indigo-600 font-medium hover:underline mt-2 flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faPlus} /> Thêm đáp án
                </button>
              </div>

            </div>
          ))}

          <button 
            onClick={addQuestion}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-bold hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} /> THÊM CÂU HỎI MỚI
          </button>
        </div>

        <div className="p-4 border-t bg-white flex justify-end">
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 shadow-lg disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'LƯU BÀI KIỂM TRA'}
          </button>
        </div>

      </div>
    </div>
  );
}