
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
    <div className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
            <Network size={16} />
            <span>Angkatan 2024 • TJKT</span>
          </div>
          
          <div className="relative">
            {isEditMode ? (
              <div className="space-y-4">
                <input 
                  className="bg-slate-900/50 border border-blue-500/30 rounded-xl px-4 py-2 w-full text-4xl font-bold text-white focus:outline-none"
                  value={data.heroTitle}
                  onChange={(e) => handleEdit('heroTitle', e.target.value)}
                  placeholder="Judul Hero"
                />
                <textarea 
                  className="bg-slate-900/50 border border-blue-500/30 rounded-xl px-4 py-2 w-full text-slate-400 focus:outline-none h-24"
                  value={data.heroDescription}
                  onChange={(e) => handleEdit('heroDescription', e.target.value)}
                  placeholder="Deskripsi Hero"
                />
              </div>
            ) : (
              <>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  {data.heroTitle.split(' ').map((word, i) => 
                    word.toLowerCase() === 'tjkt' || word === '2' ? <span key={i} className="text-blue-500 uppercase">{word} </span> : word + ' '
                  )}
                </h1>
                <p className="text-lg text-slate-400 max-w-lg leading-relaxed mt-4">
                  {data.heroDescription}
                </p>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/velicia" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-blue-600/25">
              Tanya Velicia AI <ArrowRight size={20} />
            </Link>
            <Link to="/siswa" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-semibold border border-slate-700 transition-all text-center">
              Lihat Struktur
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { label: "Total Siswa", key: "students", val: data.stats.students },
              { label: "Mata Pelajaran", key: "subjects", val: data.stats.subjects },
              { label: "Uptime Belajar", key: "uptime", val: data.stats.uptime },
            ].map((stat) => (
              <div key={stat.key} className="text-center lg:text-left relative">
                {isEditMode ? (
                  <input 
                    className="bg-slate-900 border border-white/10 rounded-lg w-full text-2xl font-bold text-white p-1 text-center lg:text-left"
                    value={stat.val}
                    onChange={(e) => handleEdit(`stats.${stat.key}`, e.target.value)}
                  />
                ) : (
                  <h3 className="text-3xl font-bold">{stat.val}</h3>
                )}
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-2">
            <img 
              src={data.heroImage} 
              alt="Class" 
              className="rounded-2xl w-full h-[400px] grayscale hover:grayscale-0 transition-all duration-500 object-cover"
            />
            {isEditMode && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 bg-blue-600 text-white rounded-full mb-4 shadow-xl hover:scale-110 transition-transform"
                >
                  <Upload size={24} />
                </button>
                <p className="text-sm font-bold text-white">Unggah Foto Beranda</p>
                <p className="text-xs text-slate-400 mt-2">Pilih file dari perangkat Anda</p>
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
            )}
            <div className="absolute top-6 left-6 flex gap-2">
              <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-mono border border-white/10 uppercase">
                {data.brandName}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
