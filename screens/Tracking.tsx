
import React from 'react';

const Tracking: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1b140d] tracking-tight">Track Your Order</h1>
          <p className="text-[#9a734c] font-medium mt-1">Order #ORD-98765 • <span className="text-[#ec8013] font-black">Preparing</span></p>
        </div>
        <button className="px-6 py-2.5 bg-white border border-[#f3ede7] rounded-xl font-bold text-[#1b140d] shadow-sm hover:bg-gray-50 transition-colors">
          Need Help?
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Progress & Map */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#f3ede7]">
            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>
              <div className="absolute top-1/2 left-0 w-1/2 h-1.5 bg-[#ec8013] -translate-y-1/2 rounded-full z-0 transition-all duration-1000 ease-out"></div>
              <div className="relative z-10 flex justify-between w-full">
                {[
                  { icon: 'check', label: 'Confirmed', time: '10:30 AM', active: true },
                  { icon: 'restaurant', label: 'Preparing', time: '10:45 AM', active: true },
                  { icon: 'local_shipping', label: 'On the way', time: '', active: false },
                  { icon: 'home', label: 'Delivered', time: '', active: false },
                ].map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-all ${step.active ? 'bg-[#ec8013] text-white' : 'bg-gray-200 text-gray-400'}`}>
                      <span className="material-icons-round text-lg">{step.icon}</span>
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-black uppercase tracking-widest ${step.active ? 'text-[#1b140d]' : 'text-gray-400'}`}>{step.label}</p>
                      {step.time && <p className="text-[10px] text-[#9a734c] mt-1 font-bold">{step.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-12 flex items-center justify-between bg-[#fcfaf8] p-6 rounded-2xl border border-[#f3ede7]">
              <div>
                <p className="text-xs font-black text-[#9a734c] uppercase tracking-widest mb-1">Estimated Arrival</p>
                <p className="text-2xl font-black text-[#1b140d]">11:15 AM - 11:30 AM</p>
              </div>
              <div className="h-14 w-14 rounded-full bg-[#ec8013]/10 flex items-center justify-center text-[#ec8013]">
                <span className="material-icons-round text-3xl">schedule</span>
              </div>
            </div>
          </div>

          {/* Map & Driver Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#f3ede7] overflow-hidden">
            <div className="relative w-full h-[450px] bg-gray-100">
               <img 
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover opacity-80"
                alt="Map context"
              />
              <div className="absolute inset-0 bg-[#ec8013]/5"></div>
              
              {/* Overlay Driver Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white p-6 rounded-2xl shadow-2xl border border-[#f3ede7] flex items-center gap-6 max-w-lg mx-auto md:mx-0">
                <div className="relative shrink-0">
                  <div className="size-16 rounded-full bg-gray-200 overflow-hidden ring-4 ring-[#f3ede7]">
                    <img src="https://picsum.photos/seed/driver/100/100" className="w-full h-full object-cover" alt="Driver profile" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-black text-[#1b140d]">Michael R.</p>
                  <p className="text-xs font-bold text-[#9a734c] uppercase tracking-wider">Driver • Toyota Camry (XYZ-123)</p>
                  <div className="flex items-center gap-1 mt-1">
                     <span className="material-icons-round text-yellow-400 text-xs">star</span>
                     <span className="text-xs font-black text-[#1b140d]">4.9</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="w-11 h-11 rounded-full bg-[#f3ede7] flex items-center justify-center text-[#1b140d] hover:bg-[#ec8013] hover:text-white transition-all">
                    <span className="material-icons-round text-[20px]">call</span>
                  </button>
                  <button className="w-11 h-11 rounded-full bg-[#f3ede7] flex items-center justify-center text-[#1b140d] hover:bg-[#ec8013] hover:text-white transition-all">
                    <span className="material-icons-round text-[20px]">chat</span>
                  </button>
                </div>
              </div>

              {/* Delivery Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="size-16 bg-[#ec8013] rounded-full opacity-20 animate-ping absolute"></div>
                  <div className="size-6 bg-[#ec8013] rounded-full border-4 border-white relative z-10 shadow-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#f3ede7] sticky top-24 space-y-8">
            <h3 className="text-xl font-black text-[#1b140d] border-b border-gray-100 pb-4">Order Summary</h3>
            
            <div className="space-y-6">
              {[
                { qty: '1x', name: 'Spicy Chicken Sandwich', options: 'Extra spicy, No mayo', price: 12.99 },
                { qty: '1x', name: 'Large Fries', options: '', price: 3.99 },
                { qty: '1x', name: 'Cola', options: '', price: 2.49 }
              ].map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="size-8 rounded-lg flex items-center justify-center bg-[#f3ede7] text-xs font-black text-[#9a734c] shrink-0">{item.qty}</div>
                    <div>
                      <p className="text-sm font-bold text-[#1b140d]">{item.name}</p>
                      {item.options && <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{item.options}</p>}
                    </div>
                  </div>
                  <p className="text-sm font-black text-[#1b140d]">${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-100 pt-6 space-y-3">
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
            </div>

            <div className="pt-6 flex justify-between items-center border-t border-gray-100">
              <span className="text-lg font-black text-[#1b140d]">Total</span>
              <span className="text-2xl font-black text-[#ec8013]">$23.96</span>
            </div>

            <div className="bg-[#fcfaf8] p-5 rounded-2xl flex gap-4 items-start border border-[#f3ede7]">
              <span className="material-icons-round text-[#9a734c] text-xl">location_on</span>
              <div>
                <p className="text-xs font-black text-[#1b140d] uppercase tracking-widest mb-1">Delivery to Home</p>
                <p className="text-xs text-[#9a734c] font-medium leading-relaxed">1234 Main St, Apartment 4B, New York, NY 10001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
