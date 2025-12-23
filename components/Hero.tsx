
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Network, Upload, ImageIcon, Zap, Monitor } from 'lucide-react';
import { useStore } from '../services/store';

const Hero: React.FC = () => {
  const { data, updateData, isEditMode } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (field: string, value: string) => {
    if (field.includes('.')) {
      const parts = field.split('.');
      const parent = parts[0] as keyof typeof data;
      const child = parts[1];
      
      updateData({ 
        [parent]: { 
          ...(data[parent] as object), 
          [child]: value 
        } 
      });
    } else {
      updateData({ [field as keyof typeof data]: value });
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
    <div className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden bg-[#05050a]">
      {/* Aesthetic Background Orbs */}
      <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      {/* LARGE TRANSPARENT LOGO WATERMARK */}
      <div className="absolute -right-20 md:right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.05] select-none z-0">
        <Monitor size={800} strokeWidth={0.5} className="text-blue-500 md:size-[1000px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-7 space-y-12">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-card border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] animate-in fade-in duration-1000">
              <div className="text-blue-500">
                <Monitor size={16} strokeWidth={3} />
              </div>
              {isEditMode ? (
                <input 
                  className="bg-transparent border-b border-blue-500/30 focus:outline-none w-48"
                  value={data.heroBadge}
                  onChange={(e) => updateData({ heroBadge: e.target.value })}
                />
              ) : (
                <span>{data.heroBadge}</span>
              )}
            </div>

            <div className="relative">
              {isEditMode ? (
                <textarea 
                  className="bg-transparent border-b border-white/10 text-5xl sm:text-7xl font-black text-white focus:outline-none w-full tracking-tighter resize-none"
                  rows={2}
                  value={data.heroTitle}
                  onChange={(e) => handleEdit('heroTitle', e.target.value)}
                />
              ) : (
                <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter text-white animate-in slide-in-from-left-12 duration-1000">
                  {data.heroTitle.split(' ').map((word, i, arr) => (
                    <span key={i} className="block group cursor-default">
                      {i === 1 ? (
                        <span className="text-stroke-blue group-hover:text-blue-500 transition-all duration-700">{word} </span>
                      ) : word + ' '}
                    </span>
                  ))}
                </h1>
              )}
              <div className="absolute -top-10 -right-10 text-stroke text-8xl font-black opacity-10 select-none pointer-events-none hidden lg:block uppercase">
                {isEditMode ? (
                  <input 
                    className="bg-transparent border-b border-white/10 text-center focus:outline-none w-48 text-4xl"
                    value={data.heroFloatingText}
                    onChange={(e) => updateData({ heroFloatingText: e.target.value })}
                  />
                ) : (
                  data.heroFloatingText
                )}
              </div>
            </div>

            {isEditMode ? (
              <textarea 
                className="w-full bg-transparent border border-white/10 rounded-xl p-4 text-xl text-slate-400 leading-relaxed font-light italic focus:outline-none h-32"
                value={data.heroDescription}
                onChange={(e) => handleEdit('heroDescription', e.target.value)}
              />
            ) : (
              <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-light italic border-l-2 border-blue-500/30 pl-8 animate-in fade-in delay-500 duration-1000">
                {data.heroDescription}
              </p>
            )}

            <div className="flex flex-wrap gap-6 pt-4 animate-in fade-in delay-700 duration-1000">
              <Link to="/siswa" className="group relative px-12 py-6 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-[10px] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10">
                <span className="relative z-10 flex items-center gap-3">Cek Warga Kelas <ArrowRight size={16} /></span>
                <div className="absolute inset-0 bg-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </Link>
              <Link to="/gallery" className="px-12 py-6 glass-card hover:bg-white/5 text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] border border-white/10 transition-all flex items-center gap-3">
                <ImageIcon size={16} /> Galeri Foto
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative animate-aesthetic-float">
            <div className="relative z-10 p-3 glass-card rounded-[3rem] shadow-2xl glow-blue group">
              <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/5]">
                <img 
                  src={data.heroImage} 
                  alt="Aesthetic Class" 
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-transparent to-transparent opacity-60"></div>
                
                {isEditMode && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-8 text-center backdrop-blur-md">
                    <button onClick={() => fileInputRef.current?.click()} className="p-6 bg-white text-black rounded-full mb-4 shadow-2xl">
                      <Upload size={32} />
                    </button>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Update Foto Kelas</p>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </div>
                )}
              </div>
              
              <div className="absolute -bottom-8 -left-8 glass-card px-8 py-6 rounded-3xl border-white/10 shadow-2xl animate-in slide-in-from-bottom-8 duration-1000 delay-1000">
                <div className="mono text-[10px] text-blue-500 font-bold mb-1 tracking-widest uppercase">Lagi Rame</div>
                <div className="text-2xl font-black text-white tracking-tighter uppercase">{data.brandName}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Stats Section */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-16">
          {[
            { id: 'students', label: data.statLabels.students, val: data.stats.students, suffix: "Siswa" },
            { id: 'subjects', label: data.statLabels.subjects, val: data.stats.subjects, suffix: "Mapel" },
            { id: 'uptime', label: data.statLabels.uptime, val: data.stats.uptime, suffix: "Online" },
            { id: 'version', label: data.statLabels.version, val: "2.4.0", suffix: "Stable" },
          ].map((stat, i) => (
            <div key={i} className="group space-y-1">
              {isEditMode ? (
                <div className="flex flex-col gap-2">
                  <input 
                    className="bg-transparent border-b border-blue-500/30 text-stroke-blue text-4xl font-black focus:outline-none w-full"
                    value={stat.val}
                    onChange={(e) => i < 3 ? handleEdit(`stats.${stat.id}`, e.target.value) : null}
                    disabled={i === 3}
                  />
                  <input 
                    className="mono text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] bg-transparent border-b border-white/10 focus:outline-none focus:border-blue-500"
                    value={stat.label}
                    onChange={(e) => handleEdit(`statLabels.${stat.id}`, e.target.value)}
                  />
                </div>
              ) : (
                <>
                  <div className="text-stroke-blue text-4xl font-black group-hover:text-blue-500 transition-colors duration-500">
                    {stat.val}
                  </div>
                  <div className="mono text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em]">{stat.label}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
