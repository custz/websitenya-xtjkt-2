
import React, { useState } from 'react';
import { 
  Database, Zap, Clock, ExternalLink, Plus, Trash2, 
  Terminal, Shield, Globe, Cpu, BookOpen, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { useStore } from '../services/store';
import { Task, Resource } from '../types';

const TaskHubPage: React.FC = () => {
  const { data, updateData, userRole, isEditMode } = useStore();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingResource, setIsAddingResource] = useState(false);
  
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '', subject: '', deadline: '', description: '', status: 'active'
  });
  
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    title: '', category: 'Web', link: '', iconType: 'Globe'
  });

  const isAdmin = userRole === 'admin';

  const addTask = () => {
    if (!newTask.title || !newTask.deadline) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title!,
      subject: newTask.subject || 'Mapel',
      deadline: newTask.deadline!,
      status: newTask.status as any || 'active',
      description: newTask.description || ''
    };
    updateData({ tasks: [task, ...data.tasks] });
    setIsAddingTask(false);
    setNewTask({ title: '', subject: '', deadline: '', description: '', status: 'active' });
  };

  const addResource = () => {
    if (!newResource.title || !newResource.link) return;
    const res: Resource = {
      id: Date.now().toString(),
      title: newResource.title!,
      category: newResource.category as any || 'Web',
      link: newResource.link!,
      iconType: 'Globe'
    };
    updateData({ resources: [res, ...data.resources] });
    setIsAddingResource(false);
    setNewResource({ title: '', category: 'Web', link: '', iconType: 'Globe' });
  };

  const getDaysLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="min-h-screen pt-32 pb-40 px-6 md:px-12 bg-[#020205] relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-5">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-500 rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16 border-b border-white/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
           <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-500">
                <Database size={20} className="animate-pulse" />
                <span className="mono text-[10px] font-black uppercase tracking-[0.5em]">Pusat_Kendali_Tugas</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
                Markas <span className="text-stroke-blue">TJKT</span>
              </h1>
           </div>
           <div className="flex gap-4">
              <div className="glass-card px-6 py-3 rounded-2xl border-white/10 flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="mono text-[10px] text-white font-black uppercase tracking-widest">Data_Aman: JAYA</span>
              </div>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* TASK MONITOR (LEFT) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Terminal size={20} className="text-blue-500" />
                  <h2 className="text-xl font-black text-white uppercase italic tracking-widest">PR & Tugas Hari Ini</h2>
               </div>
               {isAdmin && (
                 <button onClick={() => setIsAddingTask(true)} className="p-2 bg-blue-600/20 text-blue-500 border border-blue-500/30 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                   <Plus size={18} />
                 </button>
               )}
            </div>

            <div className="space-y-4">
               {data.tasks.map(task => {
                 const daysLeft = getDaysLeft(task.deadline);
                 const isUrgent = daysLeft <= 2;
                 return (
                   <div key={task.id} className={`glass-card rounded-[2rem] p-6 border-white/5 group hover:border-blue-500/30 transition-all relative overflow-hidden ${data.systemStatus === 'Overload' ? 'animate-pulse' : ''}`}>
                      <div className="flex justify-between items-start mb-4 relative z-10">
                         <div>
                            <span className={`mono text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5 mb-2 inline-block ${isUrgent ? 'text-red-500' : 'text-blue-500'}`}>
                               {task.subject} // {isUrgent ? 'BAHAYA' : 'AMAN'}
                            </span>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors">{task.title}</h3>
                         </div>
                         {isAdmin && (
                           <button onClick={() => updateData({ tasks: data.tasks.filter(t => t.id !== task.id) })} className="p-2 text-slate-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                             <Trash2 size={16} />
                           </button>
                         )}
                      </div>
                      
                      <p className="text-slate-400 text-xs italic mb-6 line-clamp-2">"{task.description}"</p>
                      
                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                         <div className="flex items-center gap-3">
                            <Clock size={14} className={isUrgent ? 'text-red-500 animate-pulse' : 'text-slate-500'} />
                            <span className={`mono text-[10px] font-bold ${isUrgent ? 'text-red-500' : 'text-slate-500'}`}>
                               DEADLINE: {task.deadline} ({daysLeft > 0 ? `${daysLeft} Hari Lagi` : 'Waktunya Habis!'})
                            </span>
                         </div>
                         <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${isUrgent ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: isUrgent ? '90%' : '30%' }}></div>
                         </div>
                      </div>
                   </div>
                 );
               })}
            </div>
          </div>

          {/* RESOURCE VAULT (RIGHT) */}
          <div className="lg:col-span-5 space-y-8">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Cpu size={20} className="text-emerald-500" />
                   <h2 className="text-xl font-black text-white uppercase italic tracking-widest">Gudang Link Sakti</h2>
                </div>
                {isAdmin && (
                  <button onClick={() => setIsAddingResource(true)} className="p-2 bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                    <Plus size={18} />
                  </button>
                )}
             </div>

             <div className="grid grid-cols-1 gap-4">
                {data.resources.map(res => (
                  <a key={res.id} href={res.link} target="_blank" rel="noopener noreferrer" className="glass-card p-5 rounded-2xl border-white/5 flex items-center justify-between group hover:bg-emerald-600/5 hover:border-emerald-500/30 transition-all">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                           <Globe size={20} />
                        </div>
                        <div>
                           <div className="mono text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">{res.category}</div>
                           <div className="text-sm font-black text-white uppercase tracking-tight">{res.title}</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        {isAdmin && (
                          <button onClick={(e) => { e.preventDefault(); updateData({ resources: data.resources.filter(r => r.id !== res.id) }); }} className="p-2 text-slate-700 hover:text-red-500"><Trash2 size={14} /></button>
                        )}
                        <ExternalLink size={16} className="text-slate-700 group-hover:text-emerald-500 transition-colors" />
                     </div>
                  </a>
                ))}
             </div>

             {/* SYSTEM LOGS MINI */}
             <div className="mt-12 glass-card rounded-3xl p-6 border-white/5 bg-black/40">
                <div className="flex items-center gap-3 mb-6">
                   <Shield size={16} className="text-blue-500" />
                   <h4 className="mono text-[10px] font-black text-white uppercase tracking-widest">Riwayat Perbaikan</h4>
                </div>
                <div className="space-y-4 max-h-48 overflow-y-auto scrollbar-hide">
                   {data.systemStatus === 'Maintenance' ? (
                     <div className="flex gap-4 animate-pulse">
                        <div className="w-1 h-10 bg-orange-500 rounded-full"></div>
                        <div>
                           <div className="mono text-[8px] text-orange-500 font-black">SEDANG_DIBENERIN</div>
                           <div className="text-[10px] text-slate-400 font-medium italic">"{data.globalAnnouncement || "Lagi beresin urusan server..."}"</div>
                        </div>
                     </div>
                   ) : (
                     <div className="text-center py-6 text-slate-700 mono text-[8px] uppercase tracking-widest">Belum ada perbaikan baru-baru ini</div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* MODAL ADD TASK */}
      {isAddingTask && (
        <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in">
           <div className="w-full max-w-lg glass-card rounded-[3rem] p-8 border-white/10 shadow-2xl">
              <h3 className="text-2xl font-black text-white uppercase italic mb-8">Tambah Tugas Baru</h3>
              <div className="space-y-6">
                 <input className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all font-bold" placeholder="JUDUL TUGAS" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
                 <div className="grid grid-cols-2 gap-4">
                    <input className="bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all font-bold uppercase text-xs" placeholder="MATA PELAJARAN" value={newTask.subject} onChange={e => setNewTask({...newTask, subject: e.target.value})} />
                    <input type="date" className="bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all font-bold uppercase text-xs" value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} />
                 </div>
                 <textarea className="w-full bg-slate-900 border border-white/5 rounded-2xl p-6 text-white outline-none focus:border-blue-500 transition-all h-24 resize-none text-sm" placeholder="Detail tugas..." value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
                 <div className="flex gap-4">
                    <button onClick={addTask} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-600/20">Kirim ke List</button>
                    <button onClick={() => setIsAddingTask(false)} className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Batal</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL ADD RESOURCE */}
      {isAddingResource && (
        <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in">
           <div className="w-full max-w-lg glass-card rounded-[3rem] p-8 border-white/10 shadow-2xl">
              <h3 className="text-2xl font-black text-white uppercase italic mb-8">Simpan Link Sakti</h3>
              <div className="space-y-6">
                 <input className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500 transition-all font-bold" placeholder="NAMA MATERI/TOOL" value={newResource.title} onChange={e => setNewResource({...newResource, title: e.target.value})} />
                 <select className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500 transition-all font-bold uppercase text-xs" value={newResource.category} onChange={e => setNewResource({...newResource, category: e.target.value as any})}>
                    <option value="Web">Web</option>
                    <option value="Cisco">Cisco</option>
                    <option value="Mikrotik">Mikrotik</option>
                    <option value="Linux">Linux</option>
                    <option value="Lainnya">Lainnya</option>
                 </select>
                 <input className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500 transition-all text-xs" placeholder="URL LINK (HTTPS://...)" value={newResource.link} onChange={e => setNewResource({...newResource, link: e.target.value})} />
                 <div className="flex gap-4">
                    <button onClick={addResource} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-600/20">Simpan ke Gudang</button>
                    <button onClick={() => setIsAddingResource(false)} className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Batal</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TaskHubPage;
