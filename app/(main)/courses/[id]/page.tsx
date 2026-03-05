'use client';

import React, { use, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hook';
import axiosInstance, { isCancel } from '@/app/lib/axios';
import { fetchProgress, markLessonComplete } from '@/app/lib/redux/features/progress/progressSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faChevronLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { isYouTubeProvider, MediaDestroyEvent, MediaPlayer, MediaPlayerInstance, MediaProvider, Poster, type MediaProviderAdapter, type YouTubeProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { useMediaStore } from '@vidstack/react';
import toast from 'react-hot-toast';
import CourseAccordion from '@/app/lib/component/CourseAccordion';
import QuizPlayer from '@/app/lib/component/QuizPlayer';


export default function CourseLearningPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const isMountedRef = useRef(true);
  const { completedLessonIds } = useAppSelector((state: any) => state.progress);
  const activeLessonRef = useRef<any>(null);
  const playerRef = useRef<MediaPlayerInstance>(null);
  const mediaStore = useMediaStore(playerRef);

  useEffect(() => {
    activeLessonRef.current = activeLesson;
  }, [activeLesson]);
  // 1. Load Course Detail


  useEffect(() => {
    isMountedRef.current = true;
    const controller = new AbortController();
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const data = await axiosInstance.get(`/courses/${params.id}`, {
          signal: controller.signal
        }) as any;

        // Nếu component đã bị hủy (unmounted) thì không set state nữa để tránh lỗi
        if (controller.signal.aborted) return;
        setCourse(data);

        // Chọn bài đầu tiên (Nếu chưa chọn)
        if (data.sections?.length > 0 && data.sections[0].lessons?.length > 0) {
          setActiveLesson(data.sections[0].lessons[0]);
        }
        // --- GỌI API LẤY TIẾN ĐỘ ---
        dispatch(fetchProgress(data.id));

      } catch (error) {
        // 3. BẮT LỖI ABORT ĐỂ KHÔNG BÁO ĐỎ
        if (isCancel(error) || error.name === 'CanceledError' || error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
          // Đây là lỗi do mình tự hủy -> Bỏ qua, không làm gì cả
          return;
        }
        console.error("Lỗi tải khóa học", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCourseDetail();
    }
    return () => {

      controller.abort(); // Ra lệnh hủy request đang chạy dở
      // Khi component unmount (chuyển trang/back):
      isMountedRef.current = false;


    };
  }, [params.id, dispatch]);

  // 2. Hàm xử lý: Hoàn thành bài học
  const handleMarkCompleted = async () => {
    if (!activeLesson || completedLessonIds.includes(activeLesson.id)) return;

    await toast.promise(
      dispatch(markLessonComplete({
        lessonId: activeLesson.id,
        courseId: course.id
      })).unwrap(),
      {
        loading: 'Đang lưu...',
        success: 'Đã học xong! 🎉',
        error: 'Lỗi lưu.',
      }
    );
  };
  const hasMarkedRef = useRef(false);
  useEffect(() => {
    hasMarkedRef.current = false;
  }, [activeLesson]);

  // Khi thời gian video thay đổi
  const handleTimeUpdate = () => {
    if (!isMountedRef.current) return;
    const currentTime = mediaStore?.currentTime || 0;
    const duration = mediaStore?.duration || 0;
    const percent = currentTime / duration; // 0 -> 1    
    const isCompleted = completedLessonIds.includes(activeLesson?.id);

    // Logic tự động hoàn thành khi xem > 90%
    if (!isCompleted && percent > 0.9) {
      handleEnd();
    }
  };

  // Khi video kết thúc
  const handleEnd = () => {
    if (!isMountedRef.current) return;
    handleMarkCompleted();
    // Có thể thêm logic tự chuyển bài ở đây: nextLesson()
  };
  // Check xem bài hiện tại đã học xong chưa
  const isLessonCompleted = activeLesson && completedLessonIds.includes(activeLesson.id);

  if (loading) return <div className="h-screen flex items-center justify-center"><FontAwesomeIcon icon={faCircleNotch} spin className="text-4xl text-indigo-600" /></div>;
  if (!course) return <div className="p-10 text-center">Khóa học không tồn tại.</div>;

  return (
    <>
      <div className="flex flex-col">
        {/* Top Bar */}
        <div className="bg-gray-900 text-white px-4 py-3 flex items-center gap-4 shrink-0">
          <Link href="/dashboard" className="hover:text-gray-300 flex items-center gap-2 text-sm">
            <FontAwesomeIcon icon={faChevronLeft} /> Quay lại
          </Link>
          <h1 className="font-bold truncate border-l border-gray-700 pl-4 text-sm md:text-base">
            {course.title}
          </h1>
        </div>
        <div className="flex flex-1 flex-col lg:flex-row">

          {/* ------------------------- */}
          {/* CỘT TRÁI: VIDEO & CONTROLS */}
          <div className="flex-1 bg-black flex flex-col relative">
            {/* Video Player */}
            {/* <div className="w-full aspect-video bg-black relative shadow-lg shrink-0">
              {activeLesson && activeLesson.videoId ? (
                <MediaPlayer
                  key={activeLesson.id}
                  ref={playerRef}
                  title={activeLesson.title}

                  onDestroy={(nativeEvent: MediaDestroyEvent) => {
                    nativeEvent.target.destroy();
                    console.log("MediaPlayer destroyed");
                  }}
                  // Vidstack tự hiểu link Youtube
                  src={`youtube/${activeLesson.videoId}`}

                  // BẮT EVENT Ở ĐÂY (Rất trực quan)
                  onTimeUpdate={handleTimeUpdate}
                  onEnd={handleEnd}
                >
                  <MediaProvider>

                    <Poster
                      className="vds-poster w-full h-full object-cover"
                      src={activeLesson?.poster || course.thumbnail} // Link ảnh lấy từ khóa học hoặc bài học
                      alt={activeLesson.title}
                    />
                  </MediaProvider>

                
                  <DefaultVideoLayout icons={defaultLayoutIcons} />
                </MediaPlayer>
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  Chọn bài học để bắt đầu
                </div>
              )}
            </div> */}

            {activeLesson ? (
              activeLesson.type === 'QUIZ' ? (
                // --- TRƯỜNG HỢP QUIZ ---
                <div className="w-full h-full bg-gray-100 relative shadow-lg shrink-0 overflow-hidden">
                  <QuizPlayer
                    key={activeLesson.id}
                    lessonId={activeLesson.id}
                    courseId={course.id}
                    title={activeLesson.title}
                  />
                </div>
              ) : (
                // --- TRƯỜNG HỢP VIDEO (Cũ) ---
                <div className="w-full aspect-video bg-black relative shadow-lg shrink-0 overflow-hidden">
                  {/* <MediaPlayer
                    key={activeLesson.id}
                    ref={playerRef}
                    title={activeLesson.title}

                    onDestroy={(nativeEvent: MediaDestroyEvent) => {
                      nativeEvent.target.destroy();
                      console.log("MediaPlayer destroyed");
                    }}
                    // Vidstack tự hiểu link Youtube
                    src={`https://www.youtube.com/watch?v=xOmLxNyXc6o`}

                    // BẮT EVENT Ở ĐÂY (Rất trực quan)
                    onTimeUpdate={handleTimeUpdate}
                    onEnd={handleEnd}
                  >
                    <MediaProvider>

                      <Poster
                        className="vds-poster w-full h-full object-cover"
                        src={activeLesson?.poster || course.thumbnail} // Link ảnh lấy từ khóa học hoặc bài học
                        alt={activeLesson.title}
                      />
                    </MediaProvider>
                    <DefaultVideoLayout icons={defaultLayoutIcons} />
                  </MediaPlayer> */}
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${activeLesson.videoId}?si=ivnvtkWYQ2xC0Gp-`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
              )
            ) : (
              <div className="w-full aspect-video bg-black flex items-center justify-center">
                <p className="text-white">Chọn bài học để bắt đầu</p>
              </div>
            )}

            {/* Chỉ hiện Action Bar và Comment khi là VIDEO (Quiz có giao diện riêng rồi) */}
            {/* {activeLesson && activeLesson.type !== 'QUIZ' && (
              <>
                <div className="p-4 bg-white border-b ...">...</div>
                <div className="p-6 ...">...</div>
              </>
            )} */}

          </div>
          {/* ------------------------------------- */}


          {/* CỘT PHẢI: LIST BÀI HỌC */}
          <div className="w-full lg:w-96 bg-white border-l border-gray-200 overflow-y-auto shrink-0 flex flex-col h-full">
            <div className="p-4 border-b bg-gray-50 sticky top-0 z-10">
              <h2 className="font-bold text-gray-800">Nội dung khóa học</h2>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                {/* Thanh Process Bar nhỏ */}
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedLessonIds.length / course.lessons) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">
                {completedLessonIds.length}/{course.lessons} bài ({Math.round((completedLessonIds.length / course.lessons) * 100) || 0}%)
              </p>
            </div>

            <div className="flex-1">
              <CourseAccordion
                sections={course.sections}
                activeLessonId={activeLesson?.id}
                completedLessonIds={completedLessonIds} // <--- TRUYỀN MẢNG ID ĐÃ HỌC
                onSelectLesson={(lesson) => setActiveLesson(lesson)}
              />
            </div>
          </div>

        </div>
      </div>
      <div className="flex flex-col">
        {/* Top Bar */}
        <div className="flex">
          {/* CỘT TRÁI: VIDEO & CONTROLS */}
          <div className="flex-1 flex flex-col ">
            {/* Video Player */}
            <div className="w-full relative shadow-lg shrink-0">
              <div className="p-4 bg-white border-b flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{activeLesson?.title}</h2>
                  <p className="text-xs text-gray-500">Cập nhật: {new Date(course.updatedAt).toLocaleDateString()}</p>
                </div>

                {/* --- NÚT HOÀN THÀNH --- */}
                {
                  activeLesson.type === "VIDEO" && (
                    <button
                      onClick={handleMarkCompleted}
                      disabled={isLessonCompleted} // Nếu xong rồi thì disable nút
                      className={`
                 px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all shadow-sm
                 ${isLessonCompleted
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'}
               `}
                    >
                      {isLessonCompleted ? (
                        <><FontAwesomeIcon icon={faCheck} /> Đã hoàn thành</>
                      ) : (
                        <>Đánh dấu hoàn thành</>
                      )}
                    </button>
                  )
                }
              </div>

              {/* Description (Optional) */}
              <div className="p-6">
                <h3 className="font-bold text-gray-700 mb-2">Ghi chú bài học</h3>
                <p className="text-gray-600 text-sm">Nội dung ghi chú hoặc tài liệu đính kèm sẽ hiển thị ở đây...</p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: LIST BÀI HỌC */}
          <div className="w-full lg:w-96 bg-white border-l border-gray-200 overflow-y-auto shrink-0 flex flex-col h-full">
          </div>

        </div>
      </div>
    </>
  );
}