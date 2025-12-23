
import React, { useState, useMemo } from 'react';
import { 
  Heart, Send, Music, Shield, User, X, Plus, 
  Trash2, Search, Zap, Star, MessageSquare, ShieldCheck, 
  Activity, Clock, Music4
} from 'lucide-react';
import { useStore } from '../services/store';
import { Menfess } from '../types';

const gradients = [
  'from-pink-500 via-rose-500 to-red-500',
  'from-blue-600 via-indigo-600 to-purple-600',
  'from-emerald-500 via-teal-500 to-cyan-500',
  'from-orange-500 via-amber-500 to-yellow-500',
  'from-indigo-500 via-purple-500 to-pink-500',
  'from-cyan-500 via-blue-500 to-indigo-500',
];

const MenfessPage: React.FC = () => {
  const { data, updateData, userRole, userProfile } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [to, setTo] = useState('Semua Warga');
  const [message, setMessage] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [isSongfess, setIsSongfess] = useState(false);

  const isAdmin = userRole === 'admin';

  const sendMenfess = () => {
    if (!message.trim()) return;

    const newMenfess: Menfess = {
      id: Date.now().toString(),
      to: to,
      from: 'Secret Node',
      message: message.trim(),
      timestamp: new Date().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }),
      color: gradients[Math.floor(Math.random() * gradients.length)],
      song: isSongfess && songTitle.trim() ? { title: songTitle, artist: songArtist || 'Unknown Artist' } : undefined
    };

    updateData({ menfess: [newMenfess, ...data.menfess] });
    setIsAdding(false);
    resetForm();
  };

  const resetForm = () => {
    setTo('Semua Warga');
    setMessage('');
    setSongTitle('');
    setSongArtist('');
    setIsSongfess(false);
  };

  const filteredMenfess = useMemo(() => {
    if (!searchQuery.trim()) return data.menfess;
    return data.menfess.filter(m => 
      m.to.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data.menfess, searchQuery]);

  return (
    <div className="min-h-screen pt-32 pb-40 px-4 md:px-8 bg-[#020205] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
        <div className="absolute top-1/4 -right-20 text-[20rem] font-black text-stroke uppercase rotate-90 leading-none">Menfess</div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16 border-b border-white/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3 text-pink-500">
                <Heart size={24} className="animate-pulse fill-current" />
                <span className="mono text-[10px] font-black uppercase tracking-[0.5em]">Secret_Communication_Channel</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
                Menfess <span className="text-stroke-pink text-pink-500/50">& Songfess</span>
              </h1>
           </div>
           <button 
             onClick={() => setIsAdding(true)}
             className="px-10 py-6 bg-pink-600 hover:bg-pink-500 text-white rounded-[2.5rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-pink-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
           >
             <Plus size={20} /> Kirim Pesan Rahasia
           </button>
        </header>

        {/* SEARCH & FILTER */}
        <div className="mb-12 max-w-xl">
           <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-rose-600 rounded-3xl blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
              <div className="relative glass-card rounded-3xl border-white/10 flex items-center gap-4 px-6 py-1">
                 <Search size={20} className="text-pink-500" />
                 <input 
                   className="w-full bg-transparent py-4 text-white font-bold placeholder:text-slate-600 outline-none"
                   placeholder="Cari pesan atau nama tujuan..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
           </div>
        </div>

        {/* FEED GRID */}
        {filteredMenfess.length === 0 ? (
          <div className="py-40 text-center glass-card rounded-[3.5rem] border-white/5 flex flex-col items-center">
             <div className="p-8 rounded-full bg-white/5 mb-8">
                <Shield size={48} className="text-slate-800" />
             </div>
             <p className="mono text-[10px] text-slate-600 font-black uppercase tracking-[0.5em] italic">Belum ada pesan rahasia yang terdeteksi...</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {filteredMenfess.map((m) => (
              <div 
                key={m.id} 
                className="break-inside-avoid relative glass-card rounded-[3rem] p-8 border-white/5 shadow-2xl group overflow-hidden transition-all hover:scale-[1.02]"
              >
                {/* Random Gradient Background behind card */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${m.color} blur-[60px] opacity-10 pointer-events-none`}></div>
                
                <div className="flex justify-between items-start mb-6">
                   <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="mono text-[8px] text-pink-500 font-black uppercase tracking-widest">To_Node:</span>
                         <span className="text-sm font-black text-white uppercase tracking-tighter">{m.to}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="mono text-[8px] text-slate-500 font-black uppercase tracking-widest">From_Node:</span>
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">{m.from}</span>
                      </div>
                   </div>
                   {isAdmin && (
                     <button onClick={() => updateData({ menfess: data.menfess.filter(p => p.id !== m.id) })} className="p-2 text-slate-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={16} />
                     </button>
                   )}
                </div>

                <div className={`p-6 rounded-[2rem] bg-gradient-to-br ${m.color} shadow-xl mb-6 min-h-[120px] flex items-center justify-center text-center`}>
                   <p className="text-white font-black text-xl italic tracking-tight leading-tight">
                     "{m.message}"
                   </p>
                </div>

                {m.song && (
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 mb-6 group/song">
                     <div className="w-10 h-10 rounded-xl bg-pink-600/20 flex items-center justify-center text-pink-500 animate-spin-slow">
                        <Music4 size={18} />
                     </div>
                     <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] font-black text-white uppercase truncate">{m.song.title}</span>
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest truncate">{m.song.artist}</span>
                     </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                   <div className="flex items-center gap-2 text-slate-600">
                      <Clock size={12} />
                      <span className="mono text-[8px] font-bold uppercase">{m.timestamp}</span>
                   </div>
                   <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500/20"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500/40"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEND MODAL */}
      {isAdding && (
        <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in">
           <div className="w-full max-w-lg glass-card rounded-[3.5rem] p-10 border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-3xl pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <Zap size={20} className="text-pink-500" />
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Kirim Pesan</h3>
                </div>
                <button onClick={() => setIsAdding(false)} className="p-2 text-slate-500 hover:text-white transition-colors"><X size={28} /></button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                   <label className="mono text-[9px] font-black text-pink-500 uppercase tracking-widest ml-1">Tujuan Pesan</label>
                   <select 
                     className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-pink-500/50 appearance-none uppercase text-xs"
                     value={to}
                     onChange={(e) => setTo(e.target.value)}
                   >
                      <option value="Semua Warga">Semua Warga Kelas</option>
                      {data.students.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                   </select>
                </div>

                <div className="space-y-2">
                   <label className="mono text-[9px] font-black text-pink-500 uppercase tracking-widest ml-1">Pesan Rahasia</label>
                   <textarea 
                     className="w-full bg-slate-900 border border-white/5 rounded-[2rem] p-6 text-white outline-none focus:border-pink-500/50 h-32 resize-none text-sm placeholder:text-slate-700 font-medium" 
                     placeholder="Tulis uneg-uneg atau salam buat dia..." 
                     value={message} 
                     onChange={(e) => setMessage(e.target.value)} 
                   />
                </div>

                <div className="pt-4 space-y-4">
                   <button 
                     onClick={() => setIsSongfess(!isSongfess)}
                     className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all text-[9px] font-black uppercase tracking-widest ${isSongfess ? 'bg-pink-600/10 border-pink-500 text-pink-500' : 'bg-white/5 border-white/5 text-slate-600'}`}
                   >
                      <Music size={14} /> {isSongfess ? 'Mode Songfess On' : 'Tambah Songfess?'}
                   </button>

                   {isSongfess && (
                     <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4">
                        <input 
                          className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white text-xs font-bold outline-none focus:border-pink-500/50" 
                          placeholder="JUDUL LAGU"
                          value={songTitle}
                          onChange={(e) => setSongTitle(e.target.value)}
                        />
                        <input 
                          className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white text-xs font-bold outline-none focus:border-pink-500/50" 
                          placeholder="ARTIS"
                          value={songArtist}
                          onChange={(e) => setSongArtist(e.target.value)}
                        />
                     </div>
                   )}
                </div>

                <button 
                  onClick={sendMenfess}
                  disabled={!message.trim()}
                  className="w-full py-6 bg-pink-600 hover:bg-pink-500 disabled:opacity-30 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all shadow-2xl shadow-pink-600/20 active:scale-95 flex items-center justify-center gap-3"
                >
                  <Send size={16} /> Broadcast Sekarang
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MenfessPage;
