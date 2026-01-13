
import React from 'react';
import { Screen } from '../src/types';

interface HeaderProps {
  onNavigate: (screen: Screen) => void;
  currentScreen: Screen;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentScreen }) => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f3ede7] px-10 py-3 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <div 
          className="flex items-center gap-4 text-[#1b140d] cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <div className="size-8 rounded-full bg-[#ec8013] flex items-center justify-center text-white">
            <span className="material-icons-round text-xl">auto_awesome</span>
          </div>
          <h2 className="text-[#1b140d] text-xl font-bold leading-tight tracking-[-0.015em]">Foodie</h2>
        </div>
        <nav className="hidden md:flex items-center gap-9">
          <button 
            onClick={() => onNavigate('home')}
            className={`text-sm font-medium leading-normal hover:text-[#ec8013] transition-colors ${currentScreen === 'home' ? 'text-[#ec8013]' : 'text-[#1b140d]'}`}
          >
            Home
          </button>
          <button 
            onClick={() => onNavigate('restaurants')}
            className={`text-sm font-medium leading-normal hover:text-[#ec8013] transition-colors ${currentScreen === 'restaurants' ? 'text-[#ec8013]' : 'text-[#1b140d]'}`}
          >
            Restaurants
          </button>
          <button 
            onClick={() => onNavigate('orders')}
            className={`text-sm font-medium leading-normal hover:text-[#ec8013] transition-colors ${currentScreen === 'orders' ? 'text-[#ec8013]' : 'text-[#1b140d]'}`}
          >
            My Orders
          </button>
          <button 
            onClick={() => onNavigate('favorites')}
            className={`text-sm font-medium leading-normal hover:text-[#ec8013] transition-colors ${currentScreen === 'favorites' ? 'text-[#ec8013]' : 'text-[#1b140d]'}`}
          >
            Browse
          </button>
        </nav>
      </div>
      <div className="flex flex-1 justify-end gap-6 items-center">
        <label className="hidden sm:flex flex-col min-w-40 !h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden border border-transparent focus-within:border-[#ec8013] bg-[#f3ede7]">
            <div className="text-[#9a734c] flex items-center justify-center pl-4">
              <span className="material-icons-round text-[20px]">search</span>
            </div>
            <input
              placeholder="Search"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden border-none bg-transparent focus:outline-0 focus:ring-0 h-full placeholder:text-[#9a734c] px-4 pl-2 text-sm font-normal leading-normal"
            />
          </div>
        </label>
        <div className="flex gap-2">
          <button 
            onClick={() => onNavigate('favorites')}
            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-[#f3ede7] text-[#1b140d] hover:bg-gray-200 transition-colors"
          >
            <span className="material-icons-round text-[20px]">favorite_border</span>
          </button>
          <button 
            onClick={() => onNavigate('checkout')}
            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-[#f3ede7] text-[#1b140d] hover:bg-gray-200 transition-colors"
          >
            <span className="material-icons-round text-[20px]">shopping_cart</span>
          </button>
        </div>
        <button 
          onClick={() => onNavigate('profile')}
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-transparent hover:border-[#ec8013] transition-all"
          style={{ backgroundImage: 'url("https://picsum.photos/seed/user1/100/100")' }}
        />
      </div>
    </header>
  );
};

export default Header;
