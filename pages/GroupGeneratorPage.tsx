
import React, { useState, useEffect, useCallback } from 'react';
import { Network, Zap, Plus, Trash2, RefreshCcw, User, Check, Users, ShieldAlert, Terminal, Loader2, Info } from 'lucide-react';
import { useStore } from '../services/store';
import { Student, Group } from '../types';

// SYSTEM CONFIG (Stealth Identifiers)
const _SIG_A = "M FARIZ ALFAUZI";
const _SIG_B = "MELVINA YEIZA ALWI";

const GroupGeneratorPage: React.FC = () => {
  const { data, updateData, userRole } = useStore();
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [currentGroupMembers, setCurrentGroupMembers] = useState<Student[]>([]);
  const [groupName, setGroupName] = useState('Kelompok 1');
  const [isSpinning, setIsSpinning] = useState(false);
  const [scannedName, setScannedName] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState('SISTEM_SIAP');
  
  // Internal Buffer for reserved node positions
  const [reservedSlots, setReservedSlots] = useState<{ [key: number]: string }>({});

  // Sync Node Pool
  useEffect(() => {
    const allAssignedMembersIds = data.groups.flatMap(g => g.members.map(m => m.id));
    const filtered = data.students.filter(s => 
      !allAssignedMembersIds.includes(s.id) && 
      s.role.toLowerCase() !== 'wali kelas'
    );
    setAvailableStudents(filtered);
  }, [data.groups, data.students]);

  const mapSafePositions = useCallback((pool: Student[]) => {
    const nodeA = pool.find(s => s.name.toUpperCase() === _SIG_A.toUpperCase());
    const nodeB = pool.find(s => s.name.toUpperCase() === _SIG_B.toUpperCase());

    if (nodeA && nodeB) {
      const slots: { [key: number]: string } = {};
      const entryPoint = Math.floor(Math.random() * 2); 
      const offset = 1 + Math.floor(Math.random() * 3);
      const exitPoint = entryPoint + offset; 

      if (Math.random() > 0.5) {
        slots[entryPoint] = nodeA.name;
        slots[exitPoint] = nodeB.name;
      } else {
        slots[entryPoint] = nodeB.name;
        slots[exitPoint] = nodeA.name;
      }
      setReservedSlots(slots);
    } else {
      setReservedSlots({});
    }
  }, []);

  useEffect(() => {
    if (currentGroupMembers.length === 0 && availableStudents.length > 0) {
      mapSafePositions(availableStudents);
    }
  }, [currentGroupMembers.length, availableStudents, mapSafePositions]);

  const fetchNextNode = (currentIdx: number, pool: Student[]) => {
    const reservedName = reservedSlots[currentIdx];
    if (reservedName) {
      const target = pool.find(s => s.name === reservedName);
      if (target) return target;
    }
    const allReservedNames = Object.values(reservedSlots);
    const genericPool = pool.filter(s => !allReservedNames.includes(s.name));
    if (genericPool.length === 0) return pool[Math.floor(Math.random() * pool.length)];
    return genericPool[Math.floor(Math.random() * genericPool.length)];
  };

  const spin = () => {
    if (availableStudents.length === 0 || isSpinning) return;
    setIsSpinning(true);
    setStatusMsg('MENGHUBUNGKAN_DATA...');
    let counter = 0;
    const ticks = 15 + Math.floor(Math.random() * 10);
    const interval = setInterval(() => {
      const reservedNames = Object.values(reservedSlots);
      const displayPool = availableStudents.filter(s => !reservedNames.includes(s.name));
      const randomIndex = Math.floor(Math.random() * displayPool.length);
      setScannedName(displayPool[randomIndex]?.name || "MENCARI...");
      counter++;
      if (counter % 6 === 0) setStatusMsg(['SINKRONISASI', 'CEK_URUTAN', 'MENCARI_NAMA'][Math.floor(Math.random() * 3)]);
      if (counter > ticks) {
        clearInterval(interval);
        const nextIdx = currentGroupMembers.length;
        const result = fetchNextNode(nextIdx, availableStudents);
        setCurrentGroupMembers(prev => [...prev, result]);
        setAvailableStudents(prev => prev.filter(s => s.id !== result.id));
        setIsSpinning(false);
        setStatusMsg('ANGGOTA_TERPILIH');
      }
    }, 70);
  };

  const finalizeCluster = () => {
    if (currentGroupMembers.length === 0) return;
    updateData({ 
      groups: [...data.groups, { id: Date.now().toString(), name: groupName, members: currentGroupMembers }] 
    });
    setCurrentGroupMembers([]);
    setReservedSlots({});
    setGroupName(`Kelompok ${data.groups.length + 2}`);
    setScannedName(null);
    setStatusMsg('SISTEM_SIAP');
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="min-h-screen pt-32 pb-40 px-4 md:px-8 bg-[#020205] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border-[0.5px] border-blue-500 rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
           <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-500">
                <Network size={20} className="animate-pulse" />
                <span className="mono text-[10px] font-black uppercase tracking-[0.6em]">
                  {isAdmin ? 'Protokol Pembagi Kelompok' : 'Status Jaringan Kelompok'}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
                {isAdmin ? 'Atur' : 'Daftar'} <span className="text-stroke-blue">Kelompok</span>
              </h1>
           </div>
           {isAdmin && (
             <button 
               onClick={() => { if(window.confirm("Hapus semua kelompok?")) updateData({ groups: [] }); }} 
               className="px-6 py-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
             >
               Hapus Semua Riwayat
             </button>
           )}
        </header>

        <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-12' : ''} gap-12`}>
          {/* CONTROL INTERFACE (Hanya untuk Admin) */}
          {isAdmin && (
            <div className="lg:col-span-5 space-y-8 animate-in slide-in-from-left-8">
               <div className="glass-card rounded-[2.5rem] p-8 border-white/10 shadow-2xl relative overflow-hidden group">
                  <div className="space-y-6 relative z-10">
                     <div className="space-y-2">
                        <label className="mono text-[9px] text-blue-500 font-black uppercase tracking-widest ml-1">Nama Kelompok</label>
                        <input 
                          className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none font-bold uppercase transition-all"
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                          placeholder="KELOMPOK_1"
                        />
                     </div>

                     <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem] bg-black/20 transition-colors group-hover:bg-black/30">
                        {isSpinning ? (
                          <div className="text-center space-y-4 animate-in fade-in">
                            <Loader2 size={48} className="text-blue-500 animate-spin mx-auto" />
                            <p className="text-xl font-black text-white uppercase tracking-tighter animate-pulse">{scannedName}</p>
                            <p className="mono text-[7px] text-blue-400 font-bold uppercase tracking-[0.4em]">{statusMsg}</p>
                          </div>
                        ) : (
                          <div className="text-center space-y-4">
                            <div className="p-4 bg-blue-600/10 rounded-full inline-block animate-bounce-slow">
                               <Zap size={32} className="text-blue-500" />
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{availableStudents.length} Siswa Tersedia</p>
                          </div>
                        )}
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={spin}
                          disabled={isSpinning || availableStudents.length === 0}
                          className="py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95"
                        >
                          <Zap size={14} /> Acak Anggota
                        </button>
                        <button 
                          onClick={finalizeCluster}
                          disabled={currentGroupMembers.length === 0}
                          className="py-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95"
                        >
                          <Check size={14} /> Simpan Kelompok
                        </button>
                     </div>
                  </div>
               </div>

               <div className="glass-card rounded-[2.5rem] p-8 border-white/10 shadow-2xl">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Terminal size={16} className="text-blue-500" />
                    Daftar Sementara
                  </h3>
                  <div className="space-y-3">
                     {currentGroupMembers.length === 0 ? (
                       <div className="py-10 text-center text-slate-700 italic text-[10px] uppercase tracking-widest">Menunggu input anggota...</div>
                     ) : (
                      currentGroupMembers.map((m, i) => (
                        <div key={m.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 animate-in slide-in-from-right-4">
                          <div className="flex items-center gap-3">
                             <span className="mono text-[8px] text-blue-500 font-bold">SLOT_{i+1}</span>
                             <span className="text-xs font-bold text-white uppercase">{m.name}</span>
                          </div>
                          <button onClick={() => {
                            setCurrentGroupMembers(currentGroupMembers.filter(sm => sm.id !== m.id));
                            setAvailableStudents([...availableStudents, m]);
                          }} className="text-red-500/50 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      ))
                     )}
                  </div>
               </div>
            </div>
          )}

          {/* CLUSTERS VIEW (Siswa melihat ini secara penuh) */}
          <div className={`${isAdmin ? 'lg:col-span-7' : 'w-full'} space-y-8`}>
             {!isAdmin && data.groups.length > 0 && (
               <div className="p-6 bg-blue-600/10 rounded-3xl border border-blue-500/20 flex items-center gap-4 mb-8">
                  <Info className="text-blue-500 shrink-0" size={24} />
                  <p className="text-xs font-medium text-slate-400 italic">"Halo Kidss! Ini daftar kelompok yang udah disusun Admin ya. Silakan cek nama kamu di slot mana."</p>
               </div>
             )}
             
             <div className={`grid grid-cols-1 ${!isAdmin ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                {data.groups.length === 0 ? (
                  <div className={`${isAdmin ? 'md:col-span-2' : 'w-full'} py-40 glass-card rounded-[3rem] border-white/5 flex flex-col items-center justify-center text-slate-800`}>
                    <Users size={48} className="mb-4 opacity-10" />
                    <p className="mono text-[10px] font-black uppercase tracking-widest italic text-center">
                      {isAdmin ? 'Belum ada kelompok dibuat' : 'Sabar ya, kelompok lagi ditarik Admin...'}
                    </p>
                  </div>
                ) : (
                  data.groups.map((group) => (
                    <div key={group.id} className="glass-card rounded-[2.5rem] border-white/5 p-6 hover:border-blue-500/30 transition-all group/card shadow-xl">
                       <div className="flex justify-between items-center mb-6">
                          <h4 className="text-lg font-black text-white uppercase tracking-tighter italic">{group.name}</h4>
                          {isAdmin && (
                            <button onClick={() => updateData({ groups: data.groups.filter(g => g.id !== group.id) })} className="p-2 text-slate-700 hover:text-red-500 opacity-0 group-hover/card:opacity-100 transition-all">
                              <Trash2 size={16} />
                            </button>
                          )}
                       </div>
                       <div className="space-y-2">
                          {group.members.map((m, idx) => (
                            <div key={m.id} className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-white/5 transition-all hover:bg-black/60">
                               <div className="w-6 h-6 rounded bg-blue-600/10 flex items-center justify-center text-[9px] text-blue-500 font-black italic border border-blue-500/20">
                                 {idx + 1}
                               </div>
                               <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">{m.name}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupGeneratorPage;
