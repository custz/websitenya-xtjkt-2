
import React, { useState, useRef, useEffect } from 'react';
import { Lock, ShieldCheck, User as UserIcon, ArrowRight, Cpu, Key, GraduationCap, Briefcase, Terminal, CheckCircle2, Calendar, Venus, Mars, Monitor, Loader2, Zap } from 'lucide-react';
import { useStore } from '../services/store';

const LoginPage: React.FC = () => {
  const { login, data, updateData, updateProfile } = useStore();
  const [tab, setTab] = useState<'user' | 'admin'>('user');
  const [secret, setSecret] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(0);
  
  // User Input States
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userClass, setUserClass] = useState('');
  const [userMajor, setUserMajor] = useState('');
  const [userGender, setUserGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');

  // Slider state
  const [sliderValue, setSliderValue] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const SECRET_CODE = "LHO8229088ZXYT";

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret === SECRET_CODE) {
      setIsSuccess(true);
      setTimeout(() => login('admin'), 1800);
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 1000);
      setSecret('');
    }
  };

  const validateInputs = () => {
    return userName.trim() !== '' && userAge.trim() !== '' && userClass.trim() !== '' && userMajor.trim() !== '';
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (tab === 'user' && !validateInputs()) {
      alert("⚠️ Isi dulu dong identitas kamu (Nama, Umur, dll) baru bisa geser!");
      return;
    }
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    if (sliderValue < 92) {
      setSliderValue(0);
    } else {
      setSliderValue(100);
      setIsSuccess(true);
      
      // Notify Admin
      const newNotif = {
        id: Date.now().toString(),
        userName: userName,
        timestamp: new Date().toLocaleTimeString(),
        isRead: false
      };
      updateData({ loginNotifications: [newNotif, ...(data.loginNotifications || [])] });

      updateProfile({
        name: userName,
        age: userAge,
        className: userClass,
        major: userMajor,
        gender: userGender,
        bio: `Halo, gue ${userName}. Salam kenal ya semua!`
      });
      
      // Start Welcome Sequence
      setTimeout(() => setWelcomeStep(1), 800);
      setTimeout(() => setWelcomeStep(2), 2500);
      setTimeout(() => setWelcomeStep(3), 4500);
      setTimeout(() => login('user'), 6000);
    }
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.current || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    
    setSliderValue(percent);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [sliderValue, userName, userAge, userClass, userMajor]);

  return (
    <div className="fixed inset-0 z-[200] bg-[#020205] flex items-center justify-center p-6 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 -left-10 w-[600px] h-[600px] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 -right-10 w-[600px] h-[600px] bg-purple-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse delay-1000"></div>

      {/* SUCCESS & WELCOME OVERLAY */}
      {isSuccess && (
        <div className="absolute inset-0 z-[300] bg-slate-950/98 backdrop-blur-2xl flex flex-col items-center justify-center animate-in fade-in duration-500">
          {tab === 'admin' ? (
            <div className="text-center animate-in zoom-in-95 duration-700">
               <div className="relative mb-8 scale-110 flex justify-center">
                  <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-30 animate-pulse"></div>
                  <div className="relative p-8 bg-orange-600 rounded-full shadow-[0_0_50px_rgba(249,115,22,0.5)] border-4 border-white/20">
                    <ShieldCheck size={80} className="text-white" strokeWidth={2.5} />
                  </div>
               </div>
               <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-2 italic">Akses Admin</h2>
               <p className="mono text-[10px] text-orange-400 font-bold uppercase tracking-[0.5em]">Mengotorisasi Protokol Root...</p>
            </div>
          ) : (
            <div className="w-full max-w-2xl px-10">
               {welcomeStep === 0 && (
                  <div className="text-center animate-in zoom-in-95">
                    <div className="relative mb-8 flex justify-center">
                       <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-30 animate-pulse"></div>
                       <div className="relative p-8 bg-blue-600 rounded-full shadow-[0_0_50px_rgba(59,130,246,0.5)] border-4 border-white/20">
                         <CheckCircle2 size={80} className="text-white" strokeWidth={2.5} />
                       </div>
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Koneksi Berhasil</h2>
                  </div>
               )}

               {welcomeStep >= 1 && (
                  <div className="space-y-4 font-mono text-[11px] md:text-sm text-emerald-500 bg-black/40 p-8 rounded-[2.5rem] border border-emerald-500/20 shadow-2xl animate-in slide-in-from-bottom-10">
                     <div className="flex gap-2">
                        <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                        <span className="animate-in fade-in fill-mode-forwards">SISTEM: Mencari Identitas Digital...</span>
                     </div>
                     {welcomeStep >= 2 && (
                        <div className="flex gap-2 animate-in fade-in">
                          <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                          <span className="text-blue-400 font-bold italic uppercase">TARGET_TERDETEKSI: {userName.toUpperCase()} ({userClass})</span>
                        </div>
                     )}
                     {welcomeStep >= 3 && (
                        <div className="flex flex-col gap-4 mt-6 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 animate-in zoom-in-95">
                           <div className="flex items-center gap-3">
                              <Zap size={20} className="text-emerald-500 animate-pulse" />
                              <span className="text-lg font-black text-white tracking-tighter uppercase italic">Welcome to the Hub, Brader!</span>
                           </div>
                           <p className="text-slate-400 font-medium italic leading-relaxed">
                             "Halo {userName}! Akun kamu udah aktif di jaringan X TJKT 2 Elite. Selamat bergabung di barisan para engineer masa depan!"
                           </p>
                           <div className="flex items-center gap-2">
                              <Loader2 size={12} className="animate-spin" />
                              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500/60">Membuka Dashboard...</span>
                           </div>
                        </div>
                     )}
                  </div>
               )}
            </div>
          )}
        </div>
      )}

      <div className="w-full max-w-xl relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex p-1 rounded-full bg-blue-600/5 mb-6 border border-white/10 glow-blue overflow-hidden w-32 h-32 md:w-40 md:h-40 transition-all hover:border-blue-500/30 flex items-center justify-center">
             <div className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">
                <Monitor size={64} strokeWidth={2.5} className="md:size-20" />
             </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2 uppercase italic">
            Welcome to <span className="text-blue-500">X TJKT 2</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Silahkan Login Dulu Yaa Kidss</p>
        </div>

        <div className="glass-card border-white/10 rounded-[3.5rem] p-4 shadow-2xl backdrop-blur-3xl overflow-hidden">
          {/* TAB SELECTOR */}
          <div className="flex mb-8 bg-black/40 p-2 rounded-[2.5rem] border border-white/5">
            <button 
              onClick={() => setTab('user')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[2rem] font-black transition-all text-[10px] uppercase tracking-widest ${tab === 'user' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <UserIcon size={16} /> Akses Warga
            </button>
            <button 
              onClick={() => setTab('admin')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[2rem] font-black transition-all text-[10px] uppercase tracking-widest ${tab === 'admin' ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/30' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <ShieldCheck size={16} /> Admin Only
            </button>
          </div>

          <div className="px-6 pb-8 min-h-[460px] flex flex-col">
            {tab === 'user' ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6">
                {/* IDENTITY FIELDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors">
                      <Terminal size={18} />
                    </div>
                    <input 
                      className="w-full bg-slate-950/80 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold text-sm placeholder:text-slate-700"
                      placeholder="NAMA LENGKAP KAMU"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors">
                      <Calendar size={18} />
                    </div>
                    <input 
                      type="number"
                      className="w-full bg-slate-950/80 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold text-sm placeholder:text-slate-700"
                      placeholder="UMUR"
                      value={userAge}
                      onChange={(e) => setUserAge(e.target.value)}
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors">
                      <GraduationCap size={18} />
                    </div>
                    <input 
                      className="w-full bg-slate-950/80 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold text-sm placeholder:text-slate-700"
                      placeholder="KELAS BERAPA?"
                      value={userClass}
                      onChange={(e) => setUserClass(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors">
                      <Briefcase size={18} />
                    </div>
                    <input 
                      className="w-full bg-slate-950/80 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold text-sm placeholder:text-slate-700"
                      placeholder="JURUSAN (MISAL: TJKT)"
                      value={userMajor}
                      onChange={(e) => setUserMajor(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="mono text-[9px] text-blue-500 font-black uppercase tracking-[0.4em] ml-1">Gender</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setUserGender('Laki-laki')}
                      className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all font-black text-[10px] uppercase tracking-widest ${
                        userGender === 'Laki-laki' 
                          ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/10' 
                          : 'bg-white/5 border-white/5 text-slate-600 hover:text-slate-400'
                      }`}
                    >
                      <Mars size={16} /> Laki-laki
                    </button>
                    <button
                      onClick={() => setUserGender('Perempuan')}
                      className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all font-black text-[10px] uppercase tracking-widest ${
                        userGender === 'Perempuan' 
                          ? 'bg-pink-600/20 border-pink-500 text-pink-400 shadow-lg shadow-pink-500/10' 
                          : 'bg-white/5 border-white/5 text-slate-600 hover:text-slate-400'
                      }`}
                    >
                      <Venus size={16} /> Perempuan
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-6 italic">Gass Geser Buat Masuk!</p>
                  <div 
                    ref={sliderRef}
                    className="relative h-20 bg-slate-950 rounded-[1.8rem] border border-white/5 overflow-hidden flex items-center justify-center"
                  >
                    <div 
                      className="absolute inset-0 bg-blue-600/10 transition-opacity" 
                      style={{ opacity: sliderValue / 100 }}
                    ></div>
                    <span className="text-slate-700 font-black uppercase tracking-[0.4em] text-[10px] select-none">
                      Geser Pelan-pelan Kidss
                    </span>
                    <div 
                      className="absolute inset-y-2 left-2 bg-blue-600 rounded-[1.4rem] flex items-center justify-center cursor-grab active:cursor-grabbing transition-shadow shadow-2xl shadow-blue-600/50 z-10 hover:bg-blue-500"
                      style={{ 
                        width: '80px', 
                        transform: `translateX(${sliderValue * ((sliderRef.current?.offsetWidth || 400) - 96) / 100}px)` 
                      }}
                      onMouseDown={handleMouseDown}
                      onTouchStart={handleMouseDown}
                    >
                      <ArrowRight className="text-white" size={26} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-6 animate-in fade-in slide-in-from-bottom-6 pt-10">
                <div className="text-center mb-8">
                   <p className="text-orange-500/80 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Area Terbatas</p>
                   <h3 className="text-white text-sm font-medium italic opacity-60">Masukkan kode akses rahasia admin.</h3>
                </div>
                <div className={`relative transition-transform ${isError ? 'animate-shake' : ''}`}>
                  <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={24} />
                  <input 
                    type="password"
                    placeholder="PASSWORD_RAHASIA"
                    className={`w-full bg-slate-950 border ${isError ? 'border-red-500' : 'border-white/10'} text-white rounded-3xl pl-14 pr-4 py-6 focus:outline-none focus:border-orange-500/50 transition-all font-mono text-xl text-center tracking-widest`}
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    autoFocus
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-6 bg-orange-600 hover:bg-orange-500 text-white rounded-3xl font-black transition-all shadow-2xl shadow-orange-600/30 uppercase tracking-[0.5em] text-xs"
                >
                  Konfirmasi Admin
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-[9px] text-slate-700 font-black uppercase tracking-[0.6em] animate-pulse">
          X TJKT 2 ELITE // PORTAL RESMI v2.5
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
