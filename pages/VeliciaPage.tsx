
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, Network, RefreshCcw } from 'lucide-react';
import { Message } from '../types';
import { getVeliciaResponse } from '../services/geminiService';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { useStore } from '../services/store';

const VeliciaPage: React.FC = () => {
  const { data } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: `Halo! Saya **Velicia**, asisten cerdas ${data.brandName}. Ada yang bisa saya bantu seputar jaringan komputer atau telekomunikasi hari ini?`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
    setMessages([{
      role: 'bot',
      content: `Halo! Saya **Velicia**, asisten cerdas ${data.brandName}. Ada yang bisa saya bantu?`,
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="h-screen pt-20 flex flex-col md:flex-row bg-[#020617] overflow-hidden">
      {/* Sidebar Info - Left Column (Desktop) */}
      <div className="hidden md:flex w-1/3 flex-col p-8 border-r border-slate-800 bg-slate-950/50">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Bot size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Velicia</h1>
              <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">By Zent</p>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed mb-6">
            Asisten virtual khusus jurusan TJKT yang dilatih untuk memahami topologi, protokol, dan infrastruktur digital.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <Network className="text-blue-500" size={20} />
              <span className="text-sm font-medium">Expert: Networking</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <Sparkles className="text-purple-500" size={20} />
              <span className="text-sm font-medium">Model: Gemini Ultra 3.0</span>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <button 
            onClick={clearChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition-all border border-slate-800 shadow-lg"
          >
            <RefreshCcw size={18} />
            Reset Percakapan
          </button>
        </div>
      </div>

      {/* Main Chat Area - Right Column */}
      <div className="flex-1 flex flex-col relative h-full">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 pb-40"
        >
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800 border border-slate-700'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} className="text-blue-400" />}
              </div>
              <div className={`max-w-[85%] md:max-w-[70%] p-5 rounded-3xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-900/80 border border-slate-800 text-slate-200 rounded-tl-none shadow-xl'
              }`}>
                <MarkdownRenderer content={msg.content} />
                <span className={`block text-[10px] mt-3 opacity-40 uppercase font-mono ${msg.role === 'user' ? 'text-right' : ''}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <Loader2 size={20} className="text-blue-400 animate-spin" />
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl rounded-tl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-slate-700 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-700 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-slate-700 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
          <div className="max-w-4xl mx-auto relative mb-6">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanyakan sesuatu tentang jaringan..."
              className="w-full bg-slate-900 border border-slate-700 text-white pl-6 pr-16 py-5 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xl"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-600 uppercase tracking-[0.2em] mb-4">
            Velicia AI v1.0 • Powered by Zent Tech Labs
          </p>
        </div>
      </div>
    </div>
  );
};

export default VeliciaPage;
