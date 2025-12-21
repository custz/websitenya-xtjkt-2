
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteData, Student, GalleryItem, Lesson, UserRole } from '../types';

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
}

const defaultData: SiteData = {
  brandName: "X TJKT 2 ELITE",
  heroTitle: "website X TJKT 2",
  heroDescription: "Pusat informasi dan portofolio digital kelas X TJKT 2. Kami adalah generasi penerus infrastruktur jaringan dan telekomunikasi global.",
  heroImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800&h=600",
  stats: {
    students: "36",
    subjects: "12",
    uptime: "99%"
  },
  students: [
    { id: '1', role: "Ketua Murid", name: "uknow sementar", bio: "Pemimpin visioner penggerak roda organisasi kelas.", color: "from-blue-600 to-indigo-700", image: "" },
    { id: '2', role: "Sekretaris", name: "uknow sementar", bio: "Pengelola dokumentasi dan administrasi digital kelas.", color: "from-purple-600 to-pink-700", image: "" },
    { id: '3', role: "Bendahara", name: "uknow sementar", bio: "Manajer finansial untuk kebutuhan operasional siswa.", color: "from-emerald-600 to-teal-700", image: "" },
  ],
  gallery: [
    { id: '1', type: 'image', url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=600", title: "Lab Jaringan", category: "gambar" },
    { id: '2', type: 'video', url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Kegiatan Praktikum", category: "video" }
  ],
  schedule: {
    "Senin": [
      { id: 's1', time: "07:15 - 08:30", subject: "Mata Pelajaran uknow", teacher: "Guru uknow", type: 'umum' },
      { id: 's2', time: "08:30 - 10:00", subject: "Mata Pelajaran uknow", teacher: "Guru uknow", type: 'produktif' }
    ],
    "Selasa": [], "Rabu": [], "Kamis": [], "Jumat": []
  },
  featuresSubtitle: "Architecture & Foundation",
  featuresTitle: "Building the Future",
  features: [
    { title: "Infrastructure", desc: "Arsitektur jaringan yang tangguh dan terukur untuk skala enterprise." },
    { title: "Security", desc: "Protokol keamanan berlapis untuk menjaga integritas data digital." },
    { title: "Connectivity", desc: "Menghubungkan simpul-simpul teknologi ke seluruh penjuru dunia." }
  ],
  quoteText: "Kabel mungkin menghubungkan perangkat, namun gairah untuk teknologi-lah yang menghubungkan Masa Depan. X-TJKT-2 bukan sekadar kelas, ia adalah keluarga digital.",
  quoteAuthor: "Zent / Lead Node"
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>(() => {
    const saved = localStorage.getItem('tjkt_v2_data');
    const parsed = saved ? JSON.parse(saved) : defaultData;
    // Merge logic to ensure new fields exist in old localStorage data
    return { ...defaultData, ...parsed };
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
    if (userRole) {
      localStorage.setItem('tjkt_v2_role', userRole);
    } else {
      localStorage.removeItem('tjkt_v2_role');
    }
  }, [userRole]);

  const updateData = (newData: Partial<SiteData>) => {
    if (userRole !== 'admin') return; 
    setData(prev => ({ ...prev, ...newData }));
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
    if (window.confirm("Apakah Anda yakin ingin menghapus semua perubahan dan kembali ke pengaturan awal?")) {
      setData(defaultData);
    }
  };

  const login = (role: UserRole) => setUserRole(role);
  const logout = () => {
    setUserRole(null);
    setEditMode(false);
  };

  return (
    <StoreContext.Provider value={{ 
      data, updateData, importData, resetToDefault, 
      isEditMode, setEditMode: (v) => userRole === 'admin' ? setEditMode(v) : null, 
      showNav, setShowNav, userRole, login, logout 
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
