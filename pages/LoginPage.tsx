
import React, { useState, useRef, useEffect } from 'react';
import { Lock, ShieldCheck, User as UserIcon, ArrowRight, Cpu, Key } from 'lucide-react';
import { useStore } from '../services/store';

const LoginPage: React.FC = () => {
  const { login, data } = useStore();
  const [tab, setTab] = useState<'user' | 'admin'>('user');
  const [secret, setSecret] = useState('');
  const [isError, setIsError] = useState(false);
  
  // Slider state
  const [sliderValue, setSliderValue] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const SECRET_CODE = "428JWOL811J";

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret === SECRET_CODE) {
      login('admin');
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 1000);
      setSecret('');
    }
  };

  const handleMouseDown = () => (isDragging.current = true);
  const handleMouseUp = () => {
    isDragging.current = false;
    if (sliderValue < 90) {
      setSliderValue(0);
    } else {
      setSliderValue(100);
      setTimeout(() => login('user'), 300);
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
  }, [sliderValue]);

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-3xl bg-blue-600/10 mb-6 border border-blue-500/20">
            <Cpu className="text-blue-500" size={40} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">
            {data.brandName}
          </h1>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.2em]">Sistem Autentikasi Kelas</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-2 shadow-2xl">
          <div className="flex mb-8">
            <button 
              onClick={() => setTab('user')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-3xl font-bold transition-all ${tab === 'user' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <UserIcon size={18} /> User
            </button>
            <button 
              onClick={() => setTab('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-3xl font-bold transition-all ${tab === 'admin' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <ShieldCheck size={18} /> Admin
            </button>
          </div>

          <div className="p-6 pt-0 min-h-[180px] flex flex-col justify-center">
            {tab === 'user' ? (
              <div className="space-y-6">
                <p className="text-center text-slate-400 text-sm">Geser untuk masuk sebagai pengunjung</p>
                <div 
                  ref={sliderRef}
                  className="relative h-20 bg-slate-950/80 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center"
                >
                  <span className="text-slate-700 font-bold uppercase tracking-widest text-xs pointer-events-none select-none">
                    Slide to Unlock
                  </span>
                  <div 
                    className="absolute inset-y-1 left-1 bg-blue-600 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-shadow hover:shadow-lg shadow-blue-600/40 z-10"
                    style={{ width: '72px', transform: `translateX(${sliderValue * 3}px)` }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                  >
                    <ArrowRight className="text-white" size={24} />
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <p className="text-center text-slate-400 text-sm">Masukkan kode rahasia administrator</p>
                <div className={`relative transition-transform ${isError ? 'animate-shake' : ''}`}>
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                  <input 
                    type="password"
                    placeholder="Secret Admin Key"
                    className={`w-full bg-slate-950 border ${isError ? 'border-red-500' : 'border-white/10'} text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-orange-500/50 transition-all font-mono`}
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    autoFocus
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-orange-600/20 uppercase tracking-widest"
                >
                  Verifikasi Akses
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-slate-600 uppercase tracking-[0.3em]">
          X TJKT 2 ELITE Security Layer v2.1
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
