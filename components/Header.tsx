
import React from 'react';
import { Screen } from '../src/types';
import { useAuth } from '../src/context/AuthContext';
import { useCart } from '../src/context/CartContext';

interface HeaderProps {
  onNavigate: (screen: Screen | 'signup' | 'login' | 'cart') => void;
  currentScreen: Screen | 'signup' | 'login' | 'cart';
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentScreen }) => {
  const { isLoggedIn, logout: authLogout } = useAuth();
  const { getTotalItems } = useCart();

  const handleLogout = () => {
    authLogout();
    onNavigate('home');
  };

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
            Orders
          </button>
        </nav>
      </div>
      <div className="flex flex-1 justify-end gap-6 items-center">
        <div className="flex gap-2 items-center">
          {isLoggedIn ? (
            <>
              <button 
                onClick={() => onNavigate('cart')}
                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-[#f3ede7] text-[#1b140d] hover:bg-gray-200 transition-colors relative"
              >
                <span className="material-icons-round text-[20px]">shopping_cart</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ec8013] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              <button 
                onClick={() => onNavigate('profile')}
                className="text-sm font-medium text-[#1b140d] hover:text-[#ec8013] transition-colors px-3"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="hidden sm:block text-sm font-medium text-[#ec8013] hover:text-[#d07009] transition-colors px-3"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate('login')}
                className="hidden sm:block text-sm font-medium text-[#1b140d] hover:text-[#ec8013] transition-colors px-3 py-2"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('signup')}
                className="hidden sm:block text-sm font-medium text-white bg-[#ec8013] hover:bg-[#d07009] transition-colors px-4 py-2 rounded-lg"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
