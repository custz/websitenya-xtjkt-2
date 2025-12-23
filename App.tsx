
import React from 'react';
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
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { userRole, isLoading } = useStore();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#020205] flex flex-col items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin mb-4" size={40} />
        <p className="mono text-[10px] text-slate-500 uppercase tracking-[0.5em]">Synchronizing Local Nodes...</p>
      </div>
    );
  }

  if (!userRole) {
    return <LoginPage />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#05050a] text-slate-50 flex flex-col selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/siswa" element={<StudentsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/jadwal" element={<SchedulePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/mailbox" element={<MailBoxPage />} />
          </Routes>
        </main>
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
