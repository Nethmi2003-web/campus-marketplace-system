import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Camera, Save, User, Loader2 } from 'lucide-react';

export function UserProfileTab() {
  const [userInfo, setUserInfo] = useState(() => JSON.parse(localStorage.getItem('std_userInfo') || '{}'));
  const [formData, setFormData] = useState({
    firstName: userInfo.firstName || '',
    lastName: userInfo.lastName || '',
    phone: userInfo.phone || '',
    bio: userInfo.bio || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(userInfo.profileImage || null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend Validations
    if (formData.firstName.trim().length < 2) {
      return toast.error("First Name must be at least 2 characters long.");
    }
    if (formData.lastName.trim().length < 2) {
      return toast.error("Last Name must be at least 2 characters long.");
    }
    
    // Basic Phone Number Validation (allows optional + code and 9-15 digits ignoring spaces/dashes)
    if (formData.phone && !/^\+?\d{9,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      return toast.error("Please enter a valid phone number (e.g. 077 123 4567 or +94771234567).");
    }
    
    if (formData.bio && formData.bio.length > 500) {
      return toast.error("Bio is too long! Please keep it under 500 characters.");
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('phone', formData.phone);
      data.append('bio', formData.bio);
      if (imageFile) {
        data.append('profileImage', imageFile);
      }

      const res = await axios.put('/api/users/me', data, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      // Update local storage
      const updatedUser = { ...userInfo, ...res.data };
      localStorage.setItem('std_userInfo', JSON.stringify(updatedUser));
      setUserInfo(updatedUser);
      toast.success('Profile updated successfully!');
      
      // Trigger global storage event
      window.dispatchEvent(new Event('storage'));
      
      // Reload page to correctly re-hydrate the Navbar with the new image
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Profile update crash:', error);
      const serverMsg = error.response?.data?.message;
      const sysMsg = error.message;
      toast.error(serverMsg || `Network/System Error: ${sysMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full pb-20">
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-primary/5 border border-primary/10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-primary">Profile Settings</h2>
            <p className="text-muted-foreground font-medium">Update your campus identity and contact details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-4 border-white shadow-lg relative">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-primary/5">
                    <User size={48} className="opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="text-white" size={32} />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg, image/jpg, image/png, image/webp"
                className="hidden"
              />
              <div className="mt-3 text-center sm:hidden">
                <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full">Change Photo</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border-2 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium text-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border-2 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium text-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">University Email (Read Only)</label>
                <input
                  type="email"
                  value={userInfo.universityEmail || ''}
                  className="w-full px-4 py-3 rounded-xl bg-muted/80 border-2 border-transparent text-muted-foreground font-medium cursor-not-allowed"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-muted/50">
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +94 77 123 4567"
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border-2 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium text-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">Faculty (Read Only)</label>
              <input
                type="text"
                value={userInfo.faculty || 'Not Specified'}
                className="w-full px-4 py-3 rounded-xl bg-muted/80 border-2 border-transparent text-muted-foreground font-medium cursor-not-allowed"
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-primary">Bio (Optional)</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell other students a bit about yourself..."
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border-2 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium text-primary resize-none"
            />
          </div>

          <div className="pt-6 flex justify-end pb-2">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
