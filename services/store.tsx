
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
  isLoading: boolean;
}

const DB_NAME = 'tjkt_v2_database';
const STORE_NAME = 'site_data';

const defaultData: SiteData = {
  brandName: "X TJKT 2 ELITE",
  navbarSubtitle: "Network Engineers & Tech Enthusiasts",
  heroBadge: "Digital Portfolio / v2.5",
  heroTitle: "Building The Digital Future Together",
  heroDescription: "Kami bukan sekadar barisan kode atau tumpukan kabel. Kami adalah X TJKT 2, sekumpulan inovator muda yang siap menghubungkan dunia melalui teknologi jaringan dan telekomunikasi.",
  heroImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800&h=600",
  heroFloatingText: "TJKT",
  stats: { students: "45", subjects: "12", uptime: "100%" },
  statLabels: { students: "Engineers", subjects: "Lab Projects", uptime: "Connection", version: "Tech Stack" },
  students: [
    { id: '1', role: "Wali Kelas", name: "Ibu Resita", bio: "Pembimbing teknis dan moral barisan elite X TJKT 2.", color: "from-rose-600 to-orange-700", image: "" },
    { id: '2', role: "Ketua Murid", name: "IRFAN FERMADI", bio: "Main Node kelas, mengatur traffic koordinasi antar warga.", color: "from-blue-600 to-indigo-700", image: "" },
    { id: '3', role: "Wakil Murid", name: "GALUH RAY PUTRA", bio: "Backup server koordinasi kelas, siap sedia mendukung setiap paket kebijakan.", color: "from-indigo-500 to-purple-600", image: "" },
    { id: '4', role: "Sekretaris", name: "MELVINA YEIZA ALWI", bio: "Data Architect kelas, memastikan log harian tercatat dengan presisi.", color: "from-emerald-500 to-teal-600", image: "" },
    { id: '10', role: "Lead Developer", name: "M FARIZ ALFAUZI", bio: "Architect of this digital space. Crafting experiences through logic and art.", color: "from-slate-800 to-slate-900", image: "" },
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
  const [data, setData] = useState<SiteData>(defaultData);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [isEditMode, setEditMode] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize IndexedDB
  useEffect(() => {
    const initDB = () => {
      const request = indexedDB.open(DB_NAME, 1);
      
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        
        const getRequest = store.get('current_site_data');
        getRequest.onsuccess = () => {
          if (getRequest.result) {
            setData({ ...defaultData, ...getRequest.result });
          }
          setIsLoading(false);
        };
      };

      request.onerror = () => {
        console.error("IndexedDB failed, falling back to basic data");
        setIsLoading(false);
      };
    };

    initDB();

    // Load simple metadata from localStorage
    const savedRole = localStorage.getItem('tjkt_v2_role') as UserRole;
    if (savedRole) setUserRole(savedRole);
    
    const savedProfile = localStorage.getItem('tjkt_v2_profile');
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
  }, []);

  // Save to IndexedDB whenever data changes
  useEffect(() => {
    if (isLoading) return;

    const request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(data, 'current_site_data');
    };
  }, [data, isLoading]);

  // Save simple profile to localStorage
  useEffect(() => {
    localStorage.setItem('tjkt_v2_profile', JSON.stringify(userProfile));
  }, [userProfile]);

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
    }
  };

  const login = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem('tjkt_v2_role', role || '');
  };

  const logout = () => { 
    setUserRole(null); 
    localStorage.removeItem('tjkt_v2_role'); 
  };

  return (
    <StoreContext.Provider value={{ 
      data, updateData, importData, resetToDefault, 
      isEditMode, setEditMode, showNav, setShowNav, 
      userRole, login, logout, userProfile, updateProfile, isLoading
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
