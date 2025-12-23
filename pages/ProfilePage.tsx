
import React, { useRef, useState } from 'react';
import { User, Camera, Briefcase, GraduationCap, Calendar, Info, Shield, Check, Settings, Fingerprint, Venus, Mars, ShieldAlert, Globe, Loader2, ShieldCheck, Zap, Terminal, Cpu } from 'lucide-react';
import { useStore } from '../services/store';

const compressImage = (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 500;
      const scale = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(base64Str);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
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

  return (
    <div className="min-h-screen pt-32 pb-40 px-4 md:px-8 bg-[#020205] relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className={`w-full max-w-sm glass-card rounded-[3.5rem] p-8 border-white/10 shadow-2xl relative overflow-hidden group transition-all duration-500 ${editType === 'global' ? 'ring-2 ring-blue-500/20' : ''}`}>
            {/* Header Identity */}
            <div className="flex justify-between items-start mb-10">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                   <div className={`w-2 h-2 rounded-full ${editType === 'global' ? 'bg-blue-500 animate-ping' : 'bg-slate-500'}`}></div>
                   <span className={`mono text-[8px] font-black tracking-[0.4em] uppercase ${editType === 'global' ? 'text-blue-500' : 'text-slate-500'}`}>
                     {editType === 'global' ? 'System_Architect_Protocol' : 'Local_User_Identity'}
                   </span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-sm font-black text-white tracking-widest uppercase">
                     {editType === 'global' ? 'Root Administrator' : 'Warga Digital'}
                   </span>
                   {editType === 'global' && <ShieldCheck size={14} className="text-blue-500" />}
                </div>
              </div>
              <div className={`p-3 rounded-2xl ${editType === 'global' ? 'bg-blue-500/10 text-blue-500' : 'bg-white/5 text-slate-500'}`}>
                {editType === 'global' ? <Shield size={20} /> : <Fingerprint size={20} />}
              </div>
            </div>

            {/* Profile Avatar Area */}
            <div className="flex flex-col items-center mb-10">
              <div className={`relative w-48 h-48 rounded-[3rem] p-2 glass-card border-white/10 overflow-hidden transition-all duration-700 ${editType === 'global' ? 'glow-blue ring-1 ring-blue-500/30' : ''}`}>
                {isProcessing ? (
                  <div className="w-full h-full bg-slate-900 rounded-[2.5rem] flex items-center justify-center">
                    <Loader2 className="text-blue-500 animate-spin" size={40} />
                  </div>
                ) : editType === 'global' ? (
                  data.adminProfile.image ? (
                    <img src={data.adminProfile.image} alt="Admin" className="w-full h-full object-cover rounded-[2.5rem] group-hover:scale-110 transition-transform duration-1000" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 rounded-[2.5rem] flex items-center justify-center">
                      <ShieldAlert size={64} className="text-slate-600" />
                    </div>
                  )
                ) : (
                  userProfile.image ? (
                    <img src={userProfile.image} alt="Profile" className="w-full h-full object-cover rounded-[2.5rem] group-hover:scale-110 transition-transform duration-1000" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 rounded-[2.5rem] flex items-center justify-center">
                      <User size={64} className="text-slate-600" />
                    </div>
                  )
                )}
                
                {!isProcessing && (
                  <button 
                    onClick={() => editType === 'global' ? adminFileRef.current?.click() : fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
                  >
                    <div className="p-4 bg-white text-black rounded-full mb-2 shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                      <Camera size={24} />
                    </div>
                    <span className="text-[8px] font-black uppercase text-white tracking-widest">Update Data Foto</span>
                  </button>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-1">
                   <h2 className="text-3xl font-black text-white tracking-tighter uppercase truncate">
                     {editType === 'global' ? data.adminProfile.name : userProfile.name}
                   </h2>
                   {editType === 'global' && <ShieldCheck size={20} className="text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />}
                </div>
                <div className={`mono text-[9px] font-bold tracking-[0.3em] uppercase ${editType === 'global' ? 'text-blue-400' : 'text-slate-500'}`}>
                  {editType === 'global' ? data.adminProfile.role : userProfile.major}
                </div>
              </div>

              {editType === 'global' && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-2">
                    <Terminal size={12} className="text-blue-500" />
                    <span className="mono text-[8px] text-slate-500 font-bold uppercase">Dev_Level: MAX</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-2">
                    <Zap size={12} className="text-blue-500" />
                    <span className="mono text-[8px] text-slate-500 font-bold uppercase">Node: X-ELITE</span>
                  </div>
                </div>
              )}

              <div className="p-5 bg-black/40 rounded-3xl border border-white/5 italic text-slate-400 text-[11px] text-center leading-relaxed">
                "{editType === 'global' ? "Sistem dibangun dengan dedikasi untuk X TJKT 2. Solid terus sampe lulus!" : (userProfile.bio || "Belum ada bio nih...")}"
              </div>
            </div>
          </div>
        </div>

        {/* Form Area */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-[3.5rem] p-8 md:p-12 border-white/10 shadow-2xl relative">
            <div className="absolute top-10 right-10 opacity-10 pointer-events-none">
               <Cpu size={120} className="text-blue-500" />
            </div>

            {userRole === 'admin' && (
              <div className="flex mb-12 bg-black/40 p-2 rounded-2xl border border-white/5 max-w-sm">
                <button onClick={() => setEditType('global')} className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl font-black transition-all text-[9px] uppercase tracking-widest ${editType === 'global' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}><ShieldCheck size={14} /> Admin Profil</button>
                <button onClick={() => setEditType('personal')} className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl font-black transition-all text-[9px] uppercase tracking-widest ${editType === 'personal' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}><User size={14} /> Profil Kamu</button>
              </div>
            )}

            <div className="space-y-10 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="mono text-[9px] font-black text-blue-500 uppercase tracking-widest ml-1">Nama Tampilan</label>
                  <input className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-blue-500 outline-none font-bold transition-all" value={editType === 'global' ? data.adminProfile.name : userProfile.name} onChange={(e) => editType === 'global' ? updateData({ adminProfile: { ...data.adminProfile, name: e.target.value } }) : updateProfile({ name: e.target.value })} placeholder="Masukkan Nama..." />
                </div>
                <div className="space-y-3">
                  <label className="mono text-[9px] font-black text-blue-500 uppercase tracking-widest ml-1">Role / Jurusan</label>
                  <input className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-blue-500 outline-none font-bold transition-all" value={editType === 'global' ? data.adminProfile.role : userProfile.major} onChange={(e) => editType === 'global' ? updateData({ adminProfile: { ...data.adminProfile, role: e.target.value } }) : updateProfile({ major: e.target.value })} placeholder="Masukkan Role..." />
                </div>
              </div>

              {editType === 'personal' && (
                <div className="space-y-3">
                  <label className="mono text-[9px] font-black text-blue-500 uppercase tracking-widest ml-1">Bio Singkat</label>
                  <textarea 
                    className="w-full bg-slate-950 border border-white/5 rounded-[2rem] px-6 py-5 text-white focus:border-blue-500 outline-none font-medium h-32 resize-none" 
                    value={userProfile.bio} 
                    onChange={(e) => updateProfile({ bio: e.target.value })}
                    placeholder="Tulis ceritain diri kamu dikit..."
                  />
                </div>
              )}

              <div className="pt-8 border-t border-white/5">
                <button onClick={() => alert("Profil berhasil di-sync ke server!")} className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl font-black uppercase text-[10px] tracking-widest transition-all shadow-2xl shadow-blue-600/30 active:scale-95 flex items-center justify-center gap-3">
                  <Check size={18} /> Sinkronisasi Profil
                </button>
              </div>
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
