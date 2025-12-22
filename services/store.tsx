
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteData, Student, GalleryItem, Lesson, UserRole, UserProfile, Mail, AdminProfile, Post } from '../types';

const defaultData: SiteData = {
  brandName: "X TJKT 2 ELITE",
  navbarSubtitle: "Network Engineers & Tech Enthusiasts",
  heroBadge: "Digital Portfolio / v2.5",
  heroTitle: "Building The Digital Future Together",
  heroDescription: "Kami bukan sekadar barisan kode atau tumpukan kabel. Kami adalah X TJKT 2, sekumpulan inovator muda yang siap menghubungkan dunia melalui teknologi jaringan dan telekomunikasi.",
  heroImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800&h=600",
  heroFloatingText: "TJKT",
  stats: {
    students: "41",
    subjects: "12",
    uptime: "100%"
  },
  statLabels: {
    students: "Engineers",
    subjects: "Lab Projects",
    uptime: "Connection",
    version: "Tech Stack"
  },
  students: [
    { id: '1', role: "Wali Kelas", name: "Ibu/Bapak Guru", bio: "Pembimbing teknis dan moral barisan elite X TJKT 2.", color: "from-rose-600 to-orange-700", image: "" },
    { id: '2', role: "Ketua Kelas", name: "Ketua Kece", bio: "Main Node kelas, mengatur traffic koordinasi antar warga.", color: "from-blue-600 to-indigo-700", image: "" },
    { id: '6', role: "Lead Developer", name: "ZENT TECH.", bio: "Architect of this digital space. Crafting experiences through logic and art.", color: "from-yellow-500 to-orange-600", image: "" },
  ],
  gallery: [
    { id: '1', type: 'image', url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=600", title: "Cisco Configuration Lab", category: "gambar" },
    { id: '2', type: 'video', url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Class Vibes", category: "video" }
  ],
  schedule: {
    "Senin": [
      { id: 's1', time: "07:15 - 08:30", subject: "Upacara & Literasi", teacher: "Guru Piket", type: 'umum' },
      { id: 's2', time: "08:30 - 10:00", subject: "Dasar-Dasar TJKT", teacher: "Team Produktif", type: 'produktif' }
    ],
    "Selasa": [], "Rabu": [], "Kamis": [], "Jumat": []
  },
  featuresSubtitle: "Our Core Protocols",
  featuresTitle: "Why We Are The Elite",
  features: [
    { title: "High Speed Logic", desc: "Berpikir cepat, bertindak tepat. Kami dilatih untuk menyelesaikan masalah jaringan dalam hitungan detik." },
    { title: "Secure Bond", desc: "Persahabatan kami terenkripsi dengan rasa solidaritas yang gak bisa di-hack siapapun." },
    { title: "Global Access", desc: "Berwawasan luas, siap bersaing di industri telekomunikasi global." }
  ],
  quoteText: "Dalam jaringan, setiap node itu penting. Begitu juga di kelas kita, gak ada yang boleh tertinggal di belakang firewall.",
  quoteAuthor: "X TJKT 2 / 2024",
  studentsTitle: "NETWORK NODES",
  studentsDescription: "Daftar personil elite yang menggerakkan setiap paket data kebahagiaan di kelas X TJKT 2.",
  galleryTitle: "SERVER LOGS",
  galleryDescription: "Visualisasi memori yang tersimpan dalam database kenangan kelas kita.",
  scheduleTitle: "EXECUTION PLAN",
  scheduleDescription: "Runtime harian kita. Jangan sampai ada 'Missing Dependency' karena lupa jadwal!",
  scheduleGeneralLabel: "Standard Course",
  scheduleProductiveLabel: "Engineering Lab",
  mails: [],
  adminProfile: {
    name: "ADMIN_ROOT",
    role: "System Architect",
    image: "",
    verified: true
  },
  posts: [],
  // Fixed: Added default values for Velicia AI assistant config
  veliciaIntro: "Halo! Aku Velicia, asisten elite X TJKT 2. Ada yang bisa aku bantu seputar jaringan atau tugas hari ini?",
  veliciaSidebarTitle: "Velicia AI",
  veliciaSidebarSubtitle: "X-TJKT-2 Network Assistant",
  veliciaStatusLabel: "System Status",
  veliciaStatusValue: "Online & Ready",
  veliciaExpertiseLabel: "Technical Expertise",
  veliciaExpertiseItems: [
    "Cisco Networking",
    "Server Administration",
    "Network Security",
    "Fiber Optics"
  ]
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
    const saved = localStorage.getItem('tjkt_v2_data');
    const parsed = saved ? JSON.parse(saved) : defaultData;
    return { ...defaultData, ...parsed };
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tjkt_v2_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [isEditMode, setEditMode] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return localStorage.getItem('tjkt_v2_role') as UserRole || null;
  });

  useEffect(() => {
    localStorage.setItem('tjkt_v2_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('tjkt_v2_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('tjkt_v2_role', userRole);
    }
  }, [userRole]);

  const updateData = (newData: Partial<SiteData>) => {
    if (userRole !== 'admin') {
      // Allow users to update posts (for likes/comments)
      if (newData.posts) {
         setData(prev => ({ ...prev, posts: newData.posts! }));
         return;
      }
      return; 
    }
    setData(prev => ({ ...prev, ...newData }));
  };

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...newProfile }));
  };

  const importData = (jsonString: string) => {
    if (userRole !== 'admin') return false;
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.brandName && parsed.students) {
        setData(parsed);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const resetToDefault = () => {
    if (userRole !== 'admin') return;
    if (window.confirm("Beneran mau balikin semua data ke awal?")) {
      setData(defaultData);
    }
  };

  const login = (role: UserRole) => setUserRole(role);
  const logout = () => {
    console.warn("Sesi bersifat permanen.");
  };

  return (
    <StoreContext.Provider value={{ 
      data, updateData, importData, resetToDefault, 
      isEditMode, setEditMode: (v) => userRole === 'admin' ? setEditMode(v) : null, 
      showNav, setShowNav, userRole, login, logout,
      userProfile, updateProfile
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
