// Đường dẫn tùy project của bạn
import './globals.css';
import StoreProvider from './lib/redux/provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"></link>
      </head>
      <body>
        <StoreProvider>
          <header>
            <div className="top-bar">
              <div className="container">
                <div className="search-section">
                  <input type="text" placeholder="Bạn tìm gì?" />
                  <button className="search-btn">Tìm</button>
                </div>
                <div className="contact-info">
                  <span><i className="fas fa-phone"></i> Tư vấn & hỗ trợ: 0974 114 905</span>
                  <span><i className="fas fa-envelope"></i> training@dscons.vn</span>
                </div>
                <div className="auth-buttons">
                  <button className="btn btn-register"><i className="fas fa-user-plus"></i> Đăng Ký</button>
                  <button className="btn btn-login"><i className="fas fa-sign-in-alt"></i> Đăng Nhập</button>
                </div>
              </div>
            </div>

            <div className="main-nav">
              <div className="container">
                <div className="logo">
                  <img src="https://via.placeholder.com/150x50?text=DSCons" alt="DSCons Logo" />
                  <div className="logo-text">
                    DSCons
                    <span>TRAINING BIM TOOLS & WORKFLOW</span>
                  </div>
                </div>
                <nav>
                  <ul>
                    <li><a href="#"><i className="fas fa-home"></i> Trang chủ</a></li>
                    <li><a href="#"><i className="fas fa-star"></i> KH mới</a></li>
                    <li><a href="#"><i className="fas fa-gift"></i> KH tặng kèm</a></li>
                    <li><a href="#"><i className="fas fa-clock"></i> Lộ trình</a></li>
                    <li><a href="#"><i className="fas fa-folder-open"></i> Tài liệu <i
                      className="fas fa-chevron-down"></i></a></li>
                    <li><a href="#"><i className="fas fa-chart-line"></i> CTV</a></li>
                    <li><a href="#"><i className="fas fa-user-friends"></i> DSCons</a></li>
                  </ul>
                </nav>
                <div className="cart-icon">
                  <i className="fas fa-shopping-cart"></i>
                  <span className="cart-count">0</span>
                </div>
              </div>
            </div>
          </header>
          {children}
          <footer>
        <div className="container">
          <div className="footer-content">

            <div className="footer-col">
              <h3>LIÊN HỆ</h3>
              <ul className="contact-list">
                <li>
                  <i className="fas fa-mobile-alt"></i>
                  <span>0974 114 905</span>
                </li>
                <li>
                  <i className="fas fa-envelope"></i>
                  <span>training@dscons.vn</span>
                </li>
                <li>
                  <i className="fas fa-home"></i>
                  <span>Tầng 4, số 11, Hà Kế Tấn, Thanh Xuân, Hà Nội</span>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>HỖ TRỢ HỌC VIÊN</h3>
              <ul className="link-list">
                <li><span className="square-dot"></span> <a href="#">Hỗ Trợ Học Viên</a></li>
                <li><span className="square-dot"></span> <a href="#">Câu Hỏi Thường Gặp</a></li>
                <li><span className="square-dot"></span> <a href="#">Cảm Nhận Học Viên</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>CHÍNH SÁCH ĐIỀU KHOẢN</h3>
              <ul className="link-list">
                <li><span className="square-dot"></span> <a href="#">Chương trình Affiliate</a></li>
                <li><span className="square-dot"></span> <a href="#">Điều khoản dịch vụ</a></li>
                <li><span className="square-dot"></span> <a href="#">Chính sách bảo mật</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
            <p className="copyright">
              Made with <i className="fas fa-heart heart-icon"></i> by DSCONS
            </p>
          </div>
        </div>
      </footer>
        </StoreProvider>
      </body>
    </html>
  );
}