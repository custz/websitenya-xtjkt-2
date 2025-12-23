
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, Users, ImageIcon, Calendar, Settings, 
  Mail, X, Monitor, Cpu, Radio, Zap
} from 'lucide-react';
import { useStore } from '../services/store';

const Navbar: React.FC = () => {
  const { data, userRole, setEditMode, isEditMode } = useStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Core', path: '/', icon: <Home size={18} /> },
    { name: 'Nodes', path: '/siswa', icon: <Users size={18} /> },
    { name: 'Visual', path: '/gallery', icon: <ImageIcon size={18} /> },
    { name: 'Uptime', path: '/jadwal', icon: <Calendar size={18} /> },
    { name: 'Feed', path: '/mailbox', icon: <Zap size={18} /> },
  ];

  return (
    <>
      {/* HUD HEADER */}
      <header className="fixed top-0 left-0 right-0 z-[100] p-4 md:p-6 flex justify-between items-center">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setSidebarOpen(true)}>
          <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center border-blue-500/20 pulse-blue">
            <Monitor size={20} className="text-blue-500" />
          </div>
          <div className="hidden sm:block">
            <h1 className="tech-font text-lg font-bold tracking-tighter text-white uppercase leading-none">
              {data.brandName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              <span className="mono text-[7px] text-emerald-500 font-bold uppercase tracking-[0.3em]">System Online</span>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex glass-card p-1.5 rounded-2xl border-white/10 gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
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
            <button 
              onClick={() => setEditMode(!isEditMode)}
              className={`p-3 rounded-xl glass-card transition-all ${isEditMode ? 'bg-blue-600 border-blue-500 text-white' : 'text-slate-400'}`}
            >
              <Settings size={18} />
            </button>
          )}
          <button className="md:hidden w-12 h-12 glass-card rounded-xl flex items-center justify-center text-white" onClick={() => setSidebarOpen(true)}>
            <Radio size={20} />
          </button>
        </div>
      </header>

      {/* MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl animate-in fade-in flex items-center justify-center p-6">
          <button onClick={() => setSidebarOpen(false)} className="absolute top-10 right-10 text-white p-4">
            <X size={32} />
          </button>
          <div className="space-y-6 w-full max-w-xs text-center">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="block text-3xl font-black text-slate-500 hover:text-white transition-colors uppercase italic tracking-tighter"
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
