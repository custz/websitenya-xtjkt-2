
import React, { useState, useRef, useMemo } from 'react';
import { Shield, BookOpen, Wallet, Plus, Trash2, Camera, X, Upload, Terminal, Cpu, Zap, Fingerprint, Info, Star, Coffee, Heart, UserCheck, Users, Award, Code, Tv, Crown, Layout, Database, Activity, ShieldCheck, Search } from 'lucide-react';
import { useStore } from '../services/store';
import { Student } from '../types';

const StudentsPage: React.FC = () => {
  const { data, updateData, isEditMode, userRole } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newStudent, setNewStudent] = useState<Student>({
    id: '', name: '', role: '', bio: '', color: 'from-blue-600 to-indigo-700', image: '', isVerified: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  const BIO_LIMIT = 150;

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return data.students;
    return data.students.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data.students, searchQuery]);

  const getRoleIcon = (role: string, name: string) => {
    const r = role.toLowerCase();
    
    if (r.includes('wali kelas')) return <Crown size={16} className="text-rose-400" />;
    if (r.includes('development') || r.includes('zent')) return <Terminal size={16} className="text-blue-400" />;
    if (r.includes('desain web') || r.includes('zyld')) return <Layout size={16} className="text-pink-400" />;
    if (r.includes('struktur web') || r.includes('noir')) return <Database size={16} className="text-cyan-400" />;
    if (r.includes('ketua murid')) return <Star size={16} className="text-yellow-400" />;
    if (r.includes('wakil murid')) return <Users size={16} className="text-indigo-400" />;
    if (r.includes('sekretaris')) return <BookOpen size={16} className="text-emerald-400" />;
    if (r.includes('bendahara')) return <Wallet size={16} className="text-amber-400" />;
    if (r.includes('osis')) return <Award size={16} className="text-blue-400" />;
    if (r.includes('keamanan')) return <Shield size={16} className="text-red-400" />;
    
    return <Coffee size={16} className="text-slate-500" />;
  };

  const removeStudent = (id: string) => {
    if(window.confirm("Beneran mau hapus temen kamu dari daftar?")) {
      updateData({ students: data.students.filter(s => s.id !== id) });
    }
  };

  const toggleVerify = (id: string) => {
    updateData({
      students: data.students.map(s => s.id === id ? { ...s, isVerified: !s.isVerified } : s)
    });
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
    setNewStudent({ id: '', name: '', role: '', bio: '', color: 'from-blue-600 to-indigo-700', image: '', isVerified: false });
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
    <div className="min-h-screen pt-48 pb-64 px-6 md:px-12 bg-[#05050a] relative">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-1/4 -right-20 text-[20rem] font-black text-stroke uppercase rotate-90 leading-none">
          Persaudaraan
        </div>
        <div className="absolute bottom-0 -left-20 text-[20rem] font-black text-stroke uppercase -rotate-90 leading-none">
          Keluarga
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-16">
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-3 text-blue-500 animate-pulse">
                <Activity size={16} />
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
              
              <div className="flex flex-wrap gap-4">
                {isEditMode && (
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="flex-1 group relative px-8 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-white/5 active:scale-95"
                  >
                    <span className="flex items-center gap-3"><Plus size={16} /> Tambah Personel</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* SEARCH BAR HUD */}
        <div className="mb-20 max-w-2xl mx-auto">
           <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
              <div className="relative glass-card rounded-[2rem] border-white/10 p-2 flex items-center gap-4">
                 <div className="pl-6 text-blue-500">
                    <Search size={24} />
                 </div>
                 <input 
                   type="text" 
                   className="w-full bg-transparent py-5 text-white font-bold placeholder:text-slate-600 focus:outline-none text-lg"
                   placeholder="Cari Node Siswa atau Jabatan..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
                 <div className="pr-6 mono text-[8px] text-slate-700 font-black uppercase tracking-widest hidden sm:block">
                   Search_Protocol_Active
                 </div>
              </div>
           </div>
           <div className="mt-4 flex justify-center gap-8">
              <span className="mono text-[8px] text-slate-500 font-bold uppercase tracking-widest">Total: {data.students.length} Nodes</span>
              <span className="mono text-[8px] text-blue-500 font-bold uppercase tracking-widest">Architects: Zent • Zyld • Noir</span>
           </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="py-40 text-center glass-card rounded-[3rem] border-white/5">
             <Search size={48} className="mx-auto text-slate-800 mb-6" />
             <p className="mono text-[10px] text-slate-600 font-black uppercase tracking-widest italic">Node tidak terdeteksi di jaringan...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-32 gap-x-12">
            {filteredStudents.map((person, index) => (
              <div 
                key={person.id} 
                className={`relative flex flex-col group transition-all duration-500 hover:scale-[1.02] ${index % 2 === 1 ? 'md:mt-24' : ''}`}
              >
                <div className="absolute -top-12 -left-8 text-7xl font-black text-white/5 select-none mono italic group-hover:text-blue-500/10 transition-colors duration-700">
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </div>

                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden glass-card p-2 group-hover:glow-blue transition-all duration-700">
                  {person.image ? (
                    <img src={person.image} className="w-full h-full object-cover rounded-[1.8rem] grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                  ) : (
                    <div className={`w-full h-full rounded-[1.8rem] flex items-center justify-center bg-gradient-to-br ${person.color}`}>
                      <Cpu size={80} className="text-white/20" />
                    </div>
                  )}
                  
                  {isEditMode && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingStudentId(person.id);
                          editFileInputRef.current?.click();
                        }}
                        className="p-4 bg-white text-black rounded-full shadow-2xl transform transition-transform hover:scale-110"
                      >
                        <Camera size={20} />
                      </button>
                      {userRole === 'admin' && (
                        <button 
                          onClick={() => toggleVerify(person.id)}
                          className={`p-4 rounded-full shadow-2xl transition-all hover:scale-110 ${person.isVerified ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                          title={person.isVerified ? "Hapus Verifikasi" : "Verifikasi Node Ini"}
                        >
                          <ShieldCheck size={20} />
                        </button>
                      )}
                    </div>
                  )}

                  <div className="absolute top-6 left-6 flex gap-2">
                    <div className={`px-3 py-1 glass-card border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md ${person.role.toLowerCase() !== 'warga santuy' ? 'border-blue-500/50 text-blue-400' : ''}`}>
                      {person.role.toLowerCase() !== 'warga santuy' ? 'ELITE NODE' : 'ACTIVE NODE'}
                    </div>
                    {person.isVerified && (
                       <div className="px-3 py-1 bg-blue-600 rounded-full text-[8px] font-black uppercase tracking-widest text-white flex items-center gap-1 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                          <ShieldCheck size={10} /> Verified
                       </div>
                    )}
                  </div>
                </div>

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
                          />
                          <button onClick={() => removeStudent(person.id)} className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-red-400 transition-colors">
                            <Trash2 size={12} /> Hapus Personel Ini
                          </button>
                       </div>
                     ) : (
                      <>
                        <div className="flex flex-col">
                          <h2 className="text-4xl font-black text-white leading-none tracking-tighter group-hover:text-blue-500 transition-colors duration-500 cursor-default uppercase flex items-center gap-3">
                            {person.name}
                            {person.isVerified && <ShieldCheck className="text-blue-500 shrink-0" size={24} />}
                          </h2>
                        </div>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed italic max-w-xs pt-2 line-clamp-3">
                          "{person.bio}"
                        </p>
                      </>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isAdding && (
          <div className="fixed inset-0 z-[200] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in">
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
                  {newStudent.image ? <img src={newStudent.image} className="w-full h-full object-cover rounded-[2.5rem]" /> : <Upload size={48} className="text-slate-700" />}
                  <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Camera size={40} className="text-white" /></button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, true)} />
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-10">
                <div className="space-y-8">
                   <input className="w-full bg-transparent border-b-2 border-white/10 py-4 text-3xl font-black text-white focus:outline-none focus:border-blue-600 transition-all uppercase" placeholder="NAMA_KECE" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                   <input className="w-full bg-transparent border-b-2 border-white/10 py-4 text-xl font-bold text-white focus:outline-none focus:border-blue-600 transition-all uppercase" placeholder="STATUS/ROLE" value={newStudent.role} onChange={e => setNewStudent({...newStudent, role: e.target.value})} />
                   <textarea className="w-full bg-white/5 rounded-3xl p-6 text-white focus:outline-none focus:ring-1 ring-blue-600 h-32 text-sm resize-none" placeholder="Deskripsiin dikit..." maxLength={BIO_LIMIT} value={newStudent.bio} onChange={e => setNewStudent({...newStudent, bio: e.target.value})} />
                </div>
                <div className="flex gap-6">
                  <button onClick={addStudent} className="flex-1 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-blue-600/20 active:scale-95">Masuk Barisan</button>
                  <button onClick={() => setIsAdding(false)} className="px-8 py-6 glass-card rounded-full text-white font-black uppercase text-[10px] tracking-widest border border-white/10">Batal</button>
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
