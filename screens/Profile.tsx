
import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12 space-y-12">
      <h1 className="text-4xl font-black text-[#1b140d] tracking-tight">Your Profile</h1>

      <div className="space-y-8">
        {/* Tabs */}
        <div className="border-b border-[#f3ede7] flex gap-10 overflow-x-auto no-scrollbar">
          {['Personal Info', 'Addresses', 'Payment Methods', 'Preferences', 'Security'].map((tab, i) => (
            <button 
              key={tab} 
              className={`pb-4 px-1 font-black text-sm uppercase tracking-widest whitespace-nowrap transition-all border-b-4 ${i === 0 ? 'border-[#ec8013] text-[#1b140d]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#f3ede7] max-w-4xl space-y-10">
          <h2 className="text-2xl font-black text-[#1b140d]">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-[#1b140d] uppercase tracking-widest">Full Name</label>
              <input 
                className="w-full px-5 py-4 bg-[#fcfaf8] border border-[#f3ede7] focus:border-[#ec8013] focus:ring-0 rounded-2xl text-[#1b140d] font-medium" 
                defaultValue="John Doe" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-[#1b140d] uppercase tracking-widest">Email Address</label>
              <input 
                className="w-full px-5 py-4 bg-[#fcfaf8] border border-[#f3ede7] focus:border-[#ec8013] focus:ring-0 rounded-2xl text-[#1b140d] font-medium" 
                defaultValue="john.doe@example.com" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-[#1b140d] uppercase tracking-widest">Phone Number</label>
              <input 
                className="w-full px-5 py-4 bg-[#fcfaf8] border border-[#f3ede7] focus:border-[#ec8013] focus:ring-0 rounded-2xl text-[#1b140d] font-medium" 
                defaultValue="+1 (555) 000-0000" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-[#1b140d] uppercase tracking-widest">Date of Birth</label>
              <input 
                type="date"
                className="w-full px-5 py-4 bg-[#fcfaf8] border border-[#f3ede7] focus:border-[#ec8013] focus:ring-0 rounded-2xl text-[#1b140d] font-medium" 
                defaultValue="1990-01-01" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-[#1b140d] uppercase tracking-widest">Gender</label>
              <select className="w-full px-5 py-4 bg-[#fcfaf8] border border-[#f3ede7] focus:border-[#ec8013] focus:ring-0 rounded-2xl text-[#1b140d] font-medium appearance-none">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button className="bg-[#ec8013] text-white py-4 px-10 rounded-2xl font-black text-lg shadow-xl shadow-[#ec8013]/30 hover:bg-[#d67210] transition-all transform active:scale-95">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
