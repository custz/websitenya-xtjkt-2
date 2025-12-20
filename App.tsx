
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider, useStore } from './services/store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StudentsPage from './pages/StudentsPage';
import GalleryPage from './pages/GalleryPage';
import SchedulePage from './pages/SchedulePage';
import LoginPage from './pages/LoginPage';

const AppContent: React.FC = () => {
  const { userRole } = useStore();

  if (!userRole) {
    return <LoginPage />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/siswa" element={<StudentsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/jadwal" element={<SchedulePage />} />
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
