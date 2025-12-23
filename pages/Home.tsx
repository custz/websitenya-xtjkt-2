
import React, { useState, useEffect, useRef } from 'react';
import Hero from '../components/Hero';
import { Activity, Cpu, Globe, Database, ShieldAlert, Cpu as Processor, Terminal, AlertTriangle, Construction, Zap, Info } from 'lucide-react';
import { useStore } from '../services/store';

const StatBox = ({ icon: Icon, label, value, color, status }: any) => (
  <div className={`glass-card p-6 rounded-3xl border-white/5 flex items-center gap-5 group hover:border-blue-500/30 transition-all ${status === 'Overload' ? 'animate-pulse border-red-500/20' : ''}`}>
    <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-current group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,0,0,0.3)]`}>
      <Icon size={24} />
    </div>
    <div>
      <div className="mono text-[8px] text-slate-500 font-bold uppercase tracking-[0.3em] mb-1">{label}</div>
      <div className={`text-xl font-black text-white tech-font ${status === 'Overload' && color === 'text-red-500' ? 'busy-text-glitch' : ''}`}>{value}</div>
    </div>
  </div>
);

const Home: React.FC = () => {
  const { data } = useStore();
  const [traffic, setTraffic] = useState("1.2 GB/s");
  const [logs, setLogs] = useState<string[]>(["[SISTEM] Nyalain Protokol Elite...", "[JARINGAN] Koneksi aman jaya.", "[USER] Ada warga baru mampir."]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const i = setInterval(() => {
      // Traffic Reaction
      let multiplier = 1;
      if (data.systemStatus === 'Maintenance') multiplier = 0.3;
      if (data.systemStatus === 'Overload') multiplier = 5.8;
      setTraffic((Math.random() * multiplier + 0.5).toFixed(1) + " GB/s");
      
      // Update Logs based on status
      const logOptions = [
        `[IP] Nyoba konek ke node ${Math.floor(Math.random() * 255)}...`,
        `[SISTEM] Scan data beres.`,
        `[LOG] Warga ${['Fariz', 'Melvina', 'Irfan', 'Zyldan', 'Razib'][Math.floor(Math.random() * 5)]} lagi aktif.`,
        `[SECURITY] Pertahanan aman.`
      ];
      
      if (data.systemStatus === 'Maintenance') {
        logOptions.push("[ADUH] Jalur data lagi dibenerin...");
        logOptions.push("[FIX] Optimasi database dulu ya...");
      }
      if (data.systemStatus === 'Overload') {
        logOptions.push("[ERROR] Latensi tinggi banget nih!");
        logOptions.push("[PENTING] Otak server lagi panas (90%+)!");
        logOptions.push("[INFO] Bagi beban ke node cadangan...");
      }

      setLogs(prev => [...prev.slice(-12), logOptions[Math.floor(Math.random() * logOptions.length)]]);
    }, 2500);
    return () => clearInterval(i);
  }, [data.systemStatus]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const getThemeColors = () => {
    switch(data.systemStatus) {
      case 'Maintenance': return { glow: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/30', accent: 'orange' };
      case 'Overload': return { glow: 'bg-red-500/15', text: 'text-red-500', border: 'border-red-500/30', accent: 'red' };
      default: return { glow: 'bg-blue-600/5', text: 'text-blue-500', border: 'border-blue-500/30', accent: 'blue' };
    }
  };

  const theme = getThemeColors();

  return (
    <div className="min-h-screen relative">
      {/* Background Dynamic Glows */}
      <div className={`fixed top-0 left-0 w-full h-full pointer-events-none transition-colors duration-1000 ${theme.glow} z-0`}></div>
      
      <div className="relative z-10">
        <Hero />
        
        <div className="max-w-7xl mx-auto px-6 py-20">
          {data.systemStatus !== 'Normal' && (
            <div className={`mb-12 p-8 rounded-[3rem] ${theme.glow} border ${theme.border} backdrop-blur-3xl flex flex-col md:flex-row items-center gap-8 animate-in slide-in-from-top-10 duration-700 shadow-2xl`}>
               <div className={`w-20 h-20 shrink-0 rounded-[1.5rem] ${theme.glow} flex items-center justify-center ${theme.text} border ${theme.border} shadow-inner`}>
                  {data.systemStatus === 'Maintenance' ? <Construction size={40} className="animate-spin-slow" /> : <AlertTriangle size={40} className="animate-bounce" />}
               </div>
               <div className="flex-1 text-center md:text-left">
                  <h3 className={`text-2xl font-black uppercase tracking-tighter ${theme.text} mb-2`}>
                    {data.systemStatus === 'Maintenance' ? 'Lagi Dibenerin Dulu' : 'Waduh, Lagi Rame Banget!'}
                  </h3>
                  <p className="text-slate-400 text-sm font-medium italic leading-relaxed">
                    {data.systemStatus === 'Maintenance' 
                      ? "Admin lagi bersih-bersih server sebentar. Koneksi mungkin agak lemot, tapi tenang aja bakal cepet beres kok!" 
                      : "Website lagi diakses banyak warga kelas nih! Kita lagi usahain biar tetep stabil dan gak nge-lag."}
                  </p>
               </div>
               <div className="flex gap-4">
                  <div className={`px-6 py-3 rounded-full border ${theme.border} mono text-[10px] font-black ${theme.text} uppercase tracking-widest`}>
                    {data.systemStatus === 'Maintenance' ? 'VERSI: FIXING' : 'PING: 240ms'}
                  </div>
               </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatBox icon={Activity} label="Lalu Lintas Data" value={traffic} color={theme.text} status={data.systemStatus} />
            <StatBox icon={Database} label="Gudang Data" value="982.5 GB" color="text-emerald-500" />
            <StatBox icon={Processor} label="Otak Server" value={data.systemStatus === 'Overload' ? '92%' : data.systemStatus === 'Maintenance' ? '45%' : '14%'} color={data.systemStatus === 'Overload' ? 'text-red-500' : 'text-purple-500'} status={data.systemStatus} />
            <StatBox icon={ShieldAlert} label="Status Aman?" value={data.systemStatus === 'Maintenance' ? 'Lagi Cek...' : 'Aman Jaya'} color="text-rose-500" />
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8`}>
            {/* LIVE LOGS VISUALIZER */}
            <div className={`lg:col-span-2 glass-card rounded-[2.5rem] ${theme.border} overflow-hidden shadow-2xl group`}>
               <div className="px-8 py-5 bg-white/5 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Terminal size={16} className={theme.text} />
                     <span className="mono text-[10px] font-black text-white uppercase tracking-widest">Catatan_Sistem_Live</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="hidden sm:flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="mono text-[8px] text-slate-500 uppercase">Live_Update</span>
                     </div>
                     <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500/20 border border-orange-500/30"></div>
                        <div className={`w-2.5 h-2.5 rounded-full ${data.systemStatus === 'Normal' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : data.systemStatus === 'Maintenance' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'} animate-pulse`}></div>
                     </div>
                  </div>
               </div>
               <div 
                 ref={logContainerRef}
                 className={`p-8 h-64 overflow-y-auto bg-black/60 mono text-[10px] ${data.systemStatus === 'Normal' ? 'text-blue-400' : data.systemStatus === 'Maintenance' ? 'text-orange-400' : 'text-red-400'} space-y-3 scrollbar-hide`}
               >
                  {logs.map((log, idx) => (
                    <div key={idx} className="flex gap-6 animate-in fade-in slide-in-from-left-4 duration-300">
                       <span className="opacity-30 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                       <span className={`font-medium ${log.includes('ERROR') || log.includes('PENTING') ? 'font-bold' : ''}`}>{log}</span>
                    </div>
                  ))}
                  <div className="animate-pulse">_</div>
               </div>
            </div>

            {/* QUICK INFO HUD */}
            <div className="glass-card rounded-[2.5rem] p-8 border-white/5 shadow-2xl flex flex-col justify-between">
               <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-8">
                     <Zap size={20} className="text-yellow-500" />
                     <h4 className="text-sm font-black text-white uppercase tracking-widest">Pantauan Jaringan</h4>
                  </div>
                  <div className="space-y-4">
                     {[
                       { label: "Cara Konek", val: "TCP/X-ELITE", icon: Globe },
                       { label: "Lokasi", val: "Markas-TJKT-2", icon: Info },
                       { label: "Status", val: data.systemStatus === 'Maintenance' ? 'FIXING' : data.systemStatus.toUpperCase(), icon: Activity }
                     ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                          <item.icon size={14} className="text-slate-600" />
                          <div className="text-right">
                             <div className="text-[8px] text-slate-500 font-bold uppercase mb-0.5">{item.label}</div>
                             <div className="text-[10px] text-white font-black">{item.val}</div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="mt-8 pt-6 border-t border-white/5">
                  <div className={`text-center mono text-[9px] font-black ${theme.text} animate-pulse`}>
                    // SISTEM_DIJAGA_ZENT_TECH
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
