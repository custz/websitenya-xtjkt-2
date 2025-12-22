
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
  stats: { students: "45", subjects: "12", uptime: "100%" },
  statLabels: { students: "Engineers", subjects: "Lab Projects", uptime: "Connection", version: "Tech Stack" },
  students: [
    // PRIORITY: JABATAN & PERANGKAT
    { id: '1', role: "Wali Kelas", name: "Ibu Resita", bio: "Pembimbing teknis dan moral barisan elite X TJKT 2.", color: "from-rose-600 to-orange-700", image: "" },
    { id: '2', role: "Ketua Murid", name: "IRFAN FERMADI", bio: "Main Node kelas, mengatur traffic koordinasi antar warga.", color: "from-blue-600 to-indigo-700", image: "" },
    { id: '3', role: "Wakil Murid", name: "GALUH RAY PUTRA", bio: "Backup server koordinasi kelas, siap sedia mendukung setiap paket kebijakan.", color: "from-indigo-500 to-purple-600", image: "" },
    { id: '4', role: "Sekretaris", name: "MELVINA YEIZA ALWI", bio: "Data Architect kelas, memastikan log harian tercatat dengan presisi.", color: "from-emerald-500 to-teal-600", image: "" },
    { id: '5', role: "Sekretaris", name: "Muhani Khalifia Khadijah", bio: "System Logger, sinkronisasi administrasi kelas tetap update.", color: "from-emerald-500 to-teal-600", image: "" },
    { id: '6', role: "Bendahara", name: "SALMA ZULFA NASYITHA", bio: "Finance Controller, mengelola bandwidth keuangan kelas.", color: "from-yellow-500 to-amber-600", image: "" },
    { id: '7', role: "Bendahara", name: "SITI SARIFAH ANJANI", bio: "Resource Manager, memastikan sirkulasi aset keuangan tetap aman.", color: "from-yellow-500 to-amber-600", image: "" },
    { id: '8', role: "Osis", name: "DIMAS ALVINO", bio: "Jembatan koneksi antar kelas melalui organisasi sekolah.", color: "from-blue-400 to-blue-600", image: "" },
    { id: '9', role: "Osis", name: "EVANDER YUSUP FARIZKY", bio: "Duta protokol sekolah, aktif menggerakkan sinergi antar siswa.", color: "from-blue-400 to-blue-600", image: "" },
    
    // TIM PENGEMBANG (TECH TEAM)
    { id: '10', role: "Lead Developer", name: "M FARIZ ALFAUZI", bio: "Architect of this digital space. Crafting experiences through logic and art.", color: "from-slate-800 to-slate-900", image: "" },
    { id: '11', role: "UI Designer", name: "MUHAMMAD ZYLDAN MUZHAFFAR SUPRIYANA", bio: "Visual Architect, mendesain antarmuka jaringan agar tetap estetik.", color: "from-fuchsia-600 to-purple-700", image: "" },
    { id: '12', role: "System Analyst", name: "Muhamad Razib", bio: "Konseptor struktur database dan alur logika portofolio ini.", color: "from-cyan-500 to-blue-600", image: "" },

    // WARGA KELAS
    { id: '13', role: "Warga Santuy", name: "ALHAM HAIKAL", bio: "Node aktif dalam jaringan sosial X TJKT 2.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '14', role: "Warga Santuy", name: "ANNAS NASRI MAULUDIN", bio: "Selalu sinkron dengan setiap canda tawa di kelas.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '15', role: "Warga Santuy", name: "AUREL AGRI NOVIANTI", bio: "Packet data kebahagiaan bagi teman-teman sekitarnya.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '16', role: "Warga Santuy", name: "AYATULL HUSNA", bio: "Elemen penting dalam ekosistem kebersamaan kelas.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '17', role: "Warga Santuy", name: "AZMI ABDUL MAULANA", bio: "Konsisten menjaga koneksi persahabatan tetap stabil.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '18', role: "Warga Santuy", name: "Bibit Adi Syaputra", bio: "Selalu punya cara untuk mendecrypt suasana jadi seru.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '19', role: "Warga Santuy", name: "CAKRA BUANA", bio: "Node jaringan yang handal dalam hal solidaritas.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '20', role: "Warga Santuy", name: "DERI PADLLI", bio: "Bagian dari firewall pertahanan solidaritas kelas.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '21', role: "Warga Santuy", name: "GALUH RAGA PANUNTUN", bio: "Mengalirkan energi positif ke seluruh penjuru lab.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '22', role: "Warga Santuy", name: "HASBI NURSYAH PUTRA", bio: "Selalu terkoneksi dengan hobi dan keseruan bareng.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '23', role: "Warga Santuy", name: "INTAN DARMAWAN", bio: "Signal keceriaan yang gak pernah putus di X TJKT 2.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '24', role: "Warga Santuy", name: "M RABLI AZWAR", bio: "Fighter sejati di lab maupun di luar jaringan.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '25', role: "Warga Santuy", name: "M. PADIL NURJAMAN", bio: "Elemen inti yang memperkuat latency persahabatan.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '26', role: "Warga Santuy", name: "Megha Indah Ramdani", bio: "Koneksi lembut tapi pasti dalam membangun harmoni.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '27', role: "Warga Santuy", name: "MOH BILAL NURULFATA", bio: "Transmiter ide-ide kreatif buat seru-seruan bareng.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '28', role: "Warga Santuy", name: "MUHAMAD FIRMAN SUPIANI", bio: "Selalu ready di terminal kebahagiaan warga kelas.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '29', role: "Warga Santuy", name: "MUHAMAD MAULANA", bio: "Packet data keceriaan selalu berhasil terkirim lewat dia.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '30', role: "Warga Santuy", name: "Muhamad Razib", bio: "Selalu punya bandwidth luas buat bantuin temen.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '31', role: "Warga Santuy", name: "MUHAMAD WIJAYA ZAINUR RAHMAN", bio: "Membangun bridge pertemanan yang kokoh di lab.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '32', role: "Warga Santuy", name: "Muhamad Zaky Pairus", bio: "Router tawa yang efektif di setiap jam istirahat.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '33', role: "Warga Santuy", name: "MUHAMMAD RASYA RADITYA SWARNA", bio: "Koneksi elite, solidaritas tanpa batas.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '34', role: "Warga Santuy", name: "MUHAMMAD REIHAN ALPIANSYAH", bio: "Mengonfigurasi masa depan bareng barisan TJKT 2.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '35', role: "Warga Santuy", name: "MUHAMMAD RIZKI PRATAMA", bio: "Selalu ada di topologi persahabatan kelas.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '36', role: "Warga Santuy", name: "MUHAMMAD ZYLDAN MUZHAFFAR SUPRIYANA", bio: "Crafting visually and socialy in this class.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '37', role: "Warga Santuy", name: "NURSHIFA AMALIA", bio: "Sinyal kelembutan yang menyatukan setiap perbedaan.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '38', role: "Warga Santuy", name: "PAHRI GILANG PRATAMA", bio: "Selalu terhubung dengan aksi seru dan produktif.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '39', role: "Warga Santuy", name: "RAYHAN AMBIYA", bio: "Transmitting happiness across the network.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '40', role: "Warga Santuy", name: "REZA JUNIARDI", bio: "Node handal yang gak gampang disconnect dari temen.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '41', role: "Warga Santuy", name: "RINDU RIAYU", bio: "Koneksi emosional yang manis di tengah lab TJKT.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '42', role: "Warga Santuy", name: "RISTA AMELIA", bio: "Selalu sinkron dengan vibrasi positif kelas.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '43', role: "Warga Santuy", name: "RIZKIA FEBRIANTI", bio: "Bandwidth semangatnya gak ada habisnya.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '44', role: "Warga Santuy", name: "SALMA YUNIAR", bio: "Selalu menjaga uptime keceriaan di grup kelas.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '45', role: "Warga Santuy", name: "SHIRA PUTRYASNI WULANDARI", bio: "Packet data pertemanan selalu delivered lewat senyumnya.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '46', role: "Warga Santuy", name: "WOLID HERDIANSYAH", bio: "Selalu ready di port persahabatan kelas.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '47', role: "Warga Santuy", name: "ZULPA APRILIANI", bio: "Inti jaringan yang mempererat kebersamaan warga.", color: "from-slate-700 to-slate-800", image: "" },
    { id: '48', role: "Warga Santuy", name: "RAYA", bio: "Node terbaru yang siap berakselerasi bareng TJKT 2.", color: "from-slate-700 to-slate-800", image: "" },
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
