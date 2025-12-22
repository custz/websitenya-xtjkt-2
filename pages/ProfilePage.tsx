
import React, { useRef, useState } from 'react';
import { User, Camera, Briefcase, GraduationCap, Calendar, Info, Shield, Check, Settings, Fingerprint, Venus, Mars, ShieldAlert, Globe, Loader2 } from 'lucide-react';
import { useStore } from '../services/store';

// Helper to compress images
const compressImage = (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 500; // Small size for profile pics
      const scale = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(base64Str);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.7)); // High compression
    };
  });
};

const ProfilePage: React.FC = () => {
  const { userProfile, updateProfile, userRole, data, updateData } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const adminFileRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [editType, setEditType] = useState<'personal' | 'global'>(userRole === 'admin' ? 'global' : 'personal');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'personal' | 'admin') => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const compressed = await compressImage(base64);
        
        if (target === 'personal') {
          updateProfile({ image: compressed });
        } else {
          updateData({ adminProfile: { ...data.adminProfile, image: compressed } });
        }
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const getGenderIcon = () => {
    return userProfile.gender === 'Perempuan' ? <Venus className="text-pink-500" size={12} /> : <Mars className="text-blue-500" size={12} />;
  };

  return (
    <div className="min-h-screen pt-32 pb-40 px-4 md:px-8 bg-[#05050a] relative overflow-hidden">
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm glass-card rounded-[3rem] p-8 border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-10">
              <div className="flex flex-col">
                <span className="mono text-[8px] font-black text-blue-500 tracking-[0.5em] uppercase">
                  {editType === 'global' ? 'Global System Identity' : 'Local User Protocol'}
                </span>
                <span className="text-xs font-bold text-white tracking-widest uppercase">
                  {editType === 'global' ? 'Network Admin' : 'Digital Identity'}
                </span>
              </div>
              {editType === 'global' ? <Shield size={24} className="text-blue-500" /> : <Fingerprint size={24} className="text-blue-500" />}
            </div>

            <div className="flex flex-col items-center mb-10">
              <div className="relative w-48 h-48 rounded-[2.5rem] p-2 glass-card border-blue-500/30 glow-blue overflow-hidden group-hover:scale-105 transition-transform duration-700">
                {isProcessing ? (
                  <div className="w-full h-full bg-slate-900 rounded-[2rem] flex items-center justify-center">
                    <Loader2 className="text-blue-500 animate-spin" size={40} />
                  </div>
                ) : editType === 'global' ? (
                  data.adminProfile.image ? (
                    <img src={data.adminProfile.image} alt="Admin" className="w-full h-full object-cover rounded-[2rem]" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 rounded-[2rem] flex items-center justify-center">
                      <ShieldAlert size={64} className="text-slate-600" />
                    </div>
                  )
                ) : (
                  userProfile.image ? (
                    <img src={userProfile.image} alt="Profile" className="w-full h-full object-cover rounded-[2rem]" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 rounded-[2rem] flex items-center justify-center">
                      <User size={64} className="text-slate-600" />
                    </div>
                  )
                )}
                
                {!isProcessing && (
                  <button 
                    onClick={() => editType === 'global' ? adminFileRef.current?.click() : fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  >
                    <Camera size={32} className="text-white mb-2" />
                    <span className="text-[8px] font-black uppercase text-white tracking-widest">Update Photo</span>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-1 truncate">
                  {editType === 'global' ? data.adminProfile.name : userProfile.name}
                </h2>
                <div className="flex items-center justify-center gap-2">
                   <div className="mono text-[9px] text-blue-400 font-bold tracking-[0.3em] uppercase">
                     {editType === 'global' ? data.adminProfile.role : userProfile.major}
                   </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 italic text-slate-400 text-[11px] text-center leading-relaxed">
                {userProfile.bio || "No bio set..."}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="glass-card rounded-[3.5rem] p-10 md:p-14 border-white/5 shadow-2xl">
            {userRole === 'admin' && (
              <div className="flex mb-10 bg-black/40 p-2 rounded-2xl border border-white/5">
                <button onClick={() => setEditType('global')} className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl font-black transition-all text-[9px] uppercase tracking-widest ${editType === 'global' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500'}`}><Globe size={14} /> Global Admin</button>
                <button onClick={() => setEditType('personal')} className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl font-black transition-all text-[9px] uppercase tracking-widest ${editType === 'personal' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500'}`}><User size={14} /> My Profile</button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="mono text-[9px] font-black text-blue-500 uppercase">Nama</label>
                <input className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none" value={editType === 'global' ? data.adminProfile.name : userProfile.name} onChange={(e) => editType === 'global' ? updateData({ adminProfile: { ...data.adminProfile, name: e.target.value } }) : updateProfile({ name: e.target.value })} />
              </div>
              <div className="space-y-3">
                <label className="mono text-[9px] font-black text-blue-500 uppercase">Peran / Jurusan</label>
                <input className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none" value={editType === 'global' ? data.adminProfile.role : userProfile.major} onChange={(e) => editType === 'global' ? updateData({ adminProfile: { ...data.adminProfile, role: e.target.value } }) : updateProfile({ major: e.target.value })} />
              </div>
            </div>

            <div className="mt-12">
              <button onClick={() => alert("Perubahan disimpan!")} className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl font-black uppercase text-[10px] tracking-widest transition-all shadow-2xl shadow-blue-600/20 active:scale-95">
                <Check size={18} className="inline mr-2" /> Simpan Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'personal')} />
      <input type="file" ref={adminFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'admin')} />
    </div>
  );
};

export default ProfilePage;
