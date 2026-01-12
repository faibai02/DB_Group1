
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#f3ede7] py-12 px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <span className="text-lg font-bold tracking-tight text-[#1b140d] flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="material-icons-round text-[#ec8013]">auto_awesome</span>
            Foodie
          </span>
          <p className="text-sm text-[#9a734c]">© 2023 Foodie Delivery App. All rights reserved.</p>
        </div>
        <div className="flex gap-6 text-[#9a734c] text-sm font-medium">
          <a href="#" className="hover:text-[#ec8013] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#ec8013] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#ec8013] transition-colors">Help Center</a>
        </div>
        <div className="flex gap-4">
          <button className="h-10 w-10 rounded-full bg-[#f3ede7] flex items-center justify-center text-[#1b140d] hover:scale-110 transition-transform">
            <span className="material-icons-round">facebook</span>
          </button>
          <button className="h-10 w-10 rounded-full bg-[#f3ede7] flex items-center justify-center text-[#1b140d] hover:scale-110 transition-transform">
            <span className="material-icons-round">camera_alt</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
