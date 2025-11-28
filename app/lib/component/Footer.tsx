'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faLock, faBolt } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    // 1. Đổi nền sang màu tối thẫm (slate-950) để làm nổi nội dung
    <footer className="bg-slate-950 border-t-4 border-indigo-600 py-12 relative overflow-hidden">
      
      {/* Hiệu ứng ánh sáng nền (Glow Effect) - Trang trí cho đẹp */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center relative z-10">
        
        {/* 1. LOGO & BRAND */}
        <div className="mb-8 flex flex-col items-center">
           {/* Nếu logo là ảnh */}
           <img 
            src="123png150.png" 
            alt="Sano Media" 
            className="h-20 w-auto object-contain mb-2 brightness-0 invert drop-shadow-lg" 
            // brightness-0 invert: Biến logo đen thành trắng tinh
          />
          {/* Hoặc nếu chưa có logo thì dùng text này */}
          {/* <h2 className="text-3xl font-black text-white tracking-tighter">SANO <span className="text-indigo-500">MEDIA</span></h2> */}
        </div>

        {/* 2. CÂU TRUYỀN ĐỘNG LỰC (QUOTE) - Làm to và sáng rực lên */}
        <div className="max-w-3xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <div className="mb-4">
             <FontAwesomeIcon icon={faBolt} className="text-yellow-400 text-2xl animate-bounce" />
          </div>
          
          <p className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 leading-tight mb-4">
            "Không ngừng học hỏi,<br/> Không ngừng vươn xa."
          </p>
          
          <p className="text-slate-400 text-base font-medium">
            Nâng tầm giá trị bản thân cùng <span className="text-white font-bold">Sano Media Academy</span>.
          </p>
        </div>

        {/* 3. FOOTER BOTTOM */}
        <div className="mt-12 w-full flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 border-t border-slate-900 pt-6">
          
          {/* Badge bảo mật */}
          <div className="flex items-center gap-3">
            <span className="bg-indigo-900/30 text-indigo-400 px-3 py-1 rounded-full border border-indigo-900/50 flex items-center gap-2 text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(99,102,241,0.2)]">
              <FontAwesomeIcon icon={faLock} /> Internal Use Only
            </span>
            <span className="hidden md:inline">|</span>
            <span>© 2025 Sano Media</span>
          </div>

          {/* Credits */}
          <div className="flex items-center gap-1 group cursor-default">
            Built with <FontAwesomeIcon icon={faHeart} className="text-red-600 group-hover:scale-125 transition-transform duration-300" /> by 
            <span className="text-slate-300 font-semibold group-hover:text-white transition-colors">Tech Team</span>
          </div>
          
        </div>

      </div>
    </footer>
  );
}