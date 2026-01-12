
import React, { useState } from 'react';

interface CheckoutProps {
  onPlaceOrder: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onPlaceOrder }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'cash'>('card');

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 md:px-10 lg:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Checkout Steps */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-[#1b140d] tracking-tight">Checkout</h1>
            <p className="text-[#9a734c] text-lg">Complete your order details below</p>
          </div>

          {/* Progress Bar */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#f3ede7]">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <p className="text-[#1b140d] font-bold">Order Progress</p>
                <p className="text-[#ec8013] font-black text-sm">Step 2 of 3</p>
              </div>
              <div className="rounded-full bg-gray-100 h-2 overflow-hidden">
                <div className="h-full bg-[#ec8013] rounded-full transition-all duration-700" style={{ width: '66%' }}></div>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-gray-400">Details</span>
                <span className="text-[#ec8013]">Payment</span>
                <span className="text-gray-400">Confirmation</span>
              </div>
            </div>
          </div>

          {/* Step 1: Delivery Details (Completed) */}
          <div className="bg-white/70 rounded-3xl shadow-sm border border-green-500/30 p-8 flex justify-between items-center">
            <div className="flex items-start gap-4">
              <span className="material-icons-round text-green-600">check_circle</span>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[#1b140d]">1. Delivery Details</h2>
                <p className="text-[#9a734c]">123 Main Street, New York, NY 10001 • Apt 4B</p>
              </div>
            </div>
            <button className="text-[#ec8013] font-bold text-sm hover:underline">Edit</button>
          </div>

          {/* Step 2: Payment Method (Active) */}
          <div className="bg-white rounded-3xl shadow-xl border-2 border-[#ec8013]/10 p-8 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#ec8013]"></div>
            
            <h2 className="text-2xl font-black text-[#1b140d] flex items-center gap-3">
              <span className="flex items-center justify-center size-8 rounded-full bg-[#ec8013] text-white text-sm">2</span>
              Payment Method
            </h2>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-100">
              <button 
                onClick={() => setPaymentMethod('card')}
                className={`pb-4 px-2 font-black uppercase tracking-widest text-sm transition-all border-b-2 ${paymentMethod === 'card' ? 'border-[#ec8013] text-[#ec8013]' : 'border-transparent text-gray-400'}`}
              >
                Credit Card
              </button>
              <button 
                onClick={() => setPaymentMethod('paypal')}
                className={`pb-4 px-2 font-black uppercase tracking-widest text-sm transition-all border-b-2 ${paymentMethod === 'paypal' ? 'border-[#ec8013] text-[#ec8013]' : 'border-transparent text-gray-400'}`}
              >
                PayPal
              </button>
              <button 
                onClick={() => setPaymentMethod('cash')}
                className={`pb-4 px-2 font-black uppercase tracking-widest text-sm transition-all border-b-2 ${paymentMethod === 'cash' ? 'border-[#ec8013] text-[#ec8013]' : 'border-transparent text-gray-400'}`}
              >
                Cash
              </button>
            </div>

            {/* Form */}
            <div className="grid gap-6 max-w-lg">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1b140d] uppercase tracking-widest">Card Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-icons-round">credit_card</span>
                  <input className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent focus:border-[#ec8013] focus:ring-0 rounded-2xl text-[#1b140d] font-medium" placeholder="0000 0000 0000 0000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1b140d] uppercase tracking-widest">Expiry Date</label>
                  <input className="w-full px-4 py-3.5 bg-gray-50 border-transparent focus:border-[#ec8013] focus:ring-0 rounded-2xl text-[#1b140d] font-medium" placeholder="MM / YY" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1b140d] uppercase tracking-widest">CVC</label>
                  <input className="w-full px-4 py-3.5 bg-gray-50 border-transparent focus:border-[#ec8013] focus:ring-0 rounded-2xl text-[#1b140d] font-medium" placeholder="123" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1b140d] uppercase tracking-widest">Cardholder Name</label>
                <input className="w-full px-4 py-3.5 bg-gray-50 border-transparent focus:border-[#ec8013] focus:ring-0 rounded-2xl text-[#1b140d] font-medium" placeholder="Full Name on Card" />
              </div>
              <label className="flex items-center gap-3 mt-2 cursor-pointer group">
                <input type="checkbox" className="size-5 rounded border-gray-300 text-[#ec8013] focus:ring-[#ec8013]" defaultChecked />
                <span className="text-sm text-[#9a734c] group-hover:text-[#1b140d] transition-colors">Save this card for future orders</span>
              </label>
            </div>
          </div>

          {/* Step 3: Confirmation (Inactive) */}
          <div className="bg-white/50 rounded-3xl p-8 opacity-60 border border-transparent">
            <h2 className="text-xl font-bold text-[#1b140d] flex items-center gap-3">
              <span className="flex items-center justify-center size-8 rounded-full bg-gray-200 text-gray-500 text-sm">3</span>
              Confirmation
            </h2>
          </div>
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-24 space-y-6">
            {/* Map Preview */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#f3ede7] overflow-hidden h-44 relative">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://picsum.photos/seed/map/400/200")' }}></div>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
                <span className="material-icons-round text-[#ec8013] text-sm">schedule</span>
                25-35 min
              </div>
            </div>

            {/* Summary Details */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-[#f3ede7] space-y-6">
              <h3 className="text-xl font-black text-[#1b140d]">Order Summary</h3>
              
              <div className="flex items-center gap-4 pb-6 border-b border-dashed border-gray-100">
                <div className="size-16 rounded-2xl bg-[#f3ede7] shrink-0 overflow-hidden">
                   <img src="https://picsum.photos/seed/rest/100/100" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-black text-[#1b140d]">Burger King</p>
                  <p className="text-sm text-[#9a734c]">Downtown Branch</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <span className="text-[#ec8013] font-black text-xs bg-[#ec8013]/10 px-2 py-1 rounded-md h-fit">2x</span>
                    <div>
                      <p className="text-sm font-bold text-[#1b140d]">Double Whopper</p>
                      <p className="text-[10px] text-[#9a734c] uppercase tracking-wide">Extra Cheese, No Onion</p>
                    </div>
                  </div>
                  <p className="font-black text-sm text-[#1b140d]">$14.50</p>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <span className="text-[#ec8013] font-black text-xs bg-[#ec8013]/10 px-2 py-1 rounded-md h-fit">1x</span>
                    <div>
                      <p className="text-sm font-bold text-[#1b140d]">French Fries (L)</p>
                    </div>
                  </div>
                  <p className="font-black text-sm text-[#1b140d]">$3.99</p>
                </div>
              </div>

              <div className="relative">
                <input className="w-full pl-4 pr-24 py-3 bg-gray-50 border-transparent focus:border-[#ec8013] focus:ring-0 rounded-2xl text-sm" placeholder="Promo code" />
                <button className="absolute right-1 top-1 bottom-1 px-4 bg-white text-[#ec8013] font-black text-xs rounded-xl shadow-sm hover:bg-gray-100 transition-colors">Apply</button>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-sm text-[#9a734c]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#1b140d]">$18.49</span>
                </div>
                <div className="flex justify-between text-sm text-[#9a734c]">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-[#1b140d]">$2.99</span>
                </div>
                <div className="flex justify-between text-sm text-[#9a734c]">
                  <span>Tax</span>
                  <span className="font-bold text-[#1b140d]">$1.50</span>
                </div>
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-dashed border-gray-100">
                  <span className="text-lg font-black text-[#1b140d]">Total</span>
                  <span className="text-3xl font-black text-[#ec8013]">$22.98</span>
                </div>
              </div>

              <button 
                onClick={onPlaceOrder}
                className="w-full bg-[#ec8013] hover:bg-[#d67210] text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-[#ec8013]/30 transition-all transform active:scale-95 flex items-center justify-between"
              >
                <span>Place Order</span>
                <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">$22.98</span>
              </button>

              <p className="text-[10px] text-center text-[#9a734c] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 pt-2">
                <span className="material-icons-round text-sm">lock</span>
                Secure Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
