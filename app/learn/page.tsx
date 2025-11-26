
import './style.scss';

export default function LearnComponent() {
  return (
    <>
    <section className="syllabus-section">
        <div className="container">
          <h2 className="syllabus-title">CHƯƠNG TRÌNH GIẢNG DẠY</h2>

          <div className="syllabus-meta">
            <span><i className="fas fa-book"></i> Gồm: 3 phần - 27 bài</span>
            <span><i className="far fa-clock"></i> Thời lượng: 8 giờ</span>
          </div>

          <div className="syllabus-list">

            <div className="syllabus-item">
              <div className="item-header">
                <span className="toggle-icon"><i className="fas fa-plus"></i></span>
                <span className="part-name">PHẦN I – NHỮNG KHÁI NIỆM & QUY TẮC TRONG COMBINE</span>
              </div>
              <div className="item-details">
                <span className="document-icon"><i className="fas fa-file-alt"></i></span>
                <span className="video-count">8 Video</span>
              </div>
            </div>

            <div className="syllabus-item">
              <div className="item-header">
                <span className="toggle-icon"><i className="fas fa-plus"></i></span>
                <span className="part-name">PHẦN 2 – DỰNG HÌNH & COMBINE PHÒNG BƠM CHỮA CHÁY</span>
              </div>
              <div className="item-details">
                <span className="document-icon"><i className="fas fa-file-alt"></i></span>
                <span className="video-count">16 Video</span>
              </div>
            </div>

            <div className="syllabus-item">
              <div className="item-header">
                <span className="toggle-icon"><i className="fas fa-plus"></i></span>
                <span className="part-name">PHẦN 3 – QUY TRÌNH PHỐI HỢP COMBINE</span>
              </div>
              <div className="item-details">
                <span className="document-icon"><i className="fas fa-file-alt"></i></span>
                <span className="video-count">4 Video</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}