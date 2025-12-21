
import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, ImageIcon, Calendar, Cpu, Settings, Eye, EyeOff, Download, Upload, RotateCcw, LogOut, Check, Save, Zap } from 'lucide-react';
import { useStore } from '../services/store';

const Navbar: React.FC = () => {
  const { data, updateData, importData, resetToDefault, isEditMode, setEditMode, showNav, setShowNav, userRole, logout } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Nodes', path: '/siswa', icon: <Users size={18} /> },
    { name: 'Archive', path: '/gallery', icon: <ImageIcon size={18} /> },
    { name: 'Sync', path: '/jadwal', icon: <Calendar size={18} /> },
  ];

  const isAdmin = userRole === 'admin';

  const handleSave = () => {
    setShowSavedMsg(true);
    setTimeout(() => {
      setShowSavedMsg(false);
      setEditMode(false);
    }, 800);
  };

  return (
    <>
      {showSavedMsg && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[200] glass-card border-emerald-500/30 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <Check size={16} className="text-emerald-500" strokeWidth={3} />
          <span className="font-black text-[10px] uppercase tracking-widest">System Updated</span>
        </div>
      )}

      {/* Aesthetic Top Branding */}
      <div className="fixed top-0 left-0 right-0 z-50 p-8 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto group">
          <div className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center border-white/10 group-hover:rotate-12 transition-all duration-500 glow-blue">
            <Zap className="text-blue-500 fill-blue-500" size={20} />
          </div>
          <div className="flex flex-col">
             <span className="text-lg font-black tracking-tighter text-white uppercase leading-none">
              {data.brandName}
            </span>
            <span className="mono text-[8px] text-blue-500 font-bold uppercase tracking-[0.3em] mt-1">Status: Encrypted</span>
          </div>
        </div>

        <div className="flex gap-3 pointer-events-auto">
          {isAdmin && (
            <div className="glass-card p-1 rounded-2xl flex items-center border-white/10">
              {isEditMode ? (
                <button onClick={handleSave} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all">
                  Save
                </button>
              ) : (
                <button onClick={() => setEditMode(true)} className="p-3 text-slate-400 hover:text-white transition-colors">
                  <Settings size={20} />
                </button>
              )}
            </div>
          )}
          <button onClick={logout} className="p-4 glass-card rounded-2xl text-slate-400 hover:text-red-400 border-white/10 transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {showNav && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-fit px-6 animate-in slide-in-from-bottom-12 duration-1000">
          <nav className="glass-card border-white/10 rounded-full p-2 flex items-center gap-2 shadow-2xl glow-blue">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `relative flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-500 group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/40 scale-105' 
                      : 'text-slate-500 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">
                  {item.name}
                </span>
                {/* Active Indicator Dot */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white opacity-0 group-[.active]:opacity-100 transition-opacity"></div>
              </NavLink>
            ))}
            
            <div className="w-px h-8 bg-white/10 mx-2"></div>
            
            <button 
              onClick={() => setShowNav(false)}
              className="p-4 text-slate-500 hover:text-white transition-colors"
            >
              <EyeOff size={18} />
            </button>
          </nav>
        </div>
      )}

      {!showNav && (
        <button 
          onClick={() => setShowNav(true)}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] p-5 glass-card rounded-full text-blue-500 border-white/10 glow-blue animate-bounce"
        >
          <Eye size={24} />
        </button>
      )}
    </>
  );
};

export default Navbar;
