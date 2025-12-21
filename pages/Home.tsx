
import React from 'react';
import Hero from '../components/Hero';
import { Network, Server, ShieldCheck, Terminal, Globe } from 'lucide-react';
import { useStore } from '../services/store';

const AestheticFeature = () => {
  const { data, updateData, isEditMode } = useStore();

  const handleFeatureUpdate = (index: number, field: 'title' | 'desc', value: string) => {
    const newFeatures = [...data.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    updateData({ features: newFeatures });
  };

  const icons = [<Server size={32} />, <ShieldCheck size={32} />, <Globe size={32} />];
  const colors = ["text-blue-500", "text-purple-500", "text-emerald-500"];

  return (
    <section className="py-32 bg-[#05050a] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-24 space-y-4">
          {isEditMode ? (
            <input 
              className="bg-transparent border-b border-blue-500/30 text-center mono text-[10px] text-blue-500 font-black tracking-[0.5em] uppercase focus:outline-none w-full max-w-md"
              value={data.featuresSubtitle}
              onChange={(e) => updateData({ featuresSubtitle: e.target.value })}
            />
          ) : (
            <div className="mono text-[10px] text-blue-500 font-black tracking-[0.5em] uppercase">{data.featuresSubtitle}</div>
          )}

          {isEditMode ? (
            <input 
              className="bg-transparent border-b border-white/10 text-center text-5xl md:text-7xl font-black text-white tracking-tighter uppercase focus:outline-none w-full max-w-2xl"
              value={data.featuresTitle}
              onChange={(e) => updateData({ featuresTitle: e.target.value })}
            />
          ) : (
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">
              {data.featuresTitle.split(' ').map((word, i, arr) => (
                <span key={i}>
                  {i === arr.length - 1 ? <span className="text-stroke-blue">{word}</span> : word + ' '}
                </span>
              ))}
            </h2>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {data.features.map((feature, i) => (
            <div key={i} className="group p-10 glass-card rounded-[3rem] hover:glow-blue transition-all duration-700">
              <div className={`mb-8 p-5 bg-white/5 rounded-[2rem] inline-block ${colors[i]} group-hover:scale-110 transition-transform duration-500`}>
                {icons[i]}
              </div>
              
              {isEditMode ? (
                <div className="space-y-4">
                  <input 
                    className="w-full bg-transparent border-b border-white/10 text-2xl font-black text-white uppercase tracking-tighter focus:outline-none"
                    value={feature.title}
                    onChange={(e) => handleFeatureUpdate(i, 'title', e.target.value)}
                  />
                  <textarea 
                    className="w-full bg-transparent border border-white/5 rounded-xl p-2 text-slate-400 font-medium leading-relaxed italic focus:outline-none resize-none h-24 text-sm"
                    value={feature.desc}
                    onChange={(e) => handleFeatureUpdate(i, 'desc', e.target.value)}
                  />
                </div>
              ) : (
                <>
                  <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">{feature.title}</h4>
                  <p className="text-slate-400 font-medium leading-relaxed italic">{feature.desc}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const QuoteSection = () => {
  const { data, updateData, isEditMode } = useStore();

  return (
    <section className="py-40 relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-blue-600/5 blur-[120px]"></div>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <span className="text-6xl text-blue-500 font-serif opacity-30 mb-8 block">"</span>
        
        {isEditMode ? (
          <textarea 
            className="w-full bg-transparent border border-white/5 rounded-3xl p-6 text-2xl md:text-4xl italic font-extralight text-slate-200 leading-[1.3] tracking-tight focus:outline-none h-64 text-center"
            value={data.quoteText}
            onChange={(e) => updateData({ quoteText: e.target.value })}
          />
        ) : (
          <blockquote className="text-3xl md:text-5xl italic font-extralight text-slate-200 leading-[1.3] tracking-tight">
            {data.quoteText}
          </blockquote>
        )}

        <div className="mt-12 flex flex-col items-center">
          <div className="w-12 h-px bg-blue-500 mb-6"></div>
          {isEditMode ? (
            <input 
              className="bg-transparent border-b border-white/10 text-center font-black text-white uppercase tracking-[0.4em] text-xs focus:outline-none w-64"
              value={data.quoteAuthor}
              onChange={(e) => updateData({ quoteAuthor: e.target.value })}
            />
          ) : (
            <p className="font-black text-white uppercase tracking-[0.4em] text-xs">{data.quoteAuthor}</p>
          )}
        </div>
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#05050a]">
      <Hero />
      <AestheticFeature />
      <QuoteSection />
      
      {/* Decorative Footer Spacer */}
      <div className="h-64 bg-gradient-to-t from-[#05050a] to-transparent"></div>
    </div>
  );
};

export default Home;
