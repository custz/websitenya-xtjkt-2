
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider, useStore } from './services/store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StudentsPage from './pages/StudentsPage';
import GalleryPage from './pages/GalleryPage';
import SchedulePage from './pages/SchedulePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import MailBoxPage from './pages/MailBoxPage';
import GroupGeneratorPage from './pages/GroupGeneratorPage';
import TaskHubPage from './pages/TaskHubPage';
import MenfessPage from './pages/MenfessPage';
import QuizPage from './pages/QuizPage';
import { Loader2 } from 'lucide-react';

const GlobalSignature = () => (
  <div className="fixed bottom-0 left-0 right-0 z-[100] h-6 bg-black/60 backdrop-blur-md border-t border-white/5 flex items-center justify-center pointer-events-none">
     <div className="flex items-center gap-8 md:gap-20">
        <span className="mono text-[7px] text-slate-500 font-black uppercase tracking-[0.5em] animate-pulse">Developed By: Zent • Zyld • Noir</span>
        <span className="hidden md:inline mono text-[7px] text-blue-500/40 font-black uppercase tracking-[0.5em]">System Architecture v2.5.0</span>
        <span className="hidden sm:inline mono text-[7px] text-slate-500 font-black uppercase tracking-[0.5em]">Zent Tech Collective © 2024</span>
     </div>
  </div>
);

const AppContent: React.FC = () => {
  const { userRole, isLoading, data } = useStore();

  // Efek sinkronisasi status ke body class
  useEffect(() => {
    document.body.classList.remove('state-fixing', 'state-busy');
    if (data.systemStatus === 'Maintenance') document.body.classList.add('state-fixing');
    if (data.systemStatus === 'Overload') document.body.classList.add('state-busy');
  }, [data.systemStatus]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#020205] flex flex-col items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin mb-4" size={40} />
        <p className="mono text-[10px] text-slate-500 uppercase tracking-[0.5em]">Synchronizing Local Nodes...</p>
      </div>
    );
  }

  if (!userRole) {
    return (
      <>
        <LoginPage />
        <GlobalSignature />
      </>
    );
  }

  return (
    <Router>
      <div className={`min-h-screen bg-[#05050a] text-slate-50 flex flex-col selection:bg-blue-600 selection:text-white pb-6 transition-colors duration-1000 ${data.systemStatus === 'Maintenance' ? 'bg-[#0a0500]' : data.systemStatus === 'Overload' ? 'bg-[#0a0000]' : ''}`}>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/siswa" element={<StudentsPage />} />
            <Route path="/noc" element={<TaskHubPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/jadwal" element={<SchedulePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/mailbox" element={<MailBoxPage />} />
            <Route path="/groups" element={<GroupGeneratorPage />} />
            <Route path="/menfess" element={<MenfessPage />} />
            <Route path="/quiz" element={<QuizPage />} />
          </Routes>
        </main>
        <GlobalSignature />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
