
import React, { useState, useEffect } from 'react';
import { 
  Zap, Brain, CheckCircle2, XCircle, ChevronRight, 
  RotateCcw, Send, Sparkles, Terminal, Info, Trophy, 
  MessageSquare, History, ShieldAlert, BookOpenCheck
} from 'lucide-react';
import { useStore } from '../services/store';
import { QuizFeedback } from '../types';

const QuizPage: React.FC = () => {
  const { data, updateData, userProfile, userRole } = useStore();
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Feedback States
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestTopic, setSuggestTopic] = useState('');
  const [suggestText, setSuggestText] = useState('');
  const [isSent, setIsSent] = useState(false);

  const isAdmin = userRole === 'admin';
  const currentQuestion = data.quizQuestions[currentIdx];

  const handleStart = () => {
    setGameState('playing');
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const handleOptionClick = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIdx < data.quizQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setGameState('result');
    }
  };

  const sendSuggestion = () => {
    if (!suggestTopic.trim() || !suggestText.trim()) return;
    
    const feedback: QuizFeedback = {
      id: Date.now().toString(),
      userName: userProfile.name,
      topic: suggestTopic,
      suggestion: suggestText,
      timestamp: new Date().toLocaleString('id-ID')
    };

    updateData({ quizFeedbacks: [feedback, ...data.quizFeedbacks] });
    setIsSent(true);
    setSuggestTopic('');
    setSuggestText('');
    setTimeout(() => {
      setIsSent(false);
      setIsSuggesting(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen pt-32 pb-40 px-4 md:px-8 bg-[#020205] relative overflow-hidden">
      {/* BG Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* HEADER SECTION */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
           <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-500">
                <Brain size={24} className="animate-pulse" />
                <span className="mono text-[10px] font-black uppercase tracking-[0.5em]">TJKT_Skills_Assessment_V1</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
                Uji <span className="text-stroke-blue">Koneksi</span> Otak
              </h1>
           </div>
           <button 
             onClick={() => setIsSuggesting(true)}
             className="px-6 py-4 glass-card border-white/10 rounded-2xl flex items-center gap-3 text-slate-400 hover:text-white transition-all group"
           >
             <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
             <span className="text-[10px] font-black uppercase tracking-widest">Saran Materi</span>
           </button>
        </header>

        {/* MAIN INTERFACE */}
        <div className="glass-card rounded-[3rem] border-white/5 overflow-hidden shadow-2xl">
           
           {gameState === 'start' && (
             <div className="p-12 md:p-20 text-center space-y-10">
                <div className="w-24 h-24 bg-blue-600/10 rounded-3xl border border-blue-500/20 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                   <BookOpenCheck size={48} className="text-blue-500" />
                </div>
                <div className="space-y-4">
                   <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">Siap Uji Level TJKT Kamu?</h2>
                   <p className="text-slate-400 font-medium italic">Asah kemampuan dasar seputar jaringan, kabel, dan teori OSI Layer biar makin jago di lab!</p>
                </div>
                <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
                   <button 
                     onClick={handleStart}
                     className="px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                   >
                     <Zap size={18} /> Mulai Simulasi
                   </button>
                   {isAdmin && (
                     <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-[2rem] border border-white/10">
                        <History size={16} className="text-slate-600" />
                        <span className="mono text-[8px] text-slate-600 font-bold uppercase tracking-widest">Pusat Data Kuis Terpantau</span>
                     </div>
                   )}
                </div>
             </div>
           )}

           {gameState === 'playing' && (
             <div className="p-8 md:p-12 space-y-10">
                {/* Progress Bar */}
                <div className="space-y-3">
                   <div className="flex justify-between items-center px-1">
                      <span className="mono text-[9px] text-blue-500 font-black uppercase tracking-widest">Progress: {currentIdx + 1} / {data.quizQuestions.length}</span>
                      <span className="mono text-[9px] text-slate-500 font-black uppercase tracking-widest">Score: {score}</span>
                   </div>
                   <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-500" 
                        style={{ width: `${((currentIdx + 1) / data.quizQuestions.length) * 100}%` }}
                      ></div>
                   </div>
                </div>

                {/* Question Section */}
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                   <div className="flex items-start gap-6">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 text-xl font-black italic text-blue-500">
                        {currentIdx + 1}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight">
                        {currentQuestion.text}
                      </h3>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentQuestion.options.map((opt, i) => {
                        let borderColor = "border-white/5";
                        let bgColor = "bg-white/5";
                        let textColor = "text-slate-400";
                        
                        if (selectedOption !== null) {
                          if (i === currentQuestion.correctAnswer) {
                            borderColor = "border-emerald-500/50";
                            bgColor = "bg-emerald-500/10";
                            textColor = "text-emerald-400";
                          } else if (i === selectedOption) {
                            borderColor = "border-red-500/50";
                            bgColor = "bg-red-500/10";
                            textColor = "text-red-400";
                          } else {
                            textColor = "text-slate-700";
                          }
                        }

                        return (
                          <button
                            key={i}
                            disabled={selectedOption !== null}
                            onClick={() => handleOptionClick(i)}
                            className={`p-6 rounded-[1.8rem] border ${borderColor} ${bgColor} ${textColor} text-left transition-all group flex items-center justify-between hover:scale-[1.02] active:scale-95`}
                          >
                            <span className="font-bold uppercase tracking-tight">{opt}</span>
                            {selectedOption !== null && i === currentQuestion.correctAnswer && <CheckCircle2 size={18} className="shrink-0" />}
                            {selectedOption !== null && i === selectedOption && i !== currentQuestion.correctAnswer && <XCircle size={18} className="shrink-0" />}
                          </button>
                        );
                      })}
                   </div>
                </div>

                {showExplanation && (
                  <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-[2rem] animate-in zoom-in-95 flex items-start gap-4">
                     <Info className="text-blue-500 shrink-0 mt-1" size={18} />
                     <div className="space-y-1">
                        <span className="mono text-[8px] text-blue-500 font-black uppercase tracking-widest">Lab_Notes:</span>
                        <p className="text-sm text-slate-300 italic font-medium leading-relaxed">{currentQuestion.explanation}</p>
                     </div>
                  </div>
                )}

                {selectedOption !== null && (
                  <div className="flex justify-end">
                     <button 
                       onClick={handleNext}
                       className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl"
                     >
                        {currentIdx === data.quizQuestions.length - 1 ? 'Liat Hasil' : 'Soal Berikutnya'}
                        <ChevronRight size={16} strokeWidth={3} />
                     </button>
                  </div>
                )}
             </div>
           )}

           {gameState === 'result' && (
             <div className="p-12 md:p-20 text-center space-y-10 animate-in fade-in zoom-in-95">
                <div className="relative mb-8 inline-block">
                   <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
                   <div className="relative p-10 bg-white/5 rounded-full border border-white/10 shadow-2xl flex items-center justify-center">
                      <Trophy size={80} className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                   </div>
                </div>
                
                <div className="space-y-2">
                   <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Simulasi Selesai!</h2>
                   <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Skor Akhir Kamu</p>
                </div>

                <div className="text-8xl font-black text-blue-500 tracking-tighter py-6 flex items-center justify-center gap-4">
                   {Math.round((score / data.quizQuestions.length) * 100)}
                   <span className="text-2xl text-slate-800 uppercase italic">Points</span>
                </div>

                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 max-w-sm mx-auto flex items-center justify-between">
                   <div className="text-left">
                      <div className="mono text-[8px] text-emerald-500 font-bold uppercase">Benar</div>
                      <div className="text-xl font-black text-white">{score}</div>
                   </div>
                   <div className="w-1 h-8 bg-white/10 rounded-full"></div>
                   <div className="text-right">
                      <div className="mono text-[8px] text-red-500 font-black uppercase">Salah</div>
                      <div className="text-xl font-black text-white">{data.quizQuestions.length - score}</div>
                   </div>
                </div>

                <div className="pt-10 flex flex-col md:flex-row gap-4 justify-center">
                   <button 
                     onClick={handleStart}
                     className="px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3"
                   >
                     <RotateCcw size={18} /> Coba Lagi
                   </button>
                   <button 
                     onClick={() => setIsSuggesting(true)}
                     className="px-12 py-6 glass-card border-white/10 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                   >
                     <Sparkles size={18} className="text-blue-500" /> Usul Materi Baru
                   </button>
                </div>
             </div>
           )}
        </div>

        {/* FEEDBACK LIST FOR ADMIN */}
        {isAdmin && data.quizFeedbacks.length > 0 && (
          <div className="mt-20 space-y-8 animate-in slide-in-from-bottom-8">
             <div className="flex items-center gap-4">
                <Terminal size={20} className="text-blue-500" />
                <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">Inbox Usulan Materi</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.quizFeedbacks.map(f => (
                  <div key={f.id} className="glass-card p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{f.userName}</span>
                           <span className="mono text-[8px] text-slate-500 font-bold uppercase">{f.timestamp}</span>
                        </div>
                        <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[7px] font-black text-white uppercase tracking-widest">Idea_Node</div>
                     </div>
                     <div className="space-y-3">
                        <h4 className="text-white font-black uppercase italic tracking-tight">{f.topic}</h4>
                        <p className="text-slate-400 text-xs italic leading-relaxed">"{f.suggestion}"</p>
                     </div>
                     <button 
                       onClick={() => updateData({ quizFeedbacks: data.quizFeedbacks.filter(x => x.id !== f.id) })}
                       className="mt-6 text-[8px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-colors"
                     >
                       Selesaikan Masalah
                     </button>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* SUGGESTION MODAL */}
      {isSuggesting && (
        <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in">
           <div className="w-full max-w-lg glass-card rounded-[3.5rem] p-10 border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <Sparkles size={20} className="text-blue-500" />
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Usulan Materi</h3>
                </div>
                <button onClick={() => setIsSuggesting(false)} className="p-2 text-slate-500 hover:text-white transition-colors"><XCircle size={28} /></button>
              </div>

              {isSent ? (
                <div className="py-20 text-center space-y-6 animate-in zoom-in-95">
                   <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                      <CheckCircle2 size={40} className="text-emerald-500" />
                   </div>
                   <p className="text-white font-black uppercase tracking-widest text-sm">Ide Kamu Sudah Terkirim!</p>
                   <p className="text-slate-500 text-xs italic">Admin bakal segera eksekusi buat jadi soal baru.</p>
                </div>
              ) : (
                <div className="space-y-6">
                   <p className="text-slate-500 text-xs italic leading-relaxed mb-4">"Mau kuis materi apa lagi nih? Crimping? Konfigurasi Router? Atau Mikrotik? Tulis ide kamu di bawah!"</p>
                   
                   <div className="space-y-2">
                      <label className="mono text-[9px] font-black text-blue-500 uppercase tracking-widest ml-1">Topik Utama</label>
                      <input 
                        className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-blue-500/50 uppercase text-xs"
                        placeholder="Misal: VLAN atau MIKROTIK"
                        value={suggestTopic}
                        onChange={(e) => setSuggestTopic(e.target.value)}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="mono text-[9px] font-black text-blue-500 uppercase tracking-widest ml-1">Ide / Contoh Soal</label>
                      <textarea 
                        className="w-full bg-slate-900 border border-white/5 rounded-[2rem] p-6 text-white outline-none focus:border-blue-500/50 h-32 resize-none text-sm placeholder:text-slate-700 font-medium" 
                        placeholder="Jelasin dikit dong materinya atau kasih contoh soalnya..." 
                        value={suggestText} 
                        onChange={(e) => setSuggestText(e.target.value)} 
                      />
                   </div>

                   <button 
                     onClick={sendSuggestion}
                     disabled={!suggestTopic.trim() || !suggestText.trim()}
                     className="w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all shadow-2xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3"
                   >
                     <Send size={16} /> Kirim ke Admin
                   </button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
