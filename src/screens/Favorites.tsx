
import React from 'react';
import { FoodItem } from '../types';
import { MOCK_ITEMS } from '../constants';

interface FavoritesProps {
  onSelectProduct: (item: FoodItem) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ onSelectProduct }) => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-4xl font-black text-[#1b140d] tracking-tight">Your Favorites</h1>
        <div className="flex items-center gap-4 text-sm font-bold text-[#9a734c]">
          <span>Sorted by: <span className="text-[#1b140d]">Recent</span></span>
          <span className="material-icons-round">swap_vert</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {MOCK_ITEMS.map((item) => (
          <div 
            key={item.id} 
            className="group cursor-pointer space-y-3"
            onClick={() => onSelectProduct(item)}
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-sm border border-[#f3ede7]">
              <img 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                src={item.image} 
              />
              <div className="absolute top-3 right-3">
                <button className="size-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-[#ec8013] shadow-sm hover:scale-110 transition-transform">
                  <span className="material-icons-round text-sm">favorite</span>
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-black text-[#1b140d] leading-tight line-clamp-1">{item.name}</h3>
              <p className="text-[10px] text-[#9a734c] font-bold uppercase tracking-widest mt-0.5">{item.category}</p>
              <div className="flex items-center justify-between mt-2">
                 <p className="text-[#ec8013] font-black text-sm">${item.price.toFixed(2)}</p>
                 <div className="flex text-yellow-400">
                    <span className="material-icons-round text-[12px]">star</span>
                    <span className="text-[10px] text-[#1b140d] font-black ml-1">4.8</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-12">
        <button className="size-10 flex items-center justify-center rounded-xl border border-[#f3ede7] text-[#1b140d] hover:bg-gray-50">
          <span className="material-icons-round">chevron_left</span>
        </button>
        <button className="size-10 flex items-center justify-center rounded-xl bg-[#ec8013] text-white font-black">1</button>
        <button className="size-10 flex items-center justify-center rounded-xl border border-[#f3ede7] text-[#1b140d] hover:bg-gray-50">2</button>
        <button className="size-10 flex items-center justify-center rounded-xl border border-[#f3ede7] text-[#1b140d] hover:bg-gray-50">3</button>
        <button className="size-10 flex items-center justify-center rounded-xl border border-[#f3ede7] text-[#1b140d] hover:bg-gray-50">
          <span className="material-icons-round">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default Favorites;
