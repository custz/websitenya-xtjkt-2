
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, Network, RefreshCcw, Cpu } from 'lucide-react';
import { Message } from '../types';
import { getVeliciaResponse } from '../services/geminiService';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { useStore } from '../services/store';

const VeliciaPage: React.FC = () => {
  const { data } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: `Halo! Saya **Velicia**, asisten cerdas berbasis **Zent 2.5**. Kecepatan respons saya kini jauh lebih instan. Ada kendala jaringan yang bisa saya bantu?`,
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

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.content }],
    }));

    const botReply = await getVeliciaResponse(history, input);
    
    setMessages(prev => [...prev, {
      role: 'bot',
      content: botReply,
      timestamp: new Date(),
    }]);
    setIsLoading(false);
  };

  const clearChat = () => {
    if(window.confirm("Hapus semua riwayat chat?")) {
      setMessages([{
        role: 'bot',
        content: `Sistem di-reset. Ada hal teknis lain yang ingin ditanyakan?`,
        timestamp: new Date(),
      }]);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-[#020617] overflow-hidden">
      {/* Sidebar Info - Hidden on small mobile, drawer-like on desktop */}
      <div className="hidden lg:flex w-80 xl:w-96 flex-col p-8 border-r border-slate-800 bg-slate-950/50 pt-24">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 animate-pulse">
              <Cpu size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Velicia AI</h1>
              <p className="text-blue-500 font-mono text-[10px] uppercase tracking-widest font-bold">Flash Edition 2.5</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Status Node</h4>
              <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                Online & Ready
              </div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Capabilities</h4>
              <ul className="text-slate-400 text-xs space-y-2">
                <li className="flex items-center gap-2">• Network Troubleshooting</li>
                <li className="flex items-center gap-2">• Fiber Optic Expertise</li>
                <li className="flex items-center gap-2">• Linux SysAdmin Help</li>
              </ul>
            </div>
          </div>
        </div>

        <button 
          onClick={clearChat}
          className="mt-auto flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-red-900/20 hover:text-red-400 text-slate-400 rounded-2xl transition-all border border-slate-800 font-bold text-xs uppercase tracking-widest"
        >
          <RefreshCcw size={16} />
          Wipe Memory
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative h-full pt-16 md:pt-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Cpu size={20} className="text-white" />
            </div>
            <span className="font-bold text-sm">Velicia Flash 2.5</span>
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
              placeholder="Tulis pesan teknis..."
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
            Zent 2.5 Flash Engine • v2.0-STABLE
          </p>
        </div>
      </div>
    </div>
  );
};

export default VeliciaPage;
