
import React, { useRef, useState } from 'react';
import { User, Camera, Briefcase, GraduationCap, Calendar, Info, Shield, Check, Settings, Fingerprint, Sparkles, Venus, Mars, ShieldAlert, Globe } from 'lucide-react';
import { useStore } from '../services/store';

const ProfilePage: React.FC = () => {
  const { userProfile, updateProfile, userRole, data, updateData } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const adminFileRef = useRef<HTMLInputElement>(null);
  
  // State to toggle between personal and admin global profile editing
  const [editType, setEditType] = useState<'personal' | 'global'>(userRole === 'admin' ? 'global' : 'personal');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'personal' | 'admin') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran foto maksimal 2MB!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (target === 'personal') {
          updateProfile({ image: base64 });
        } else {
          updateData({ adminProfile: { ...data.adminProfile, image: base64 } });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getGenderIcon = () => {
    return userProfile.gender === 'Perempuan' ? <Venus className="text-pink-500" size={12} /> : <Mars className="text-blue-500" size={12} />;
  };

  return (
    <div className="min-h-screen pt-32 pb-40 px-4 md:px-8 bg-[#05050a] relative overflow-hidden">
      {/* Aesthetic Background Orbs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        {/* Profile Card Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm glass-card rounded-[3rem] p-8 border-white/10 shadow-2xl relative overflow-hidden animate-aesthetic-float group">
            
            {/* ID Card Top */}
            <div className="flex justify-between items-start mb-10">
              <div className="flex flex-col">
                <span className="mono text-[8px] font-black text-blue-500 tracking-[0.5em] uppercase">
                  {editType === 'global' ? 'Global System Identity' : 'Local User Protocol'}
                </span>
                <span className="text-xs font-bold text-white tracking-widest uppercase">
                  {editType === 'global' ? 'Network Admin' : 'Digital Identity'}
                </span>
              </div>
              {editType === 'global' ? <Shield size={24} className="text-blue-500" /> : <Fingerprint className="text-blue-500" size={24} />}
            </div>

            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-10">
              <div className="relative w-48 h-48 rounded-[2.5rem] p-2 glass-card border-blue-500/30 glow-blue overflow-hidden group-hover:scale-105 transition-transform duration-700">
                {editType === 'global' ? (
                  data.adminProfile.image ? (
                    <img src={data.adminProfile.image} alt="Admin" className="w-full h-full object-cover rounded-[2rem]" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 rounded-[2rem] flex items-center justify-center">
                      <ShieldAlert size={64} className="text-slate-600" />
                    </div>
                  )
                ) : (
                  userProfile.image ? (
                    <img src={userProfile.image} alt="Profile" className="w-full h-full object-cover rounded-[2rem] grayscale group-hover:grayscale-0 transition-all duration-700" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 rounded-[2rem] flex items-center justify-center">
                      <User size={64} className="text-slate-600" />
                    </div>
                  )
                )}
                
                <button 
                  onClick={() => editType === 'global' ? adminFileRef.current?.click() : fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                >
                  <Camera size={32} className="text-white mb-2" />
                  <span className="text-[8px] font-black uppercase text-white tracking-widest">Update Photo</span>
                </button>
              </div>
            </div>

            {/* Profile Info Display */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-1 truncate">
                  {editType === 'global' ? data.adminProfile.name : userProfile.name}
                </h2>
                <div className="flex items-center justify-center gap-2">
                   <div className="mono text-[9px] text-blue-400 font-bold tracking-[0.3em] uppercase">
                     {editType === 'global' ? data.adminProfile.role : userProfile.major}
                   </div>
                   {editType === 'personal' && (
                     <>
                      <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                      <div className="mono text-[9px] text-slate-500 font-bold uppercase">{userProfile.gender}</div>
                     </>
                   )}
                </div>
              </div>

              {editType === 'personal' && (
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                  <div>
                    <div className="mono text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Affiliation</div>
                    <div className="text-xs font-bold text-white uppercase truncate">{userProfile.className}</div>
                  </div>
                  <div>
                    <div className="mono text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Age / Status</div>
                    <div className="text-xs font-bold text-white uppercase flex items-center gap-2">
                      {userProfile.age} Years {getGenderIcon()}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 italic text-slate-400 text-[11px] text-center leading-relaxed">
                {editType === 'global' 
                  ? "Identitas ini digunakan sebagai pengirim pesan resmi di sistem Mailbox." 
                  : `"${userProfile.bio || "No bio set yet..."}"`}
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl"></div>
          </div>
          
          <p className="mt-8 text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] text-center">
             Verified: {editType === 'global' ? 'TRUE' : 'PENDING'}
          </p>
        </div>

        {/* Edit Form Section */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-[3.5rem] p-10 md:p-14 border-white/5 shadow-2xl">
            
            {/* Toggle Switch for Admin */}
            {userRole === 'admin' && (
              <div className="flex mb-10 bg-black/40 p-2 rounded-2xl border border-white/5">
                <button 
                  onClick={() => setEditType('global')}
                  className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl font-black transition-all text-[9px] uppercase tracking-widest ${editType === 'global' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500'}`}
                >
                  <Globe size={14} /> Global Identity (Admin)
                </button>
                <button 
                  onClick={() => setEditType('personal')}
                  className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl font-black transition-all text-[9px] uppercase tracking-widest ${editType === 'personal' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500'}`}
                >
                  <User size={14} /> My Personal Profile
                </button>
              </div>
            )}

            <div className="flex items-center gap-4 mb-12">
              <div className={`p-4 rounded-2xl ${editType === 'global' ? 'bg-orange-600/20' : 'bg-blue-600/20'}`}>
                {editType === 'global' ? <Shield size={28} className="text-orange-500" /> : <Settings size={28} className="text-blue-500" />}
              </div>
              <div className="flex flex-col">
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                  {editType === 'global' ? 'Admin Profile' : 'Profil Saya'}
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                  {editType === 'global' ? 'Identitas ini akan terlihat oleh semua user di Mailbox.' : 'Update identitas digital kamu kapan saja.'}
                </p>
              </div>
            </div>

            {editType === 'global' ? (
              /* GLOBAL ADMIN FORM */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 mono text-[9px] font-black text-blue-500 uppercase tracking-widest">
                    Admin Name
                  </label>
                  <input 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold uppercase"
                    value={data.adminProfile.name}
                    onChange={(e) => updateData({ adminProfile: { ...data.adminProfile, name: e.target.value } })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 mono text-[9px] font-black text-blue-500 uppercase tracking-widest">
                    Public Role
                  </label>
                  <input 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold uppercase"
                    value={data.adminProfile.role}
                    onChange={(e) => updateData({ adminProfile: { ...data.adminProfile, role: e.target.value } })}
                  />
                </div>
                <div className="md:col-span-2 p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl">
                   <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-relaxed">
                     <ShieldAlert size={14} className="inline mr-2" />
                     Penting: Informasi di atas adalah identitas publik admin. Saat Anda membuat pesan baru di Mailbox, Nama dan Foto di atas akan otomatis dilampirkan agar user lain mengenali Anda sebagai admin resmi.
                   </p>
                </div>
              </div>
            ) : (
              /* PERSONAL USER FORM */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 mono text-[9px] font-black text-blue-500 uppercase tracking-widest">
                    <User size={12} /> Nama Lengkap
                  </label>
                  <input 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-700"
                    value={userProfile.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 mono text-[9px] font-black text-blue-500 uppercase tracking-widest">
                    <Calendar size={12} /> Umur
                  </label>
                  <input 
                    type="number"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                    value={userProfile.age}
                    onChange={(e) => updateProfile({ age: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 mono text-[9px] font-black text-blue-500 uppercase tracking-widest">
                    <GraduationCap size={12} /> Kelas / Instansi
                  </label>
                  <input 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                    value={userProfile.className}
                    onChange={(e) => updateProfile({ className: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 mono text-[9px] font-black text-blue-500 uppercase tracking-widest">
                    <Briefcase size={12} /> Jurusan
                  </label>
                  <input 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                    value={userProfile.major}
                    onChange={(e) => updateProfile({ major: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="flex items-center gap-2 mono text-[9px] font-black text-blue-500 uppercase tracking-widest">
                    <Info size={12} /> Bio Singkat
                  </label>
                  <textarea 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-3xl px-6 py-5 text-white focus:outline-none focus:border-blue-500 transition-all font-medium h-32 resize-none italic"
                    value={userProfile.bio}
                    onChange={(e) => updateProfile({ bio: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="mt-12">
              <button 
                onClick={() => alert("Profil Telah Diperbarui!")}
                className="w-full flex items-center justify-center gap-3 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl font-black uppercase text-[10px] tracking-widest transition-all shadow-2xl shadow-blue-600/20 active:scale-95"
              >
                <Check size={18} /> Simpan Perubahan
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
