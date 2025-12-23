
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, Users, ImageIcon, Calendar, Settings, 
  Mail, X, Monitor, Cpu, Radio, Zap, Cloud, Network,
  Megaphone, ShieldCheck, Bell, Clock, UserCheck, Activity, Construction, AlertTriangle, Database,
  Instagram, Heart, Brain, LogOut
} from 'lucide-react';
import { useStore } from '../services/store';

const Navbar: React.FC = () => {
  const { data, updateData, userRole, setEditMode, isEditMode, logout } = useStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  
  const unreadCount = data.loginNotifications?.filter(n => !n.isRead).length || 0;

  const markAllAsRead = () => {
    const updated = data.loginNotifications.map(n => ({ ...n, isRead: true }));
    updateData({ loginNotifications: updated });
  };

  const clearNotifs = () => {
    updateData({ loginNotifications: [] });
    setNotifOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm("Putuskan koneksi Admin dan masuk mode penyamaran?")) {
      logout();
    }
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Warga', path: '/siswa', icon: <Users size={18} /> },
    { name: 'Kuis', path: '/quiz', icon: <Brain size={18} /> },
    { name: 'Menfess', path: '/menfess', icon: <Heart size={18} /> },
    { name: 'Pusat Data', path: '/noc', icon: <Database size={18} /> },
    { name: 'Momen', path: '/gallery', icon: <ImageIcon size={18} /> },
    { name: 'Jadwal', path: '/jadwal', icon: <Calendar size={18} /> },
    { name: 'Cerita', path: '/mailbox', icon: <Zap size={18} /> },
    { name: 'Kelompok', path: '/groups', icon: <Network size={18} /> },
  ];

  const devCredit = " • DIBIKIN SAMA: ZENT, ZYLD, NOIR • ";

  const getStatusConfig = () => {
    switch(data.systemStatus) {
      case 'Maintenance':
        return { 
          color: 'text-orange-500', 
          bg: 'bg-orange-500', 
          label: 'LAGI CAPE', 
          icon: <Construction size={14} className="animate-spin-slow" />,
          broadcast: 'bg-orange-600/90'
        };
      case 'Overload':
        return { 
          color: 'text-red-500', 
          bg: 'bg-red-500', 
          label: 'LAGI RAME', 
          icon: <AlertTriangle size={14} className="animate-bounce" />,
          broadcast: 'bg-red-700/90'
        };
      default:
        return { 
          color: 'text-emerald-500', 
          bg: 'bg-emerald-500', 
          label: 'AMAN JAYA', 
          icon: <Activity size={14} />,
          broadcast: 'bg-blue-600/90'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <>
      {/* GLOBAL BROADCAST (TOA KELAS) */}
      <div className={`fixed top-0 left-0 right-0 z-[150] ${statusConfig.broadcast} backdrop-blur-md border-b border-white/10 h-8 flex items-center overflow-hidden transition-colors duration-500`}>
        <div className="flex items-center gap-2 bg-black px-4 h-full border-r border-white/10 relative z-10">
           <Megaphone size={12} className={`${data.systemStatus === 'Normal' ? 'text-blue-500' : 'text-white'} animate-pulse`} />
           <span className="mono text-[8px] font-black text-white uppercase tracking-widest whitespace-nowrap">Speaker_Kelas</span>
        </div>
        <div className="flex-1 relative overflow-hidden h-full flex items-center">
          {isEditMode && userRole === 'admin' ? (
            <input 
              className="absolute inset-0 bg-transparent px-4 text-white text-[10px] font-bold outline-none placeholder:text-white/30"
              placeholder="Tulis pengumuman di sini..."
              value={data.globalAnnouncement}
              onChange={(e) => updateData({ globalAnnouncement: e.target.value })}
            />
          ) : (
            <div className="whitespace-nowrap animate-marquee flex items-center gap-10">
               <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                 {data.systemStatus !== 'Normal' ? `[INFO SISTEM: ${statusConfig.label}] ` : ''} 
                 {data.globalAnnouncement || "SISTEM ONLINE - SELAMAT DATANG DI MARKAS X TJKT 2 ELITE - TETAP SOLID DAN KOMPAK!"} {devCredit}
               </span>
               <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
                 {data.systemStatus !== 'Normal' ? `[INFO SISTEM: ${statusConfig.label}] ` : ''} 
                 {data.globalAnnouncement || "SISTEM ONLINE - SELAMAT DATANG DI MARKAS X TJKT 2 ELITE - TETAP SOLID DAN KOMPAK!"} {devCredit}
               </span>
            </div>
          )}
        </div>
      </div>

      {/* HUD HEADER */}
      <header className="fixed top-8 left-0 right-0 z-[100] p-4 md:p-6 flex justify-between items-center bg-gradient-to-b from-[#020205] to-transparent">
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-4 group cursor-pointer" 
            onClick={() => setSidebarOpen(true)}
          >
            <div className={`w-12 h-12 glass-card rounded-xl flex items-center justify-center border-blue-500/20 pulse-blue ${data.systemStatus === 'Overload' ? 'status-busy-glitch' : ''}`}>
              <Monitor size={20} className={statusConfig.color} />
            </div>
            <div className="hidden sm:block">
              <h1 className="tech-font text-lg font-bold tracking-tighter text-white uppercase leading-none">
                {data.brandName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.bg} ${data.systemStatus !== 'Normal' ? 'animate-ping' : ''}`}></span>
                <div className={`flex items-center gap-1.5 mono text-[7px] ${statusConfig.color} font-bold uppercase tracking-[0.3em]`}>
                  {statusConfig.icon}
                  <span>STATUS: {statusConfig.label}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* INSTAGRAM LINK */}
          <a 
            href="https://www.instagram.com/teknisinya.tjktdua?igsh=bDF5MWV5djkxejc=" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 glass-card rounded-xl flex items-center justify-center border-pink-500/20 text-slate-500 hover:text-pink-500 hover:border-pink-500/50 transition-all hover:scale-110"
            title="Mampir ke IG Kelas"
          >
            <Instagram size={18} />
          </a>
        </div>

        <nav className="hidden md:flex glass-card p-1.5 rounded-2xl border-white/10 gap-1 overflow-x-auto max-w-[60vw] scrollbar-hide">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                  isActive 
                    ? (item.path === '/menfess' ? 'bg-pink-600' : (item.path === '/quiz' ? 'bg-blue-600' : (data.systemStatus === 'Maintenance' ? 'bg-orange-600' : data.systemStatus === 'Overload' ? 'bg-red-600' : 'bg-blue-600'))) + ' text-white shadow-lg' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.icon} {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {userRole === 'admin' && (
            <>
              <div className="relative">
                <button 
                  onClick={() => { setNotifOpen(!isNotifOpen); markAllAsRead(); }}
                  className={`p-3 rounded-xl glass-card transition-all ${unreadCount > 0 ? statusConfig.color + ' border-current' : 'text-slate-400'}`}
                >
                  <Bell size={18} className={unreadCount > 0 ? 'animate-bounce' : ''} />
                  {unreadCount > 0 && (
                    <span className={`absolute -top-1 -right-1 w-4 h-4 ${statusConfig.bg} text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-[#020205]`}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute top-14 right-0 w-72 glass-card rounded-2xl border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-top-2">
                    <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                      <span className="mono text-[9px] font-black text-white uppercase tracking-widest">Riwayat_Masuk</span>
                      <button onClick={clearNotifs} className="text-[8px] font-bold text-slate-500 hover:text-red-500 uppercase">Hapus</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-2 space-y-2 scrollbar-hide">
                      {data.loginNotifications?.length === 0 ? (
                        <div className="p-8 text-center text-slate-700 italic text-[9px] uppercase">Belum ada warga mampir</div>
                      ) : (
                        data.loginNotifications.map((n) => (
                          <div key={n.id} className="p-3 bg-black/40 rounded-xl border border-white/5 flex gap-3 items-center">
                            <div className={`w-8 h-8 rounded-lg ${statusConfig.bg}/10 flex items-center justify-center ${statusConfig.color} shrink-0 border ${statusConfig.color}/20`}>
                              <UserCheck size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="text-[10px] font-bold text-white uppercase truncate">{n.userName}</p>
                               <div className="flex items-center gap-1.5 opacity-40">
                                 <span className="mono text-[7px] font-bold text-slate-400">{n.timestamp}</span>
                               </div>
                            </div>
                            <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.bg} animate-pulse`}></div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
                <button 
                  onClick={() => setEditMode(!isEditMode)}
                  className={`p-2 rounded-lg transition-all ${isEditMode ? statusConfig.bg + ' text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Ganti Mode Edit"
                >
                  <Settings size={16} />
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  title="Logout / Stealth Mode"
                >
                  <LogOut size={16} />
                </button>
                <select 
                  className={`bg-transparent text-[8px] font-black ${statusConfig.color} outline-none uppercase px-2`}
                  value={data.systemStatus}
                  onChange={(e) => updateData({ systemStatus: e.target.value as any })}
                >
                  <option value="Normal">Aman</option>
                  <option value="Maintenance">Cape</option>
                  <option value="Overload">Rame</option>
                </select>
              </div>
            </>
          )}
          <button className="md:hidden w-12 h-12 glass-card rounded-xl flex items-center justify-center text-white" onClick={() => setSidebarOpen(true)}>
            <Radio size={20} className={statusConfig.color} />
          </button>
        </div>
      </header>

      {/* MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl animate-in fade-in flex items-center justify-center p-6">
          <button onClick={() => setSidebarOpen(false)} className="absolute top-10 right-10 text-white p-4">
            <X size={32} />
          </button>
          <div className="space-y-6 w-full max-w-xs text-center">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({isActive}) => `block text-3xl font-black transition-colors uppercase italic tracking-tighter ${isActive ? (item.path === '/menfess' ? 'text-pink-500' : statusConfig.color) : 'text-slate-500 hover:text-white'}`}
              >
                {item.name}
              </NavLink>
            ))}
            {userRole === 'admin' && (
               <div className="pt-10 flex flex-col items-center gap-4">
                  <div className={`w-10 h-[1px] ${statusConfig.bg}/30`}></div>
                  <span className={`mono text-[10px] ${statusConfig.color} font-black uppercase tracking-widest`}>Area Admin</span>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => { setEditMode(!isEditMode); setSidebarOpen(false); }}
                      className={`px-8 py-3 ${statusConfig.bg} text-white rounded-full font-black text-[10px] uppercase`}
                    >
                      {isEditMode ? 'Off Mode Edit' : 'On Mode Edit'}
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="px-8 py-3 bg-red-600/20 text-red-500 border border-red-500/30 rounded-full font-black text-[10px] uppercase flex items-center justify-center gap-2"
                    >
                      <LogOut size={14} /> Stealth Mode (Logout)
                    </button>
                  </div>
               </div>
            )}
            <div className="mt-20">
               <span className="mono text-[10px] text-slate-700 font-black uppercase tracking-[0.4em]">DIBIKIN: ZENT • ZYLD • NOIR</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
