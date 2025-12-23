
import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { Activity, Cpu, Globe, Database, ShieldAlert, Cpu as Processor } from 'lucide-react';
import { useStore } from '../services/store';

const StatBox = ({ icon: Icon, label, value, color }: any) => (
  <div className="glass-card p-6 rounded-3xl border-white/5 flex items-center gap-5 group hover:border-blue-500/30 transition-all">
    <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-current group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <div>
      <div className="mono text-[8px] text-slate-500 font-bold uppercase tracking-[0.3em] mb-1">{label}</div>
      <div className="text-xl font-black text-white tech-font">{value}</div>
    </div>
  </div>
);

const Home: React.FC = () => {
  const [traffic, setTraffic] = useState("1.2 GB/s");
  
  useEffect(() => {
    const i = setInterval(() => {
      setTraffic((Math.random() * 2 + 0.5).toFixed(1) + " GB/s");
    }, 2000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="min-h-screen bg-[#020205]">
      <Hero />
      
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox icon={Activity} label="Bandwidth usage" value={traffic} color="text-blue-500" />
          <StatBox icon={Database} label="Stored Packets" value="45.2 TB" color="text-emerald-500" />
          <StatBox icon={Processor} label="CPU Load" value="12%" color="text-purple-500" />
          <StatBox icon={ShieldAlert} label="Threat Level" value="None" color="text-rose-500" />
        </div>
      </div>

      <section className="py-20 relative px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
           <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
             Engineered to <span className="text-stroke-blue">Connect</span>
           </h2>
           <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl mx-auto italic">
             "Kami di TJKT tidak hanya belajar cara menghubungkan kabel, tapi cara menghubungkan ide, manusia, dan masa depan melalui protokol teknologi."
           </p>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center px-6">
         <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-500 mb-4">
              <Cpu size={16} />
            </div>
            <p className="mono text-[8px] text-slate-600 font-bold uppercase tracking-[0.5em]">
              Deployed on Vercel Edge Network v2.5
            </p>
         </div>
      </footer>
    </div>
  );
};

export default Home;
