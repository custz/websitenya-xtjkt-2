
import React, { useRef, useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Users, ImageIcon, Calendar, Settings, Download, Upload, 
  RotateCcw, Mail, Check, X, Terminal, User, Monitor
} from 'lucide-react';
import { useStore } from '../services/store';

const Navbar: React.FC = () => {
  const { data, updateData, importData, resetToDefault, isEditMode, setEditMode, userRole, userProfile } = useStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Warga Kelas', path: '/siswa', icon: <Users size={20} /> },
    { name: 'Mading Visual', path: '/gallery', icon: <ImageIcon size={20} /> },
    { name: 'Jadwal Pelajaran', path: '/jadwal', icon: <Calendar size={20} /> },
    { name: 'Profil Saya', path: '/profile', icon: <User size={20} /> },
  ];

  const isAdmin = userRole === 'admin';

  const handleSave = () => {
    setShowSavedMsg(true);
    setTimeout(() => {
      setShowSavedMsg(false);
      setEditMode(false);
    }, 800);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${data.brandName.replace(/\s+/g, '_')}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (importData(content)) {
          alert("Data berhasil diimpor!");
          window.location.reload();
        } else {
          alert("Gagal mengimpor data. Format file tidak valid.");
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Save Notification */}
      {showSavedMsg && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[300] glass-card border-emerald-500/30 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <span className="font-black text-[10px] uppercase tracking-widest text-emerald-500 flex items-center gap-2">
            <Check size={14} /> Synchronized
          </span>
        </div>
      )}

      {/* Top Bar Branding */}
      <div className="fixed top-0 left-0 right-0 z-[150] p-6 md:p-8 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="group relative w-12 h-12 md:w-16 md:h-16 glass-card rounded-full flex items-center justify-center border-white/5 hover:border-white/20 transition-all duration-500 glow-blue overflow-hidden active:scale-95"
          >
            <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {userProfile.image ? (
               <img src={userProfile.image} className="w-8 h-8 md:w-12 md:h-12 object-cover rounded-full relative z-10" alt="Avatar" />
            ) : (
               <div className="relative z-10 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform">
                  <Monitor size={28} strokeWidth={2.5} />
               </div>
            )}
            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border border-slate-950 animate-pulse"></div>
          </button>

          <div className="flex flex-col">
             <span className="text-sm md:text-lg font-black tracking-tighter text-white uppercase leading-none">
               {data.brandName}
             </span>
             <span className="mono text-[7px] md:text-[8px] text-blue-500 font-bold uppercase tracking-[0.3em] mt-1">
               {data.navbarSubtitle}
             </span>
          </div>
        </div>

        <div className="flex gap-3 pointer-events-auto">
          {isAdmin && (
            <div className="glass-card p-1 rounded-2xl flex items-center border-white/10 shadow-2xl">
              {isEditMode ? (
                <button 
                  onClick={handleSave} 
                  className="px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2"
                >
                  <Check size={14} /> Update
                </button>
              ) : (
                <button 
                  onClick={() => setEditMode(true)} 
                  className="p-3 text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Settings size={18} />
                  <span className="text-[9px] font-black uppercase tracking-widest hidden lg:block">Config</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR COMPONENT */}
      <aside 
        className={`fixed top-0 left-0 h-full w-full max-w-[320px] z-[250] glass-card border-r border-white/10 transition-transform duration-500 ease-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center border border-white/10 glow-blue bg-blue-600/5">
              <Monitor size={32} className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" strokeWidth={2.5} />
            </div>
            <span className="font-black text-2xl uppercase tracking-tighter text-white">XTJKT2</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-slate-500 hover:text-white transition-colors hover:bg-white/5 rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-8">
          <div className="space-y-2">
            <p className="px-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Navigasi Portofolio</p>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-[1.02]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {item.icon}
                <span className="text-sm font-bold tracking-tight">
                  {item.name}
                </span>
              </NavLink>
            ))}
          </div>

          {isAdmin && (
            <div className="space-y-4 pt-4 border-t border-white/5">
              <p className="px-4 text-[9px] font-black text-blue-500/60 uppercase tracking-[0.3em] mb-4">Admin Protocols</p>
              
              <div className="grid grid-cols-1 gap-1">
                <button 
                  onClick={handleExport}
                  className="flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                >
                  <Download size={18} className="text-emerald-500" />
                  <span className="text-sm font-bold">Backup JSON</span>
                </button>
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                >
                  <Upload size={18} className="text-blue-500" />
                  <span className="text-sm font-bold">Restore Data</span>
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />

                <button 
                  onClick={resetToDefault}
                  className="flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all"
                >
                  <RotateCcw size={18} className="text-red-500" />
                  <span className="text-sm font-bold">Factory Reset</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: MAIL BOX */}
        <div className="p-8 border-t border-white/5 space-y-4">
          <NavLink 
            to="/mailbox"
            className={({ isActive }) => `w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 shadow-xl ${
              isActive 
                ? 'bg-blue-600 text-white shadow-blue-600/20' 
                : 'bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white shadow-blue-600/5'
            }`}
          >
            <div className="relative">
              <Mail size={16} />
            </div>
            Mail Box / Inbox
          </NavLink>
          <p className="text-center text-[8px] text-slate-600 font-bold uppercase tracking-[0.4em]">ZENT TECH SECURE SESSION v2.5</p>
        </div>
      </aside>

      {/* Floating Bottom Nav (Mobile) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-fit px-4 md:hidden">
        <nav className="glass-card border-white/10 rounded-3xl p-2 flex items-center gap-1 shadow-2xl glow-blue backdrop-blur-2xl">
          {navItems.slice(0, 4).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `relative flex items-center justify-center p-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-500'
                }`
              }
            >
              {item.icon}
            </NavLink>
          ))}
          <NavLink
            to="/mailbox"
            className={({ isActive }) => 
              `relative flex items-center justify-center p-4 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-500'
              }`
            }
          >
            <Mail size={20} />
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
