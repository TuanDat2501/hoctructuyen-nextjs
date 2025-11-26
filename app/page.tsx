'use client';
import { decrement, increment } from "./lib/redux/features/counter/counterSlice";
import { useAppDispatch, useAppSelector } from "./lib/redux/hook";

// Bắt buộc

export default function HomePage() {
  // Lấy state
  const count = useAppSelector((state) => state.counter.value);
  // Lấy hàm dispatch
  const dispatch = useAppDispatch();

  return (
    <>
      <section className="course-section">
        <div className="container course">
          <h2 className="section-title">KHÓA HỌC MỚI 2025</h2>
          <div className="course-grid">
            <div className="course-card">
              <div className="course-image-wrapper">
                <img src="https://via.placeholder.com/400x225?text=Mô+hình+hóa+hệ+thống+Điện"
                  alt="Mô hình hóa 3D hệ thống Điện trong công trình"/>
              </div>
              <div className="course-details">
                <div className="course-meta">
                  <span><i className="far fa-clock"></i> 10h học</span>
                  <span><i className="fas fa-file-alt"></i> 10 phần/58 bài</span>
                  <span><i className="fas fa-eye"></i> 20075</span>
                </div>
                <h3 className="course-title">Mô hình hóa 3D hệ thống Điện trong công trình</h3>
                <div className="course-instructor">
                  <i className="fas fa-user-circle"></i> Mai Hoàng Nam
                </div>
                <div className="course-price">
                  <span className="old-price">3.200.000₫</span>
                  <span className="current-price">2.396.000₫</span>
                </div>
              </div>
            </div>

            <div className="course-card">
              <div className="course-image-wrapper">
                <img src="https://via.placeholder.com/400x225?text=Hướng+dẫn+thiết+kế+CV"
                  alt="Thiết kế CV kiểu mới & Kỹ năng phỏng vấn hiệu quả"/>
              </div>
              <div className="course-details">
                <div className="course-meta">
                  <span><i className="far fa-clock"></i> 9 giờ</span>
                  <span><i className="fas fa-file-alt"></i> 7 phần/64 bài</span>
                  <span><i className="fas fa-eye"></i> 10581</span>
                </div>
                <h3 className="course-title">Thiết kế CV kiểu mới & Kỹ năng phỏng vấn hiệu quả</h3>
                <div className="course-instructor">
                  <i className="fas fa-user-circle"></i> Mai Hoàng Nam
                </div>
                <div className="course-price">
                  <span className="old-price">2.500.000₫</span>
                  <span className="current-price">1.496.000₫</span>
                </div>
              </div>
            </div>

            <div className="course-card">
              <div className="course-image-wrapper">
                <img src="https://via.placeholder.com/400x225?text=Revit+Central"
                  alt="Triển khai Revit Central & Phối hợp làm việc nhóm hiệu quả"/>
              </div>
              <div className="course-details">
                <div className="course-meta">
                  <span><i className="far fa-clock"></i> 6 giờ</span>
                  <span><i className="fas fa-file-alt"></i> 6 phần/65 bài</span>
                  <span><i className="fas fa-eye"></i> 16046</span>
                </div>
                <h3 className="course-title">Triển khai Revit Central - Làm việc nhóm hiệu quả</h3>
                <div className="course-instructor">
                  <i className="fas fa-user-circle"></i> Mai Hoàng Nam
                </div>
                <div className="course-price">
                  <span className="old-price">2.500.000₫</span>
                  <span className="current-price">996.000₫</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}