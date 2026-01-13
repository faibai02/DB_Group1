
import React from 'react';

interface ConfirmationProps {
  onTrackOrder: () => void;
  onGoHistory: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({ onTrackOrder, onGoHistory }) => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-16 flex flex-col items-center text-center space-y-10">
      <div className="space-y-4 max-w-lg">
        <div className="size-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <span className="material-icons-round text-5xl">check_circle</span>
        </div>
        <h1 className="text-5xl font-black text-[#1b140d] tracking-tight">Order Confirmed!</h1>
        <p className="text-lg text-[#9a734c] leading-relaxed">
          Your order <span className="text-[#1b140d] font-bold">#ORD-123456789</span> is confirmed and on its way. 
          You'll receive a notification when it's out for delivery.
        </p>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-xl border border-[#f3ede7] w-full max-w-2xl space-y-8">
        <div className="flex items-center gap-6 bg-[#fcfaf8] p-6 rounded-2xl text-left border border-[#f3ede7]">
          <div className="size-14 rounded-2xl bg-white flex items-center justify-center text-[#ec8013] shadow-sm">
            <span className="material-icons-round text-3xl">schedule</span>
          </div>
          <div>
            <p className="text-xs font-black text-[#9a734c] uppercase tracking-widest mb-1">Delivery Time</p>
            <p className="text-xl font-black text-[#1b140d]">Estimated: 30-45 minutes</p>
          </div>
        </div>

        <div className="text-left space-y-6">
          <h3 className="text-xl font-black text-[#1b140d] uppercase tracking-widest text-sm border-b border-gray-100 pb-4">Order Summary</h3>
          
          <div className="space-y-4">
            {[
              { name: 'Spicy Chicken Sandwich', qty: '1x', price: 12.99 },
              { name: 'Fries', qty: '1x', price: 3.99 },
              { name: 'Coke', qty: '1x', price: 2.49 }
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-bold text-[#1b140d]">{item.name}</span>
                  <span className="text-xs text-[#9a734c]">{item.qty}</span>
                </div>
                <span className="font-black text-[#1b140d]">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-dashed border-gray-100 space-y-2">
            <div className="flex justify-between text-sm text-[#9a734c]">
              <span>Subtotal</span>
              <span className="font-bold text-[#1b140d]">$19.47</span>
            </div>
            <div className="flex justify-between text-sm text-[#9a734c]">
              <span>Delivery Fee</span>
              <span className="font-bold text-[#1b140d]">$2.99</span>
            </div>
            <div className="flex justify-between text-sm text-[#9a734c]">
              <span>Tax</span>
              <span className="font-bold text-[#1b140d]">$1.50</span>
            </div>
            <div className="flex justify-between items-center pt-4 mt-2">
              <span className="text-lg font-black text-[#1b140d]">Total</span>
              <span className="text-3xl font-black text-[#ec8013]">$23.96</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            onClick={onTrackOrder}
            className="flex-1 bg-[#ec8013] text-white py-4 px-8 rounded-2xl font-black text-lg shadow-xl shadow-[#ec8013]/30 hover:bg-[#d67210] transition-all transform active:scale-95"
          >
            Track Order
          </button>
          <button 
            onClick={onGoHistory}
            className="flex-1 bg-[#f3ede7] text-[#1b140d] py-4 px-8 rounded-2xl font-black text-lg hover:bg-gray-200 transition-all transform active:scale-95"
          >
            View Order History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
