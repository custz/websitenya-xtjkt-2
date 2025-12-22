
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteData, UserRole, UserProfile } from '../types';

interface StoreContextType {
  data: SiteData;
  updateData: (newData: Partial<SiteData>) => void;
  importData: (jsonString: string) => boolean;
  resetToDefault: () => void;
  isEditMode: boolean;
  setEditMode: (val: boolean) => void;
  showNav: boolean;
  setShowNav: (val: boolean) => void;
  userRole: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
  userProfile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
}

const defaultData: SiteData = {
  brandName: "X TJKT 2 ELITE",
  navbarSubtitle: "Network Engineers & Tech Enthusiasts",
  heroBadge: "Digital Portfolio / v2.5",
  heroTitle: "Building The Digital Future Together",
  heroDescription: "Kami bukan sekadar barisan kode atau tumpukan kabel. Kami adalah X TJKT 2, sekumpulan inovator muda yang siap menghubungkan dunia melalui teknologi jaringan dan telekomunikasi.",
  heroImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800&h=600",
  heroFloatingText: "TJKT",
  stats: { students: "41", subjects: "12", uptime: "100%" },
  statLabels: { students: "Engineers", subjects: "Lab Projects", uptime: "Connection", version: "Tech Stack" },
  students: [
    { id: '1', role: "Wali Kelas", name: "Ibu/Bapak Guru", bio: "Pembimbing teknis dan moral barisan elite X TJKT 2.", color: "from-rose-600 to-orange-700", image: "" },
    { id: '6', role: "Lead Developer", name: "ZENT TECH.", bio: "Architect of this digital space.", color: "from-yellow-500 to-orange-600", image: "" },
  ],
  gallery: [],
  schedule: { "Senin": [], "Selasa": [], "Rabu": [], "Kamis": [], "Jumat": [] },
  featuresSubtitle: "Our Core Protocols",
  featuresTitle: "Why We Are The Elite",
  features: [
    { title: "High Speed Logic", desc: "Berpikir cepat, bertindak tepat." },
    { title: "Secure Bond", desc: "Persahabatan kami terenkripsi." },
    { title: "Global Access", desc: "Siap bersaing di industri global." }
  ],
  quoteText: "Dalam jaringan, setiap node itu penting.",
  quoteAuthor: "X TJKT 2 / 2024",
  studentsTitle: "NETWORK NODES",
  studentsDescription: "Daftar personil elite X TJKT 2.",
  galleryTitle: "SERVER LOGS",
  galleryDescription: "Visualisasi memori kelas kita.",
  scheduleTitle: "EXECUTION PLAN",
  scheduleDescription: "Runtime harian kita.",
  scheduleGeneralLabel: "Standard Course",
  scheduleProductiveLabel: "Engineering Lab",
  mails: [],
  adminProfile: { name: "ADMIN_ROOT", role: "System Architect", image: "", verified: true },
  posts: [],
  veliciaIntro: "Halo! Aku Velicia, asisten elite X TJKT 2. Ada yang bisa aku bantu?",
  veliciaSidebarTitle: "Velicia AI",
  veliciaSidebarSubtitle: "X-TJKT-2 Network Assistant",
  veliciaStatusLabel: "System Status",
  veliciaStatusValue: "Online & Ready",
  veliciaExpertiseLabel: "Technical Expertise",
  veliciaExpertiseItems: ["Cisco Networking", "Server Administration"]
};

const defaultProfile: UserProfile = {
  name: "Visitor",
  age: "17",
  major: "Umum",
  className: "Guest",
  bio: "Selamat datang di identitas digital saya.",
  image: "",
  gender: 'Laki-laki'
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>(() => {
    try {
      const saved = localStorage.getItem('tjkt_v2_data');
      return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    } catch (e) {
      console.error("Gagal memuat data:", e);
      return defaultData;
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('tjkt_v2_profile');
      return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
    } catch (e) {
      return defaultProfile;
    }
  });

  const [isEditMode, setEditMode] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return localStorage.getItem('tjkt_v2_role') as UserRole || null;
  });

  useEffect(() => {
    try {
      localStorage.setItem('tjkt_v2_data', JSON.stringify(data));
    } catch (e) {
      console.error("LocalStorage Penuh! Gagal menyimpan data SiteData.");
      alert("⚠️ Memori browser penuh! Coba hapus beberapa postingan atau gunakan gambar yang lebih kecil.");
    }
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem('tjkt_v2_profile', JSON.stringify(userProfile));
    } catch (e) {
      console.error("Gagal menyimpan profil.");
    }
  }, [userProfile]);

  useEffect(() => {
    if (userRole) localStorage.setItem('tjkt_v2_role', userRole);
  }, [userRole]);

  const updateData = (newData: Partial<SiteData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...newProfile }));
  };

  const importData = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      setData(parsed);
      return true;
    } catch (e) {
      return false;
    }
  };

  const resetToDefault = () => {
    if (window.confirm("Reset semua data?")) {
      setData(defaultData);
      localStorage.removeItem('tjkt_v2_data');
    }
  };

  const login = (role: UserRole) => setUserRole(role);
  const logout = () => { setUserRole(null); localStorage.removeItem('tjkt_v2_role'); };

  return (
    <StoreContext.Provider value={{ 
      data, updateData, importData, resetToDefault, 
      isEditMode, setEditMode, showNav, setShowNav, 
      userRole, login, logout, userProfile, updateProfile
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
