
import React, { useState, useRef } from 'react';
import { Shield, BookOpen, Wallet, Plus, Trash2, Camera, X, Upload, Terminal, Cpu, Zap, Fingerprint, Info, Star, Coffee, Heart, UserCheck, Users, Award, Code, Tv } from 'lucide-react';
import { useStore } from '../services/store';
import { Student } from '../types';

const StudentsPage: React.FC = () => {
  const { data, updateData, isEditMode } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newStudent, setNewStudent] = useState<Student>({
    id: '', name: '', role: '', bio: '', color: 'from-blue-600 to-indigo-700', image: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  const BIO_LIMIT = 150;

  // Refined role icon mapping for better visual differentiation
  const getRoleIcon = (role: string, name: string) => {
    const r = role.toLowerCase();
    const n = name.toLowerCase();
    
    // Special identity checks
    if (n.includes('zent tech')) return <Code size={16} className="text-yellow-400" />;
    if (r.includes('osis')) return <Award size={16} className="text-indigo-400" />;
    if (r.includes('wibu')) return <Tv size={16} className="text-pink-400" />;
    
    // Structure checks
    if (r.includes('wali')) return <UserCheck size={16} className="text-orange-400" />;
    if (r.includes('ketua') && !r.includes('wakil')) return <Star size={16} className="text-yellow-400" />;
    if (r.includes('wakil')) return <Users size={16} className="text-indigo-400" />;
    if (r.includes('sekretaris')) return <BookOpen size={16} className="text-blue-400" />;
    if (r.includes('bendahara')) return <Wallet size={16} className="text-emerald-400" />;
    if (r.includes('keamanan') || r.includes('ketertiban')) return <Shield size={16} className="text-red-400" />;
    if (r.includes('kerohanian')) return <Heart size={16} className="text-pink-400" />;
    if (r.includes('olahraga')) return <Zap size={16} className="text-orange-400" />;
    return <Coffee size={16} className="text-slate-400" />; // Default for "Warga Santuy"
  };

  const removeStudent = (id: string) => {
    if(window.confirm("Beneran mau hapus temen kamu dari daftar?")) {
      updateData({ students: data.students.filter(s => s.id !== id) });
    }
  };

  const addStudent = () => {
    const { name, role, bio } = newStudent;
    
    if (!name.trim()) return alert("Namanya siapa?");
    if (!role.trim()) return alert("Statusnya di kelas apa?");
    if (!bio.trim()) return alert("Tulis dikit dong tentang dia.");
    
    const s = { 
      ...newStudent, 
      id: Date.now().toString(),
      name: name.trim(),
      role: role.trim(),
      bio: bio.trim().slice(0, BIO_LIMIT)
    };
    
    updateData({ students: [...data.students, s] });
    setIsAdding(false);
    setNewStudent({ id: '', name: '', role: '', bio: '', color: 'from-blue-600 to-indigo-700', image: '' });
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    updateData({
      students: data.students.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean, id?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (isNew) setNewStudent(prev => ({ ...prev, image: base64 }));
        else if (id) updateStudent(id, { image: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen pt-40 pb-64 px-6 md:px-12 bg-[#05050a] relative">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-1/4 -right-20 text-[20rem] font-black text-stroke uppercase rotate-90 leading-none">
          Persaudaraan
        </div>
        <div className="absolute bottom-0 -left-20 text-[20rem] font-black text-stroke uppercase -rotate-90 leading-none">
          Keluarga
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-16">
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-3 text-blue-500 animate-pulse">
                <img 
                  src="https://img.icons8.com/?size=100&id=F6X9laZxVKrl&format=png&color=3b82f6" 
                  className="w-5 h-5 object-contain" 
                  alt="Protocol Logo" 
                />
                <span className="mono text-[10px] font-black uppercase tracking-[0.6em]">Vibe Kelas Kita / v2.5</span>
              </div>
              {isEditMode ? (
                <input 
                  className="bg-transparent border-b border-white/10 text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] focus:outline-none w-full uppercase"
                  value={data.studentsTitle}
                  onChange={(e) => updateData({ studentsTitle: e.target.value })}
                />
              ) : (
                <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.8]">
                  {data.studentsTitle.includes(' ') ? (
                    <>
                      {data.studentsTitle.split(' ')[0]}<br />
                      <span className="text-stroke-blue">{data.studentsTitle.split(' ').slice(1).join(' ')}</span>
                    </>
                  ) : (
                    data.studentsTitle
                  )}
                </h1>
              )}
            </div>
            
            <div className="max-w-sm space-y-8 flex-1">
              {isEditMode ? (
                <textarea 
                  className="w-full bg-transparent border border-white/10 rounded-xl p-4 text-slate-400 font-medium italic leading-relaxed text-lg focus:outline-none h-32"
                  value={data.studentsDescription}
                  onChange={(e) => updateData({ studentsDescription: e.target.value })}
                />
              ) : (
                <p className="text-slate-400 font-medium italic leading-relaxed text-lg border-l-2 border-blue-500/50 pl-6">
                  "{data.studentsDescription}"
                </p>
              )}
              {isEditMode && (
                <button 
                  onClick={() => setIsAdding(true)}
                  className="group relative px-10 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-white/5 active:scale-95"
                >
                  <span className="flex items-center gap-3"><Plus size={16} /> Tambah Personel</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Masonry Grid with high-end aesthetic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-32 gap-x-12">
          {data.students.map((person, index) => (
            <div 
              key={person.id} 
              className={`relative flex flex-col group transition-all duration-500 hover:scale-[1.02] ${index % 2 === 1 ? 'md:mt-24' : ''}`}
            >
              {/* Massive Number Label */}
              <div className="absolute -top-12 -left-8 text-7xl font-black text-white/5 select-none mono italic group-hover:text-blue-500/10 transition-colors duration-700">
                {index + 1 < 10 ? `0${index + 1}` : index + 1}
              </div>

              {/* Photo Section */}
              <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden glass-card p-2 group-hover:glow-blue transition-all duration-700">
                {person.image ? (
                  <img src={person.image} className="w-full h-full object-cover rounded-[1.8rem] grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                ) : (
                  <div className={`w-full h-full rounded-[1.8rem] flex items-center justify-center bg-gradient-to-br ${person.color}`}>
                    <Cpu size={80} className="text-white/20" />
                  </div>
                )}
                
                {isEditMode && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setEditingStudentId(person.id);
                        editFileInputRef.current?.click();
                      }}
                      className="p-5 bg-white text-black rounded-full shadow-2xl transform transition-transform hover:scale-110 active:scale-90"
                    >
                      <Camera size={24} />
                    </button>
                  </div>
                )}

                {/* Aesthetic Tags on Photo */}
                <div className="absolute top-6 left-6 flex gap-2">
                  <div className="px-3 py-1 glass-card border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                    PROFIL KECE
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="mt-10 space-y-6 px-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-[1px] bg-blue-500/30"></div>
                  <div className="flex items-center gap-2.5 text-blue-500">
                    <span className="p-1.5 bg-blue-500/10 rounded-lg">
                      {getRoleIcon(person.role, person.name)}
                    </span>
                    <span className="mono text-[9px] font-black uppercase tracking-[0.4em]">{person.role}</span>
                  </div>
                </div>

                <div className="space-y-2">
                   {isEditMode ? (
                     <div className="space-y-4">
                        <input 
                          className="w-full bg-transparent border-b border-white/10 text-4xl font-black text-white focus:outline-none focus:border-blue-500 tracking-tighter uppercase"
                          value={person.name}
                          onChange={(e) => updateStudent(person.id, { name: e.target.value })}
                          placeholder="Nama Panggilan"
                        />
                        <div className="relative">
                          <textarea 
                            className="w-full bg-slate-900/50 rounded-2xl p-4 text-slate-400 text-xs italic focus:outline-none border border-white/5 resize-none h-24"
                            value={person.bio}
                            maxLength={BIO_LIMIT}
                            onChange={(e) => updateStudent(person.id, { bio: e.target.value })}
                            placeholder="Tulis bio singkat..."
                          />
                          <div className={`absolute bottom-2 right-4 mono text-[8px] font-bold ${person.bio.length >= BIO_LIMIT ? 'text-red-500' : 'text-slate-600'}`}>
                            Sisa {BIO_LIMIT - person.bio.length} karakter
                          </div>
                        </div>
                        <button onClick={() => removeStudent(person.id)} className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-red-400 transition-colors">
                          <Trash2 size={12} /> Hapus Personel Ini
                        </button>
                     </div>
                   ) : (
                    <>
                      <h2 className="text-4xl font-black text-white leading-none tracking-tighter group-hover:text-blue-500 transition-colors duration-500 cursor-default uppercase">
                        {person.name}
                      </h2>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed italic max-w-xs pt-2 line-clamp-3">
                        "{person.bio}"
                      </p>
                    </>
                   )}
                </div>

                {/* Footer Spacer */}
                <div className="pt-6 flex justify-between items-center border-t border-white/5">
                   <div className="flex gap-4 items-center">
                      <img 
                        src="https://img.icons8.com/?size=100&id=F6X9laZxVKrl&format=png&color=3b82f6" 
                        className="w-4 h-4 object-contain opacity-50" 
                        alt="Node Status" 
                      />
                      <span className="mono text-[8px] text-slate-600 font-bold uppercase tracking-widest">Status: Lagi Asik</span>
                   </div>
                   <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {isAdding && (
          <div className="fixed inset-0 z-[200] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-20">
              <div className="space-y-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-blue-500">
                    <Zap size={20} />
                    <span className="mono text-[10px] font-black uppercase tracking-[0.5em]">Input Warga Baru</span>
                  </div>
                  <h3 className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">Siapa<br /><span className="text-stroke-blue">Yang Masuk?</span></h3>
                </div>

                <div className="relative aspect-square glass-card rounded-[3rem] p-4 flex flex-col items-center justify-center overflow-hidden group">
                  {newStudent.image ? (
                    <img src={newStudent.image} className="w-full h-full object-cover rounded-[2.5rem]" />
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-slate-700">
                       <Upload size={48} className="group-hover:text-blue-500 transition-colors" />
                       <span className="mono text-[10px] font-bold uppercase tracking-widest">Klik buat upload foto</span>
                    </div>
                  )}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm"
                  >
                    <Camera size={40} className="text-white" />
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, true)} />
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-10">
                <div className="space-y-8">
                   <div className="space-y-2">
                      <label className="mono text-[9px] text-blue-500 font-black uppercase tracking-widest flex items-center gap-2">
                        <Terminal size={10} /> Nama Panggilan
                      </label>
                      <input 
                        className="w-full bg-transparent border-b-2 border-white/10 py-4 text-3xl font-black text-white focus:outline-none focus:border-blue-600 transition-all uppercase placeholder:text-white/5"
                        placeholder="NAMA_KECE"
                        value={newStudent.name}
                        onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="mono text-[9px] text-blue-500 font-black uppercase tracking-widest flex items-center gap-2">
                        <Cpu size={10} /> Status / Jabatan
                      </label>
                      <input 
                        className="w-full bg-transparent border-b-2 border-white/10 py-4 text-xl font-bold text-white focus:outline-none focus:border-blue-600 transition-all uppercase placeholder:text-white/5"
                        placeholder="CONTOH: ANAK_BOLOS"
                        value={newStudent.role}
                        onChange={e => setNewStudent({...newStudent, role: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2 relative">
                      <label className="mono text-[9px] text-blue-500 font-black uppercase tracking-widest flex items-center gap-2">
                        <Info size={10} /> Tentang Dia
                      </label>
                      <textarea 
                        className="w-full bg-white/5 rounded-3xl p-6 text-white focus:outline-none focus:ring-1 ring-blue-600 h-32 text-sm placeholder:text-white/5 resize-none"
                        placeholder="Deskripsiin dikit biar makin kenal..."
                        maxLength={BIO_LIMIT}
                        value={newStudent.bio}
                        onChange={e => setNewStudent({...newStudent, bio: e.target.value})}
                      />
                      <div className={`absolute bottom-4 right-6 mono text-[8px] font-bold ${newStudent.bio.length >= BIO_LIMIT ? 'text-red-500' : 'text-slate-600'}`}>
                        Sisa {BIO_LIMIT - newStudent.bio.length} karakter
                      </div>
                   </div>
                </div>

                <div className="flex gap-6">
                  <button 
                    onClick={addStudent} 
                    className="flex-1 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-blue-600/20 transition-all active:scale-95"
                  >
                    Masuk Barisan
                  </button>
                  <button 
                    onClick={() => setIsAdding(false)} 
                    className="px-8 py-6 glass-card rounded-full text-white font-black uppercase text-[10px] tracking-widest border border-white/10 hover:bg-white/5 transition-colors"
                  >
                    Batal Deh
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <input type="file" ref={editFileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, false, editingStudentId || undefined)} />
      </div>
    </div>
  );
};

export default StudentsPage;
