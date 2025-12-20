
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Network, Pencil, Upload } from 'lucide-react';
import { useStore } from '../services/store';

const Hero: React.FC = () => {
  const { data, updateData, isEditMode } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (field: string, value: string) => {
    if (field.includes('.')) {
      const [p1, p2] = field.split('.');
      updateData({ stats: { ...data.stats, [p2]: value } });
    } else {
      updateData({ [field]: value });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateData({ heroImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-[#020617]">
      {/* Dynamic Background */}
      <div className="absolute top-0 -left-10 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob"></div>
      <div className="absolute top-20 -right-10 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
            <Network size={14} />
            <span>Angkatan 2024 • TJKT</span>
          </div>
          
          <div className="space-y-4">
            {isEditMode ? (
              <div className="space-y-4">
                <input 
                  className="bg-slate-900/50 border border-blue-500/30 rounded-2xl px-5 py-3 w-full text-3xl sm:text-4xl font-black text-white focus:outline-none focus:ring-2 ring-blue-500/20"
                  value={data.heroTitle}
                  onChange={(e) => handleEdit('heroTitle', e.target.value)}
                  placeholder="Judul Hero"
                />
                <textarea 
                  className="bg-slate-900/50 border border-blue-500/30 rounded-2xl px-5 py-3 w-full text-slate-400 focus:outline-none h-24 text-sm sm:text-base"
                  value={data.heroDescription}
                  onChange={(e) => handleEdit('heroDescription', e.target.value)}
                  placeholder="Deskripsi Hero"
                />
              </div>
            ) : (
              <>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-white">
                  {data.heroTitle.split(' ').map((word, i) => 
                    word.toLowerCase() === 'tjkt' || word === '2' ? <span key={i} className="text-blue-500 uppercase">{word} </span> : word + ' '
                  )}
                </h1>
                <p className="text-base sm:text-lg text-slate-400 max-w-lg leading-relaxed font-medium">
                  {data.heroDescription}
                </p>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/velicia" className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 shadow-2xl shadow-blue-600/30">
              Velicia AI <ArrowRight size={18} />
            </Link>
            <Link to="/siswa" className="px-10 py-5 bg-slate-900/50 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs border border-white/5 transition-all text-center backdrop-blur-md">
              Struktur Kelas
            </Link>
          </div>
          
          {/* Responsive Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-6">
            {[
              { label: "Siswa", key: "students", val: data.stats.students },
              { label: "Mapel", key: "subjects", val: data.stats.subjects },
              { label: "Uptime", key: "uptime", val: data.stats.uptime },
            ].map((stat) => (
              <div key={stat.key} className="relative group">
                <div className="absolute inset-0 bg-blue-600/5 blur-xl group-hover:bg-blue-600/10 transition-all rounded-full"></div>
                {isEditMode ? (
                  <input 
                    className="relative bg-slate-900/50 border border-white/5 rounded-xl w-full text-xl sm:text-2xl font-black text-white p-2 text-center focus:outline-none focus:border-blue-500"
                    value={stat.val}
                    onChange={(e) => handleEdit(`stats.${stat.key}`, e.target.value)}
                  />
                ) : (
                  <h3 className="relative text-2xl sm:text-4xl font-black text-white tracking-tighter">{stat.val}</h3>
                )}
                <p className="relative text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Section */}
        <div className="relative group animate-in fade-in zoom-in-95 duration-1000">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-slate-900/50 border border-white/10 rounded-[2.5rem] overflow-hidden p-2 backdrop-blur-xl shadow-2xl">
            <img 
              src={data.heroImage} 
              alt="Class" 
              className="rounded-[2rem] w-full h-[300px] sm:h-[450px] lg:h-[550px] object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
            />
            {isEditMode && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-5 bg-blue-600 text-white rounded-full mb-4 shadow-2xl hover:scale-110 active:scale-95 transition-transform"
                >
                  <Upload size={28} />
                </button>
                <p className="text-sm font-black text-white uppercase tracking-widest">Unggah Hero Banner</p>
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
            )}
            <div className="absolute bottom-8 left-8 flex gap-3">
              <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-2xl text-[10px] font-black border border-white/10 uppercase tracking-widest text-white/80">
                {data.brandName} • SECURE NODE
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
