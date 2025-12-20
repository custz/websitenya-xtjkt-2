
import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, ImageIcon, Calendar, Cpu, Settings, Eye, EyeOff, Download, Upload, RotateCcw, LogOut, Check, Save } from 'lucide-react';
import { useStore } from '../services/store';

const Navbar: React.FC = () => {
  const { data, updateData, importData, resetToDefault, isEditMode, setEditMode, showNav, setShowNav, userRole, logout } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const navItems = [
    { name: 'Beranda', path: '/', icon: <Home size={20} /> },
    { name: 'Siswa', path: '/siswa', icon: <Users size={20} /> },
    { name: 'Gallery', path: '/gallery', icon: <ImageIcon size={20} /> },
    { name: 'Jadwal', path: '/jadwal', icon: <Calendar size={20} /> },
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
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'tjkt_website_backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (importData(content)) {
          alert("Data berhasil dipulihkan!");
        } else {
          alert("Format file tidak valid.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      {/* Saved Toast Notification */}
      {showSavedMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-emerald-600/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-white/20 p-1 rounded-full">
            <Check size={16} strokeWidth={3} />
          </div>
          <span className="font-bold text-sm uppercase tracking-widest">Perubahan Disimpan!</span>
        </div>
      )}

      {/* Top Branding (Static) */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto group bg-slate-950/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5 shadow-xl">
          <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20 group-hover:rotate-12 transition-transform">
            <Cpu className="text-white" size={20} />
          </div>
          {isEditMode && isAdmin ? (
            <input 
              className="bg-slate-800 border border-blue-500/30 rounded-lg px-2 py-1 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-40"
              value={data.brandName}
              onChange={(e) => updateData({ brandName: e.target.value })}
              placeholder="Nama Website"
            />
          ) : (
            <span className="text-lg font-bold tracking-tighter bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              {data.brandName}
            </span>
          )}
        </div>

        <div className="flex gap-2 pointer-events-auto items-center">
          {isAdmin && (
            <div className="flex gap-2 items-center bg-slate-950/40 backdrop-blur-md border border-white/5 p-1 rounded-[1.5rem] shadow-xl">
              {isEditMode ? (
                <>
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 animate-in zoom-in-95"
                  >
                    <Save size={16} /> Simpan
                  </button>
                  <div className="w-px h-6 bg-white/10 mx-1"></div>
                  <button 
                    onClick={handleExport}
                    className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    title="Ekspor Backup"
                  >
                    <Download size={18} />
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    title="Impor Backup"
                  >
                    <Upload size={18} />
                  </button>
                  <button 
                    onClick={resetToDefault}
                    className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                    title="Reset ke Default"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
                </>
              ) : (
                <button 
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border border-white/5"
                >
                  <Settings size={16} /> Edit Konten
                </button>
              )}
            </div>
          )}
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowNav(!showNav)}
              className={`p-3 rounded-2xl border backdrop-blur-md transition-all ${showNav ? 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-white' : 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'}`}
              title={showNav ? "Sembunyikan Navigasi" : "Munculkan Navigasi"}
            >
              {showNav ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            
            <button 
              onClick={logout}
              className="p-3 bg-slate-900/50 border border-white/10 rounded-2xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
              title="Log Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {showNav && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-fit animate-in slide-in-from-bottom-10 duration-500">
          <nav className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-2 flex items-center gap-1 shadow-2xl shadow-black/50">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-slate-800 text-white text-[10px] px-2 py-1 rounded-md border border-white/10 whitespace-nowrap uppercase tracking-widest font-bold">
                  {item.name}
                </span>
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white opacity-0 group-[.active]:opacity-100 transition-opacity"></div>
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
