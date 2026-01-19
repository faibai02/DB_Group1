
import React from 'react';

interface ConfirmationProps {
  orderData: { orderId: number; items: any[]; total: number; address: string } | null;
  onTrackOrder: () => void;
  onGoHistory: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({ orderData, onTrackOrder, onGoHistory }) => {
  if (!orderData) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
        <p className="text-[#9a734c]">No order information available</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-16 flex flex-col items-center text-center space-y-10">
      <div className="space-y-4 max-w-lg">
        <div className="size-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <span className="material-icons-round text-5xl">check_circle</span>
        </div>
        <h1 className="text-5xl font-black text-[#1b140d] tracking-tight">Order Confirmed!</h1>
        <p className="text-lg text-[#9a734c] leading-relaxed">
          Your order <span className="text-[#1b140d] font-bold">#{orderData.orderId}</span> is confirmed and on its way. 
          You'll receive a notification when it's out for delivery.
        </p>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-xl border border-[#f3ede7] w-full max-w-2xl space-y-8">
        <div className="text-left space-y-6">
          <h3 className="text-xl font-black text-[#1b140d] uppercase tracking-widest text-sm border-b border-gray-100 pb-4">Order Summary</h3>
          
          <div className="space-y-4">
            {orderData.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-bold text-[#1b140d]">{item.name}</span>
                  <span className="text-xs text-[#9a734c]">{item.quantity}x</span>
                </div>
                <span className="font-black text-[#1b140d]">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-dashed border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-lg font-black text-[#1b140d]">Total</span>
              <span className="text-3xl font-black text-[#ec8013]">${orderData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button 
            onClick={onGoHistory}
            className="w-full bg-[#ec8013] text-white py-4 px-8 rounded-2xl font-black text-lg shadow-xl shadow-[#ec8013]/30 hover:bg-[#d67210] transition-all transform active:scale-95"
          >
            View Order History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
