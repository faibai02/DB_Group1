import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface CartProps {
  onCheckout: () => void;
  onContinueShopping: () => void;
  onNavigateLogin?: () => void;
}

const Cart: React.FC<CartProps> = ({ onCheckout, onContinueShopping, onNavigateLogin }) => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { isLoggedIn, isLoading } = useAuth();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      onNavigateLogin?.();
      return;
    }
    onCheckout();
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-20 md:px-10 lg:px-20">
        <div className="text-center space-y-6">
          <span className="material-icons-round text-7xl text-gray-300">shopping_cart</span>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-[#1b140d]">Your Cart is Empty</h1>
            <p className="text-[#9a734c] text-lg">Start adding some delicious dishes to your cart!</p>
          </div>
          <button
            onClick={onContinueShopping}
            className="bg-[#ec8013] hover:bg-[#d67210] text-white font-black py-3 px-8 rounded-full shadow-lg transform hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
          >
            Continue Shopping
            <span className="material-icons-round">arrow_forward</span>
          </button>
        </div>
      </div>
    );
  }

  if (!isLoggedIn && !isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-20 md:px-10 lg:px-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100">
              <span className="material-icons-round text-5xl text-yellow-600">lock</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-[#1b140d]">Sign In Required</h1>
              <p className="text-[#9a734c] text-lg">You must be logged in to checkout</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onNavigateLogin}
              className="bg-[#ec8013] hover:bg-[#d67210] text-white font-black py-3 px-8 rounded-full shadow-lg transform hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
            >
              <span className="material-icons-round">login</span>
              Sign In
            </button>
            <button
              onClick={onContinueShopping}
              className="bg-gray-200 hover:bg-gray-300 text-[#1b140d] font-black py-3 px-8 rounded-full shadow-lg transform hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
            >
              <span className="material-icons-round">arrow_back</span>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 md:px-10 lg:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-2 mb-6">
            <h1 className="text-4xl font-black text-[#1b140d]">Shopping Cart</h1>
            <p className="text-[#9a734c]">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
          </div>

          <div className="space-y-4">
            {cart.map((cartItem) => (
              <div
                key={cartItem.item.id}
                className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-[#f3ede7] hover:shadow-md transition-all"
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={cartItem.item.image}
                    alt={cartItem.item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-[#1b140d] text-lg">{cartItem.item.name}</h3>
                    <p className="text-sm text-[#9a734c]">{cartItem.item.restaurant}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(cartItem.item.id, Math.max(1, cartItem.quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-sm"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold">{cartItem.quantity}</span>
                    <button
                      onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end">
                  <button
                    onClick={() => removeFromCart(cartItem.item.id)}
                    className="text-red-500 hover:text-red-600 text-sm font-bold"
                  >
                    Remove
                  </button>
                  <p className="text-lg font-black text-[#ec8013]">
                    ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onContinueShopping}
            className="w-full text-center text-[#ec8013] hover:text-[#d67210] font-bold py-3 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-icons-round">arrow_back</span>
            Continue Shopping
          </button>
        </div>

        {/* Right Column: Summary */}
        <div className="space-y-4">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#f3ede7] space-y-4">
              <h2 className="text-xl font-black text-[#1b140d]">Order Summary</h2>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9a734c]">Subtotal</span>
                  <span className="font-bold text-[#1b140d]">${getTotalPrice().toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                  <span className="font-black text-[#1b140d]">Total</span>
                  <span className="text-2xl font-black text-[#ec8013]">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-[#ec8013] hover:bg-[#d67210] text-white font-black py-3 px-6 rounded-xl shadow-lg shadow-[#ec8013]/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!isLoggedIn ? 'Sign In to Checkout' : 'Proceed to Checkout'}
              </button>

              <p className="text-[10px] text-center text-[#9a734c] uppercase tracking-widest font-bold">
                Secure Payment
              </p>
            </div>

            <button
              onClick={clearCart}
              className="w-full text-red-500 hover:text-red-600 font-bold py-2 text-sm transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
