
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, Network, RefreshCcw, Cpu, Plus, Trash2 } from 'lucide-react';
import { Message } from '../types';
import { getVeliciaResponse } from '../services/geminiService';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { useStore } from '../services/store';

const VeliciaPage: React.FC = () => {
  const { data, updateData, isEditMode } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: data.veliciaIntro,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userMessage: Message = {
      role: 'user',
      content: userText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.content }],
    }));

    try {
      const botReply = await getVeliciaResponse(history, userText);
      
      setMessages(prev => [...prev, {
        role: 'bot',
        content: botReply,
        timestamp: new Date(),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "⚠️ Maaf banget, sistem lagi rada error nih.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if(window.confirm("Hapus semua obrolan kita?")) {
      setMessages([{
        role: 'bot',
        content: `Udah bersih ya! Ada yang mau ditanyain lagi?`,
        timestamp: new Date(),
      }]);
    }
  };

  const updateExpertise = (index: number, value: string) => {
    const newItems = [...data.veliciaExpertiseItems];
    newItems[index] = value;
    updateData({ veliciaExpertiseItems: newItems });
  };

  const addExpertise = () => {
    updateData({ veliciaExpertiseItems: [...data.veliciaExpertiseItems, "Keahlian Baru"] });
  };

  const removeExpertise = (index: number) => {
    updateData({ veliciaExpertiseItems: data.veliciaExpertiseItems.filter((_, i) => i !== index) });
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-[#020617] overflow-hidden">
      {/* Sidebar Info */}
      <div className="hidden lg:flex w-80 xl:w-96 flex-col p-8 border-r border-slate-800 bg-slate-950/50 pt-24">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 animate-pulse">
              <Cpu size={28} className="text-white" />
            </div>
            <div className="flex flex-col flex-1">
              {isEditMode ? (
                <input 
                  className="bg-transparent border-b border-white/10 text-2xl font-bold tracking-tight text-white focus:outline-none"
                  value={data.veliciaSidebarTitle}
                  onChange={(e) => updateData({ veliciaSidebarTitle: e.target.value })}
                />
              ) : (
                <h1 className="text-2xl font-bold tracking-tight text-white">{data.veliciaSidebarTitle}</h1>
              )}
              {isEditMode ? (
                <input 
                  className="bg-transparent border-b border-blue-500/30 text-blue-500 font-mono text-[10px] uppercase tracking-widest font-bold focus:outline-none mt-1"
                  value={data.veliciaSidebarSubtitle}
                  onChange={(e) => updateData({ veliciaSidebarSubtitle: e.target.value })}
                />
              ) : (
                <p className="text-blue-500 font-mono text-[10px] uppercase tracking-widest font-bold">{data.veliciaSidebarSubtitle}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
              {isEditMode ? (
                <input 
                  className="bg-transparent border-b border-white/10 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 focus:outline-none w-full"
                  value={data.veliciaStatusLabel}
                  onChange={(e) => updateData({ veliciaStatusLabel: e.target.value })}
                />
              ) : (
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{data.veliciaStatusLabel}</h4>
              )}
              <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                {isEditMode ? (
                  <input 
                    className="bg-transparent border-b border-emerald-500/30 focus:outline-none w-full"
                    value={data.veliciaStatusValue}
                    onChange={(e) => updateData({ veliciaStatusValue: e.target.value })}
                  />
                ) : (
                  data.veliciaStatusValue
                )}
              </div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
              {isEditMode ? (
                <div className="flex justify-between items-center mb-2">
                  <input 
                    className="bg-transparent border-b border-white/10 text-xs font-bold text-slate-500 uppercase tracking-widest focus:outline-none w-full"
                    value={data.veliciaExpertiseLabel}
                    onChange={(e) => updateData({ veliciaExpertiseLabel: e.target.value })}
                  />
                  <button onClick={addExpertise} className="text-blue-500 hover:text-blue-400 p-1">
                    <Plus size={14} />
                  </button>
                </div>
              ) : (
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{data.veliciaExpertiseLabel}</h4>
              )}
              <ul className="text-slate-400 text-xs space-y-2">
                {data.veliciaExpertiseItems.map((item, i) => (
                  <li key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <span>•</span>
                      {isEditMode ? (
                        <input 
                          className="bg-transparent border-b border-slate-800 focus:outline-none focus:border-blue-500/50 w-full"
                          value={item}
                          onChange={(e) => updateExpertise(i, e.target.value)}
                        />
                      ) : (
                        <span>{item}</span>
                      )}
                    </div>
                    {isEditMode && (
                      <button onClick={() => removeExpertise(i)} className="text-red-500 opacity-0 group-hover:opacity-100 p-1">
                        <Trash2 size={12} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <button 
          onClick={clearChat}
          className="mt-auto flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-red-900/20 hover:text-red-400 text-slate-400 rounded-2xl transition-all border border-slate-800 font-bold text-xs uppercase tracking-widest"
        >
          <RefreshCcw size={16} />
          Lupain Obrolan
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative h-full pt-16 md:pt-0">
        {/* Intro Edit View (Admin Only) */}
        {isEditMode && (
          <div className="p-4 bg-blue-600/5 border-b border-white/5 mx-4 mt-4 rounded-2xl">
            <label className="block text-[8px] font-black uppercase text-blue-500 tracking-widest mb-1">Bot Initial Message</label>
            <textarea 
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none h-20"
              value={data.veliciaIntro}
              onChange={(e) => updateData({ veliciaIntro: e.target.value })}
            />
          </div>
        )}

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Cpu size={20} className="text-white" />
            </div>
            <span className="font-bold text-sm">{data.veliciaSidebarTitle}</span>
          </div>
          <button onClick={clearChat} className="p-2 text-slate-500 hover:text-white transition-colors">
            <RefreshCcw size={18} />
          </button>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 md:space-y-8 pb-32 md:pb-40"
        >
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex items-start gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-slate-800 border border-slate-700'
              }`}>
                {msg.role === 'user' ? <User size={16} className="md:size-5" /> : <Bot size={16} className="text-blue-400 md:size-5" />}
              </div>
              <div className={`max-w-[88%] md:max-w-[75%] p-4 md:p-6 rounded-2xl md:rounded-3xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-xl' 
                  : 'bg-slate-900/80 border border-slate-800 text-slate-200 rounded-tl-none shadow-xl backdrop-blur-sm'
              }`}>
                <div className="text-sm md:text-base">
                  <MarkdownRenderer content={msg.content} />
                </div>
                <span className={`block text-[9px] mt-3 opacity-40 uppercase font-mono font-bold tracking-tighter ${msg.role === 'user' ? 'text-right' : ''}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <Loader2 size={20} className="text-blue-400 animate-spin" />
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl rounded-tl-none">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanya apa aja ke Velicia..."
              className="relative w-full bg-slate-900 border border-white/10 text-white pl-5 md:pl-6 pr-14 md:pr-16 py-4 md:py-5 rounded-2xl focus:outline-none focus:border-blue-500/50 shadow-2xl text-sm md:text-base"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 p-2.5 md:p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              <Send size={18} className="md:size-5" />
            </button>
          </div>
          <p className="text-center text-[9px] text-slate-600 uppercase tracking-[0.3em] mt-4 font-bold hidden md:block">
            Bicara Sama {data.veliciaSidebarTitle} v2.1
          </p>
        </div>
      </div>
    </div>
  );
};

export default VeliciaPage;
