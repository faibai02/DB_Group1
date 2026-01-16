
import React, { useState } from 'react';
import { FoodItem } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductDetailProps {
  item: FoodItem;
  onCheckout: () => void;
  onBack: () => void;
  onNavigateLogin?: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ item, onCheckout, onBack, onNavigateLogin }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isLoggedIn, isLoading } = useAuth();
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      onNavigateLogin?.();
      return;
    }
    addToCart(item, quantity);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      onNavigateLogin?.();
      return;
    }
    onCheckout();
  };

  const totalPrice = item.price * quantity;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-8">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[#9a734c] hover:text-[#ec8013] transition-colors font-bold"
      >
        <span className="material-icons-round">arrow_back</span>
        Back
      </button>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        {/* Left: Image */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-white shadow-lg border border-[#f3ede7]">
            <img 
              alt={item.name} 
              className="w-full h-full object-cover" 
              src={item.image} 
            />
          </div>
        </div>

        {/* Right: Info */}
        <div className="mt-8 lg:mt-0 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#f3ede7] text-[#ec8013] text-xs font-bold uppercase tracking-wider">
              {item.category}
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-[#1b140d] tracking-tight leading-tight">
              {item.name}
            </h1>
            <p className="text-[#9a734c] font-medium flex items-center gap-2 text-lg">
              <span className="material-icons-round text-xl">storefront</span> 
              {item.restaurant}
            </p>
          </div>

          <div className="flex items-center justify-between py-4 border-y border-[#f3ede7]">
            <div className="text-4xl font-black text-[#ec8013]">
              ${item.price.toFixed(2)}
            </div>
            <div className="flex items-center gap-2 text-[#9a734c]">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-icons-round text-base">
                    {i < Math.floor(item.rating) ? 'star' : (i < item.rating ? 'star_half' : 'star_outline')}
                  </span>
                ))}
              </div>
              <span className="text-sm font-medium">({item.reviews})</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black text-[#1b140d] uppercase tracking-widest mb-3">Description</h3>
            <p className="text-base text-[#9a734c] leading-relaxed">
              {item.description}
            </p>
          </div>

          {(item.available === false) && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg w-fit">
              <span className="material-icons-round text-sm">cancel</span>
              <span className="text-sm font-bold">Currently Unavailable</span>
            </div>
          )}

          <div className="border-t border-[#f3ede7] pt-6 space-y-4">
            {/* Quantity selector */}
            <div>
              <h3 className="text-sm font-black text-[#1b140d] uppercase tracking-widest mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-[#f3ede7] rounded-2xl h-14 bg-white shadow-sm overflow-hidden">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-5 h-full hover:bg-gray-50 transition-colors disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <span className="material-icons-round text-[#1b140d]">remove</span>
                  </button>
                  <span className="w-16 text-center font-black text-xl text-[#1b140d]">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-5 h-full hover:bg-gray-50 transition-colors"
                  >
                    <span className="material-icons-round text-[#1b140d]">add</span>
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#9a734c] uppercase tracking-wider font-bold">Total</p>
                  <p className="text-3xl font-black text-[#ec8013]">${totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                onClick={handleAddToCart}
                disabled={item.available === false || isLoading}
                className="flex-1 bg-[#ec8013] text-white rounded-2xl py-4 px-6 font-black text-lg shadow-xl shadow-[#ec8013]/20 hover:shadow-[#ec8013]/40 transform hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="material-icons-round">add_shopping_cart</span>
                {!isLoggedIn ? 'Sign In to Order' : 'Add to Cart'}
              </button>
              <button 
                onClick={handleCheckout}
                disabled={isLoading}
                className="h-[56px] px-8 bg-[#1b140d] text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-[#2d231c] transition-all shadow-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-icons-round">shopping_bag</span>
                {!isLoggedIn ? 'View Cart' : 'View Cart'}
              </button>
            </div>
          </div>

          {/* Notification */}
          {showNotification && (
            <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-50 animate-slide-in">
              <span className="material-icons-round">check_circle</span>
              <span className="font-bold">Added to cart!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
