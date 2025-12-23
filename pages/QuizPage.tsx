
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Zap, Brain, CheckCircle2, XCircle, ChevronRight, 
  RotateCcw, Trophy, Crown, User, Heart, ShieldAlert, 
  Timer, Lock, AlertTriangle, ShieldCheck, Flame, Terminal, 
  Maximize, MonitorOff, ScanEye, ShieldX, Activity
} from 'lucide-react';
import { useStore } from '../services/store';
import { LeaderboardEntry, Question } from '../types';

const TIME_PER_QUESTION = 20; 
const MAX_WARNINGS = 2; 

const QuizPage: React.FC = () => {
  const { data, updateData, userProfile, userRole } = useStore();
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result' | 'leaderboard' | 'cheated'>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [correctCount, setCorrectCount] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);
  const [cheatReason, setCheatReason] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const isAdmin = userRole === 'admin';
  const containerRef = useRef<HTMLDivElement>(null);

  const shuffleQuestions = useCallback(() => {
    const shuffled = [...data.quizQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
  }, [data.quizQuestions]);

  // PROTOKOL LOCKDOWN V3.0
  useEffect(() => {
    if (gameState !== 'playing' || isAdmin) return;

    const triggerViolation = (reason: string) => {
      setWarnings(prev => {
        const next = prev + 1;
        if (next >= MAX_WARNINGS) {
          setCheatReason(reason);
          setGameState('cheated');
          if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        }
        return next;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) triggerViolation("Mendeteksi aktivitas luar jendela (Ganti Tab/Aplikasi).");
    };

    const handleBlur = () => {
      // Tambahkan delay sedikit untuk menghindari false positive saat transisi fullscreen
      setTimeout(() => {
        if (!document.hasFocus() && gameState === 'playing') {
          triggerViolation("Fokus sistem terputus (Membuka aplikasi lain di samping/popup).");
        }
      }, 500);
    };

    const handleResize = () => {
      // Cek jika ukuran jendela tiba-tiba mengecil secara drastis (ciri split screen)
      if (window.innerWidth < 450 || window.innerHeight < 450) {
        triggerViolation("Resolusi layar tidak standar (Mendeteksi mode Split Screen aktif).");
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && gameState === 'playing') {
        triggerViolation("Protokol Layar Penuh dimatikan secara paksa.");
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("resize", handleResize);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [gameState, isAdmin]);

  // Timer
  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && selectedOption === null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleOptionClick(-1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, selectedOption, timeLeft]);

  useEffect(() => {
    const quizStatus = localStorage.getItem(`tjkt_quiz_done_${userProfile.name}`);
    if (quizStatus === 'true') setHasFinished(true);
  }, [userProfile.name]);

  const handleStart = async () => {
    if (hasFinished && !isAdmin) return;
    
    setIsDiagnosing(true);
    
    // 1. Diagnostik Tahap 1: Cek Fokus & Dimensi Awal
    if (!document.hasFocus() && !isAdmin) {
      setCheatReason("Gagal inisialisasi: Fokus browser tidak aktif (Mendeteksi floating window).");
      setGameState('cheated');
      setIsDiagnosing(false);
      return;
    }

    // Cek apakah layar sudah terlanjur di-split
    if ((window.innerWidth < 450 || window.innerHeight < 450) && !isAdmin) {
      setCheatReason("Konfigurasi Layar Ilegal: Dimensi layar terlalu kecil untuk Workstation TJKT (Split Screen Terdeteksi).");
      setGameState('cheated');
      setIsDiagnosing(false);
      return;
    }

    // 2. Diagnostik Tahap 2: Request Fullscreen
    // Jika sedang split screen, browser biasanya akan melempar error saat minta fullscreen
    try {
      if (containerRef.current && !isAdmin) {
        await containerRef.current.requestFullscreen();
      }
      
      // Beri jeda simulasi "Scanning" biar keren
      setTimeout(() => {
        shuffleQuestions();
        setGameState('playing');
        setCurrentIdx(0);
        setScore(0);
        setCorrectCount(0);
        setWarnings(0);
        setSelectedOption(null);
        setTimeLeft(TIME_PER_QUESTION);
        setIsDiagnosing(false);
      }, 1500);

    } catch (err) {
      console.error("Lockdown Error:", err);
      setCheatReason("Security Violation: Perangkat menolak Protokol Fullscreen (Kemungkinan besar karena mode Split Screen/Popup aktif).");
      setGameState('cheated');
      setIsDiagnosing(false);
    }
  };

  const handleOptionClick = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === questions[currentIdx].correctAnswer) {
      const speedBonus = Math.floor((timeLeft / TIME_PER_QUESTION) * 100);
      setScore(prev => prev + 100 + speedBonus);
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setTimeLeft(TIME_PER_QUESTION);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: userProfile.name || "Anonim",
      image: userProfile.image || "",
      score: score,
      accuracy: accuracy,
      timestamp: "Baru saja"
    };

    const updatedLeaderboard = [...data.quizLeaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    updateData({ quizLeaderboard: updatedLeaderboard });
    localStorage.setItem(`tjkt_quiz_done_${userProfile.name}`, 'true');
    setHasFinished(true);
    setGameState('result');
  };

  const top3 = [...data.quizLeaderboard].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen pt-32 pb-40 px-4 md:px-8 bg-[#020205] relative overflow-hidden select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* HUD HEADER */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
           <div className="space-y-4">
              <div className="flex items-center gap-3 text-red-500">
                <ShieldCheck size={24} className="animate-pulse" />
                <span className="mono text-[10px] font-black uppercase tracking-[0.5em]">Markas_X_TJKT_2_Lockdown_Mode_v3.0</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
                Uji <span className="text-stroke-blue">Kejujuran</span> PC
              </h1>
           </div>
           <button 
             onClick={() => setGameState(gameState === 'leaderboard' ? 'start' : 'leaderboard')}
             className={`px-6 py-4 rounded-2xl flex items-center gap-3 transition-all ${gameState === 'leaderboard' ? 'bg-yellow-500 text-black shadow-lg' : 'glass-card border-white/10 text-slate-400 hover:text-white'}`}
           >
             <Trophy size={18} />
             <span className="text-[10px] font-black uppercase tracking-widest">Global Ranking</span>
           </button>
        </header>

        {/* MAIN INTERFACE */}
        <div className="glass-card rounded-[3rem] border-white/5 overflow-hidden shadow-2xl min-h-[600px] flex flex-col relative">
           
           {gameState === 'start' && (
             <div className="p-12 md:p-20 text-center space-y-10 flex-1 flex flex-col justify-center">
                <div className={`w-24 h-24 rounded-3xl border flex items-center justify-center mx-auto mb-8 shadow-2xl transition-all duration-500 ${isDiagnosing ? 'bg-blue-600/20 border-blue-500 animate-pulse' : 'bg-red-600/10 border-red-500/20'}`}>
                   {isDiagnosing ? <ScanEye size={48} className="text-blue-500" /> : <Lock size={48} className="text-red-500" />}
                </div>
                
                <div className="space-y-4">
                   <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">
                     {isDiagnosing ? 'Sedang Melakukan Deep Scan...' : 'Kuis Integrity V3'}
                   </h2>
                   <p className="text-slate-400 font-medium italic">
                     {isDiagnosing 
                       ? 'Memverifikasi integritas layar, dimensi jendela, dan status fokus sistem...' 
                       : 'Sistem akan memindai apakah Anda menggunakan Split Screen atau Floating Window sebelum memulai.'}
                   </p>
                </div>

                {hasFinished && !isAdmin ? (
                   <div className="animate-in zoom-in-95 bg-blue-600/5 border border-blue-500/10 p-10 rounded-[2.5rem] space-y-6 max-w-lg mx-auto">
                      <p className="text-white font-bold italic leading-relaxed text-center">
                        "Terima kasih sudah menjaga kejujuran! Kamu sudah menyelesaikan tugas kuis edisi ini."
                      </p>
                      <button onClick={() => setGameState('leaderboard')} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] transition-all border border-white/5">Liat Peringkat Kelas</button>
                   </div>
                ) : (
                  <div className="flex justify-center pt-8">
                     {!isDiagnosing && (
                       <button 
                         onClick={handleStart}
                         className="px-12 py-6 bg-red-600 hover:bg-red-500 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-red-600/20 transition-all flex items-center justify-center gap-3"
                       >
                         <Activity size={18} /> Mulai Diagnostik Keamanan
                       </button>
                     )}
                  </div>
                )}
             </div>
           )}

           {gameState === 'playing' && (
             <div className="p-8 md:p-12 space-y-10 flex-1">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                   <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                      <ScanEye size={20} className="text-blue-500" />
                      <div>
                         <span className="mono text-[7px] text-slate-500 font-black uppercase block">Integritas</span>
                         <span className="text-xs font-black text-white uppercase tracking-widest">Terpantau</span>
                      </div>
                   </div>
                   <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${warnings > 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-white/5 text-slate-500'}`}>
                         <AlertTriangle size={16} />
                      </div>
                      <div>
                         <span className="mono text-[7px] text-slate-500 font-black uppercase block">Ancaman</span>
                         <span className={`text-xs font-black ${warnings > 0 ? 'text-red-500' : 'text-white'}`}>{warnings} / {MAX_WARNINGS}</span>
                      </div>
                   </div>
                   <div className="hidden md:flex bg-black/40 p-4 rounded-2xl border border-white/5 items-center justify-between">
                      <div className="flex flex-col">
                         <span className="mono text-[7px] text-slate-500 font-black uppercase block">Sisa_Waktu</span>
                         <span className={`text-xl font-black tabular-nums ${timeLeft <= 5 ? 'text-red-500 animate-bounce' : 'text-yellow-500'}`}>{timeLeft}s</span>
                      </div>
                      <Timer className={timeLeft <= 5 ? 'text-red-500 animate-spin-slow' : 'text-slate-600'} size={24} />
                   </div>
                </div>

                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
                </div>

                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                   <div className="flex items-center gap-4">
                      <span className="text-5xl font-black text-white opacity-10 mono italic">#{currentIdx + 1}</span>
                      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight">
                        {questions[currentIdx].text}
                      </h3>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {questions[currentIdx].options.map((opt, i) => {
                        let style = "border-white/5 bg-white/5 text-slate-400";
                        if (selectedOption !== null) {
                          if (i === questions[currentIdx].correctAnswer) style = "border-emerald-500/50 bg-emerald-500/10 text-emerald-400";
                          else if (i === selectedOption) style = "border-red-500/50 bg-red-500/10 text-red-400";
                          else style = "opacity-30";
                        }
                        return (
                          <button
                            key={i}
                            disabled={selectedOption !== null}
                            onClick={() => handleOptionClick(i)}
                            className={`p-6 rounded-[2rem] border ${style} text-left transition-all font-bold uppercase tracking-tight text-sm hover:scale-[1.02] active:scale-95`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                   </div>
                </div>

                {selectedOption !== null && (
                  <div className="flex justify-end pt-4">
                     <button 
                       onClick={handleNext}
                       className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] flex items-center gap-3 shadow-xl"
                     >
                        {currentIdx === questions.length - 1 ? 'Selesaikan Misi' : 'Lanjut'}
                        <ChevronRight size={16} />
                     </button>
                  </div>
                )}
             </div>
           )}

           {gameState === 'cheated' && (
             <div className="p-12 md:p-20 text-center space-y-10 flex-1 flex flex-col justify-center animate-in zoom-in-95">
                <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mx-auto border-4 border-red-600 animate-shake">
                   <ShieldX size={48} className="text-red-600" />
                </div>
                <div className="space-y-4">
                   <h2 className="text-4xl font-black text-red-600 uppercase italic">Akses Ditolak!</h2>
                   <div className="bg-red-600/10 border border-red-500/20 p-4 rounded-2xl">
                      <p className="text-white font-black text-xs uppercase tracking-widest mb-1">Violation_Log:</p>
                      <p className="text-red-400 font-bold text-sm italic">"{cheatReason}"</p>
                   </div>
                   <p className="text-slate-400 font-medium mt-6">
                     Sistem mendeteksi percobaan kecurangan atau lingkungan yang tidak aman (Split Screen/Popup/Fokus Hilang) bahkan sebelum kuis dimulai.
                   </p>
                   <p className="mono text-[10px] text-red-500/50 font-black uppercase tracking-widest mt-8">ERROR_LOG: PRE_FLIGHT_INTEGRITY_FAIL_V3</p>
                </div>
                <div className="pt-10">
                   <button 
                     onClick={() => setGameState('start')}
                     className="px-12 py-6 bg-white/5 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest border border-white/10"
                   >
                     Reset Diagnostik
                   </button>
                </div>
             </div>
           )}

           {/* HASIL & LEADERBOARD (Tetap sama) */}
           {gameState === 'result' && (
             <div className="p-12 md:p-20 text-center space-y-10 flex-1 flex flex-col justify-center animate-in fade-in">
                <div className="relative p-10 bg-white/5 rounded-full border border-white/10 shadow-2xl flex items-center justify-center inline-block mx-auto">
                   <Trophy size={80} className="text-yellow-500" />
                </div>
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Misi Berhasil!</h2>
                <div className="text-8xl font-black text-blue-500 tracking-tighter py-6 flex items-center justify-center gap-4">
                   {score} <span className="text-2xl text-slate-800 uppercase italic">PTS</span>
                </div>
                <div className="flex justify-center">
                   <button onClick={() => setGameState('leaderboard')} className="px-12 py-6 bg-yellow-500 hover:bg-yellow-400 text-black rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all">Liat Peringkat Global</button>
                </div>
             </div>
           )}

           {gameState === 'leaderboard' && (
             <div className="p-8 md:p-12 space-y-12 flex-1 animate-in fade-in overflow-y-auto max-h-[700px]">
                <div className="text-center">
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Ranking Teknisi Terjujur</h2>
                </div>
                {/* PODIUM */}
                <div className="flex flex-col md:flex-row items-end justify-center gap-6 pt-20 pb-12">
                   {top3[0] && (
                     <div className="order-1 flex flex-col items-center z-20 w-full max-w-[160px]">
                        <div className="relative mb-8">
                           <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce-slow">
                              <Crown size={48} className="text-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,1)]" fill="currentColor" />
                           </div>
                           <div className="w-36 h-36 rounded-full border-[8px] border-yellow-500 p-1 bg-slate-900 shadow-[0_0_50px_rgba(234,179,8,0.3)] overflow-hidden">
                              {top3[0].image ? <img src={top3[0].image} className="w-full h-full object-cover" /> : <User size={60} className="text-slate-700 mx-auto mt-8" />}
                           </div>
                           <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black font-black text-lg border-4 border-[#020205]">1</div>
                        </div>
                        <div className="w-full h-40 bg-gradient-to-t from-yellow-500/10 via-yellow-500/30 to-yellow-500/50 border-x-4 border-t-4 border-yellow-500/60 rounded-t-[3rem] flex flex-col items-center justify-center p-4 text-center">
                           <span className="text-sm font-black text-white uppercase truncate w-full mb-1">{top3[0].name}</span>
                           <span className="text-3xl font-black text-yellow-500">{top3[0].score}</span>
                        </div>
                     </div>
                   )}
                </div>
                <div className="flex justify-center pt-12">
                   <button onClick={() => setGameState('start')} className="px-10 py-5 glass-card border-white/10 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all flex items-center gap-3">
                     <RotateCcw size={16} /> Kembali ke Menu
                   </button>
                </div>
             </div>
           )}
        </div>

        {/* SECURITY INFO FOOTER */}
        <div className="mt-12 flex flex-col md:flex-row gap-6 justify-center">
           <div className="glass-card p-6 rounded-3xl border-white/5 flex items-center gap-4">
              <Terminal size={20} className="text-slate-500" />
              <p className="mono text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                Encription_Protocol: AES-256-GCM <br /> Anti_Bot_Protection: ENABLED
              </p>
           </div>
           <div className="glass-card p-6 rounded-3xl border-white/5 flex items-center gap-4">
              <Flame size={20} className="text-red-500" />
              <p className="mono text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                Cheat_Detection: AI-INTEGRATED <br /> Node_Security: MAX_LEVEL
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
