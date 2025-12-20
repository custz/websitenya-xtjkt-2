
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
    if (role.toLowerCase().includes('ketua')) return <Shield size={48} />;
    if (role.toLowerCase().includes('sekretaris')) return <BookOpen size={48} />;
    if (role.toLowerCase().includes('bendahara')) return <Wallet size={48} />;
    return <User size={48} />;
  };

  const removeStudent = (id: string) => {
    updateData({ students: data.students.filter(s => s.id !== id) });
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
    <div className="min-h-screen pt-32 pb-40 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 relative">
          <div className="inline-flex p-4 rounded-3xl bg-blue-600/10 mb-6">
            <Users className="text-blue-500" size={32} />
          </div>
          <h1 className="text-5xl font-bold mb-4">Siswa Kami</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Mengenal struktur inti organisasi kelas <span className="text-blue-400 font-bold italic">{data.brandName}</span>.
          </p>
          
          {isEditMode && (
            <button 
              onClick={() => setIsAdding(true)}
              className="mt-8 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all mx-auto shadow-lg shadow-blue-600/30"
            >
              <Plus size={20} /> Tambah Siswa
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.students.map((person) => (
            <div key={person.id} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r opacity-20 group-hover:opacity-100 transition duration-500 blur-xl rounded-[2rem] z-0"></div>
              <div className="relative bg-slate-900/80 border border-white/10 rounded-[2rem] p-10 flex flex-col items-center text-center z-10 backdrop-blur-md h-full">
                
                {isEditMode && (
                  <button 
                    onClick={() => removeStudent(person.id)}
                    className="absolute top-6 right-6 p-2 bg-red-600/20 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all z-20"
                  >
                    <Trash2 size={18} />
                  </button>
                )}

                <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${person.color} flex items-center justify-center text-white mb-8 shadow-2xl overflow-hidden group-hover:rotate-3 transition-transform relative`}>
                  {person.image ? (
                    <img src={person.image} className="w-full h-full object-cover" />
                  ) : (
                    getIcon(person.role)
                  )}
                  {isEditMode && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingStudentId(person.id);
                          editFileInputRef.current?.click();
                        }}
                        className="p-2 bg-blue-600 rounded-full text-white shadow-lg"
                      >
                        <Camera size={20} />
                      </button>
                    </div>
                  )}
                </div>

                {isEditMode ? (
                  <div className="w-full space-y-3">
                    <input 
                      className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 w-full text-xs text-blue-400 font-mono text-center uppercase tracking-widest"
                      value={person.role}
                      placeholder="Jabatan"
                      onChange={(e) => updateStudent(person.id, { role: e.target.value })}
                    />
                    <input 
                      className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 w-full text-xl font-bold text-white text-center"
                      value={person.name}
                      placeholder="Nama"
                      onChange={(e) => updateStudent(person.id, { name: e.target.value })}
                    />
                    <textarea 
                      className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 w-full text-sm text-slate-400 text-center h-20"
                      value={person.bio}
                      placeholder="Bio Singkat"
                      onChange={(e) => updateStudent(person.id, { bio: e.target.value })}
                    />
                  </div>
                ) : (
                  <>
                    <h4 className="text-blue-400 font-mono text-xs uppercase tracking-[0.3em] mb-3">{person.role}</h4>
                    <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">{person.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">{person.bio}</p>
                  </>
                )}
                
                <div className="mt-auto w-full h-px bg-slate-800 rounded-full mb-4"></div>
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                  <User size={16} />
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Tambah Siswa Baru</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-24 h-24 rounded-2xl bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-700 overflow-hidden relative group">
                    {newStudent.image ? (
                      <img src={newStudent.image} className="w-full h-full object-cover" />
                    ) : (
                      <User className="text-slate-600" size={32} />
                    )}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <Upload className="text-white" size={20} />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase mt-2 font-bold tracking-widest">Unggah Foto Profil</p>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, true)}
                  />
                </div>

                <input 
                  className="bg-slate-800 border border-white/5 rounded-xl px-4 py-3 w-full text-white placeholder:text-slate-500"
                  placeholder="Nama Lengkap"
                  value={newStudent.name}
                  onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                />
                <input 
                  className="bg-slate-800 border border-white/5 rounded-xl px-4 py-3 w-full text-white placeholder:text-slate-500"
                  placeholder="Jabatan (e.g. Sekretaris)"
                  value={newStudent.role}
                  onChange={e => setNewStudent({...newStudent, role: e.target.value})}
                />
                <textarea 
                  className="bg-slate-800 border border-white/5 rounded-xl px-4 py-3 w-full text-white placeholder:text-slate-500 h-24"
                  placeholder="Bio Singkat"
                  value={newStudent.bio}
                  onChange={e => setNewStudent({...newStudent, bio: e.target.value})}
                />
                <button 
                  onClick={addStudent}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg"
                >
                  Simpan Data
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
