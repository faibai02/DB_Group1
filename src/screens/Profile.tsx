
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12 space-y-12">
      <h1 className="text-4xl font-black text-[#1b140d] tracking-tight">Your Profile</h1>

      <div className="space-y-8">
        {/* User Information */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#f3ede7] max-w-4xl space-y-10">
          <h2 className="text-2xl font-black text-[#1b140d]">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-[#1b140d] uppercase tracking-widest">Full Name</label>
              <input 
                className="w-full px-5 py-4 bg-[#fcfaf8] border border-[#f3ede7] focus:border-[#ec8013] focus:ring-0 rounded-2xl text-[#1b140d] font-medium" 
                value={user?.name || ''}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-[#1b140d] uppercase tracking-widest">Email Address</label>
              <input 
                className="w-full px-5 py-4 bg-[#fcfaf8] border border-[#f3ede7] focus:border-[#ec8013] focus:ring-0 rounded-2xl text-[#1b140d] font-medium" 
                value={user?.email || ''}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
