
import React from 'react';
import Hero from '../components/Hero';
import { Network, Server, ShieldCheck, Terminal } from 'lucide-react';

const QuickStats = () => (
  <section className="py-20 bg-slate-950">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Server size={24} className="text-blue-500" />, label: "Infrastruktur", val: "Enterprise" },
          { icon: <ShieldCheck size={24} className="text-emerald-500" />, label: "Keamanan", val: "Tingkat Tinggi" },
          { icon: <Terminal size={24} className="text-purple-500" />, label: "Administrasi", val: "Modern" }
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 flex items-center gap-6">
            <div className="p-4 bg-slate-800 rounded-2xl">{stat.icon}</div>
            <div>
              <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">{stat.label}</p>
              <h4 className="text-xl font-bold">{stat.val}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Home: React.FC = () => {
  return (
    <div className="min-h-screen pb-32">
      <Hero />
      <QuickStats />
      
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <blockquote className="text-3xl italic font-light text-slate-300 leading-snug">
            "Kabel mungkin menghubungkan perangkat, namun gairah untuk teknologi-lah yang menghubungkan masa depan. X TJKT 2 bukan sekadar kelas, ia adalah keluarga digital."
          </blockquote>
          <p className="mt-8 font-bold text-blue-500 uppercase tracking-widest">— Zent, Lead Developer</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
