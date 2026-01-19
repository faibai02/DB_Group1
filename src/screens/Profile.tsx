
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/profile';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      setSaveStatus({ type: 'error', message: 'Name and email are required' });
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({ name, email });
      updateUser({ name, email, customerId: user?.customerId });
      setSaveStatus({ type: 'success', message: 'Profile updated successfully!' });
      setIsEditing(false);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error: any) {
      setSaveStatus({ type: 'error', message: error.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setIsEditing(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12 space-y-12">
      <h1 className="text-4xl font-black text-[#1b140d] tracking-tight">Your Profile</h1>

      <div className="space-y-8">
        {/* User Information */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#f3ede7] max-w-4xl space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#1b140d]">Personal Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-[#ec8013] text-white rounded-xl font-bold hover:bg-[#d67210] transition-all"
              >
                <span className="flex items-center gap-1">
                  <span className="material-icons-round text-sm">edit</span>
                  Edit
                </span>
              </button>
            )}
          </div>

          {saveStatus && (
            <div
              className={`p-4 rounded-xl text-sm font-bold ${
                saveStatus.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {saveStatus.message}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-[#1b140d] uppercase tracking-widest">Full Name</label>
              <input 
                className="w-full px-5 py-4 bg-[#fcfaf8] border border-[#f3ede7] focus:border-[#ec8013] focus:ring-0 rounded-2xl text-[#1b140d] font-medium disabled:opacity-50 disabled:cursor-not-allowed" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-[#1b140d] uppercase tracking-widest">Email Address</label>
              <input 
                className="w-full px-5 py-4 bg-[#fcfaf8] border border-[#f3ede7] focus:border-[#ec8013] focus:ring-0 rounded-2xl text-[#1b140d] font-medium disabled:opacity-50 disabled:cursor-not-allowed" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
