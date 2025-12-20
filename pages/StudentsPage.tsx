
import React, { useState, useRef } from 'react';
import { Users, User, Shield, BookOpen, Wallet, Plus, Trash2, Camera, X, Upload } from 'lucide-react';
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

  const getIcon = (role: string) => {
    if (role.toLowerCase().includes('ketua')) return <Shield size={40} />;
    if (role.toLowerCase().includes('sekretaris')) return <BookOpen size={40} />;
    if (role.toLowerCase().includes('bendahara')) return <Wallet size={40} />;
    return <User size={40} />;
  };

  const removeStudent = (id: string) => {
    if(window.confirm("Hapus data siswa ini?")) {
      updateData({ students: data.students.filter(s => s.id !== id) });
    }
  };

  const addStudent = () => {
    if (!newStudent.name) return;
    const s = { ...newStudent, id: Date.now().toString() };
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
        if (isNew) {
          setNewStudent(prev => ({ ...prev, image: base64 }));
        } else if (id) {
          updateStudent(id, { image: base64 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-40 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex p-4 rounded-3xl bg-blue-600/10 mb-6 border border-blue-500/10">
            <Users className="text-blue-500" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Struktur Kelas</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            Anggota inti penggerak ekosistem digital <span className="text-blue-400 font-bold italic">{data.brandName}</span>.
          </p>
          
          {isEditMode && (
            <button 
              onClick={() => setIsAdding(true)}
              className="mt-8 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all mx-auto shadow-xl shadow-blue-600/30 text-sm uppercase tracking-widest"
            >
              <Plus size={20} /> Tambah Anggota
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {data.students.map((person) => (
            <div key={person.id} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl rounded-[2rem] z-0"></div>
              <div className="relative bg-slate-900/60 border border-white/5 rounded-[2rem] p-8 md:p-10 flex flex-col items-center text-center z-10 backdrop-blur-xl h-full shadow-2xl">
                
                {isEditMode && (
                  <button 
                    onClick={() => removeStudent(person.id)}
                    className="absolute top-6 right-6 p-2 bg-red-600/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all z-20"
                  >
                    <Trash2 size={18} />
                  </button>
                )}

                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-gradient-to-br ${person.color} flex items-center justify-center text-white mb-6 md:mb-8 shadow-2xl overflow-hidden relative group-hover:-translate-y-2 transition-transform duration-500`}>
                  {person.image ? (
                    <img src={person.image} className="w-full h-full object-cover" />
                  ) : (
                    getIcon(person.role)
                  )}
                  {isEditMode && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingStudentId(person.id);
                          editFileInputRef.current?.click();
                        }}
                        className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg"
                      >
                        <Camera size={20} />
                      </button>
                    </div>
                  )}
                </div>

                {isEditMode ? (
                  <div className="w-full space-y-3">
                    <input 
                      className="bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2 w-full text-[10px] text-blue-400 font-mono text-center uppercase tracking-[0.2em] font-bold"
                      value={person.role}
                      placeholder="Jabatan"
                      onChange={(e) => updateStudent(person.id, { role: e.target.value })}
                    />
                    <input 
                      className="bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2 w-full text-lg md:text-xl font-bold text-white text-center"
                      value={person.name}
                      placeholder="Nama Lengkap"
                      onChange={(e) => updateStudent(person.id, { name: e.target.value })}
                    />
                    <textarea 
                      className="bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2 w-full text-xs md:text-sm text-slate-400 text-center h-20 resize-none"
                      value={person.bio}
                      placeholder="Bio Singkat..."
                      onChange={(e) => updateStudent(person.id, { bio: e.target.value })}
                    />
                  </div>
                ) : (
                  <>
                    <h4 className="text-blue-500 font-mono text-[10px] uppercase tracking-[0.4em] mb-3 font-bold">{person.role}</h4>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 tracking-tight">{person.name}</h3>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-8 px-2">{person.bio}</p>
                  </>
                )}
                
                <div className="mt-auto w-full flex justify-center pt-6 border-t border-white/5">
                  <div className="px-4 py-1.5 bg-slate-800/80 rounded-full flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                     <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Profile Verified</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <input 
          type="file"
          ref={editFileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileChange(e, false, editingStudentId || undefined)}
        />

        {/* Add Student Modal */}
        {isAdding && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-slate-900 border border-white/10 p-6 md:p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl my-auto animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl md:text-2xl font-bold">Tambah Anggota</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-24 h-24 rounded-[1.5rem] bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-700 overflow-hidden relative group">
                    {newStudent.image ? (
                      <img src={newStudent.image} className="w-full h-full object-cover" />
                    ) : (
                      <User className="text-slate-600" size={32} />
                    )}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <Upload className="text-white" size={20} />
                    </button>
                  </div>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, true)}
                  />
                </div>

                <input 
                  className="bg-slate-800 border border-white/5 rounded-xl px-4 py-3 w-full text-white text-sm placeholder:text-slate-500"
                  placeholder="Nama Lengkap"
                  value={newStudent.name}
                  onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                />
                <input 
                  className="bg-slate-800 border border-white/5 rounded-xl px-4 py-3 w-full text-white text-sm placeholder:text-slate-500"
                  placeholder="Jabatan (Ketua, Sekretaris, dll)"
                  value={newStudent.role}
                  onChange={e => setNewStudent({...newStudent, role: e.target.value})}
                />
                <textarea 
                  className="bg-slate-800 border border-white/5 rounded-xl px-4 py-3 w-full text-white text-sm placeholder:text-slate-500 h-24 resize-none"
                  placeholder="Bio Singkat..."
                  value={newStudent.bio}
                  onChange={e => setNewStudent({...newStudent, bio: e.target.value})}
                />
                <button 
                  onClick={addStudent}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg uppercase text-xs tracking-widest"
                >
                  Simpan Data Anggota
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsPage;
