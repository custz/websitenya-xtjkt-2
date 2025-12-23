
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
  navbarSubtitle: "Bukan Cuma Tukang Kabel",
  heroBadge: "Web Kelas Kita / v2.5",
  heroTitle: "Solid Terus Sampe Lulus",
  heroDescription: "Kita bukan cuma kumpulan anak IT yang pusing sama IP Address, kita itu keluarga besar X TJKT 2 yang asik, kompak, dan selalu mabar bareng!",
  heroImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800&h=600",
  heroFloatingText: "ELITE",
  globalAnnouncement: "SISTEM AMAN - WELCOME TO MARKAS X TJKT 2 - TETAP SOLID JANGAN KASIH KENDOR!",
  systemStatus: 'Normal',
  loginNotifications: [],
  tasks: [
    { id: 't1', title: "Konfigurasi Cisco Paket Tracer", subject: "Wan", deadline: "2024-12-30", status: 'active', description: "Setting VLAN sama VTP di 3 Switch, jangan sampe lupa!" },
    { id: 't2', title: "Laporan Praktikum Crimping", subject: "Dasar TJKT", deadline: "2024-12-25", status: 'urgent', description: "Foto kabel yang udah jadi (Straight & Cross) terus upload." }
  ],
  resources: [
    { id: 'r1', title: "Contekan IP Subnetting", category: 'Web', link: "https://www.subnet-calculator.com/", iconType: 'Globe' },
    { id: 'r2', title: "Kumpulan Command Cisco", category: 'Cisco', link: "https://www.cisco.com/", iconType: 'Cpu' }
  ],
  maintenanceLogs: [],
  stats: { students: "46", subjects: "12", uptime: "100%" },
  statLabels: { students: "Warga", subjects: "Projek Seru", uptime: "Kekompakan", version: "Versi Web" },
  students: [
    { id: '1', role: "Wali Kelas", name: "IBU RESITA", bio: "Pembimbing paling sabar ngadepin tingkah laku kita semua.", color: "from-rose-600 to-orange-700", image: "", isVerified: true },
    { id: '2', role: "Ketua Murid", name: "IRFAN FERMADI", bio: "Kepala suku yang ngatur lalu lintas kekompakan warga kelas.", color: "from-blue-600 to-indigo-700", image: "", isVerified: true },
    { id: '3', role: "Wakil Murid", name: "GALUH RAY PUTRA", bio: "Tangan kanan ketua yang selalu siap backup urusan kelas.", color: "from-indigo-500 to-purple-600", image: "", isVerified: true },
    { id: '4', role: "Sekretaris", name: "MELVINA YEIZA ALWI", bio: "Arsitek data kelas, urusan absen dia jagonya.", color: "from-emerald-500 to-teal-600", image: "", isVerified: true },
    { id: '5', role: "Sekretaris", name: "MUHANI KHALIFIA KHADIJAH", bio: "Penyusun administrasi kelas yang teliti dan sigap.", color: "from-teal-400 to-cyan-600", image: "", isVerified: true },
    { id: '6', role: "Bendahara", name: "SALMA YUNIAR", bio: "Menteri keuangan kelas, bayar kas jangan telat ya!", color: "from-amber-500 to-orange-600", image: "", isVerified: true },
    { id: '7', role: "Bendahara", name: "SITI SARIFAH ANJANI", bio: "Partner pengelola duit kas yang jujur dan transparan.", color: "from-yellow-500 to-amber-700", image: "", isVerified: true },
    { id: 'dev-zent', role: "Tukang Coding (Zent)", name: "M FARIZ ALFAUZI", bio: "Otak di balik fitur-fitur website X TJKT 2.", color: "from-slate-800 to-blue-900", image: "", isVerified: true },
    { id: 'dev-zyld', role: "Desainer (Zyld)", name: "MUHAMMAD ZYLDAN MUZHAFFAR SUPRIYANA", bio: "Yang bikin website ini keliatan cakep dan elite.", color: "from-purple-800 to-pink-900", image: "", isVerified: true },
    { id: 'dev-noir', role: "Arsitek Web (Noir)", name: "MUHAMAD RAZIB", bio: "Fondasi sistem ini dibangun sama ketelitian dia.", color: "from-cyan-800 to-slate-900", image: "", isVerified: true },
  ],
  gallery: [],
  schedule: { "Senin": [], "Selasa": [], "Rabu": [], "Kamis": [], "Jumat": [] },
  groups: [],
  featuresSubtitle: "Kenapa Kita Beda?",
  featuresTitle: "Kelas Paling Elite",
  features: [
    { title: "Logika Jalan", desc: "Berpikir gercep, tugas kelar." },
    { title: "Koneksi Solid", desc: "Temen susah, kita bantu bareng." },
    { title: "Siap Kerja", desc: "Lulus langsung gass dunia industri." }
  ],
  quoteText: "Gak ada warga yang ditinggalin, semua satu jaringan!",
  quoteAuthor: "X TJKT 2 / 2024",
  studentsTitle: "Warga Kelas",
  studentsDescription: "Ini dia barisan elite penghuni X TJKT 2. Jangan macem-macem ya!",
  galleryTitle: "Momen Seru",
  galleryDescription: "Kumpulan memori manis pas lagi di sekolah.",
  scheduleTitle: "Jadwal Belajar",
  scheduleDescription: "Rutinitas harian pejuang LAN dan kabel.",
  scheduleGeneralLabel: "Mapel Umum",
  scheduleProductiveLabel: "Mapel Jurusan (Praktikum)",
  mails: [],
  adminProfile: { name: "ZENT_ROOT", role: "Arsitek Sistem", image: "", verified: true },
  posts: [],
  menfess: [],
  quizQuestions: [
    {
      id: 'q1',
      text: "Urutan warna kabel ke-3 pada standar T568B adalah...",
      options: ["Putih Oranye", "Oranye", "Putih Hijau", "Biru"],
      correctAnswer: 2,
      explanation: "Standar T568B: Putih-Oranye, Oranye, Putih-Hijau, Biru, Putih-Biru, Hijau, Putih-Cokelat, Cokelat."
    },
    {
      id: 'q2',
      text: "Layer OSI yang menangani pengalamatan logis (IP Address) adalah...",
      options: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"],
      correctAnswer: 1,
      explanation: "Network Layer (Layer 3) bertanggung jawab untuk routing dan pengalamatan IP."
    },
    {
      id: 'q3',
      text: "Berapa jumlah host maksimum yang dapat digunakan pada subnet mask /24?",
      options: ["254 Host", "256 Host", "512 Host", "128 Host"],
      correctAnswer: 0,
      explanation: "/24 memiliki 256 alamat, dikurangi Network ID dan Broadcast ID menjadi 254 host yang valid."
    },
    {
      id: 'q4',
      text: "Perangkat yang bekerja di Layer 2 OSI dan membagi collision domain adalah...",
      options: ["Hub", "Router", "Switch", "Repeater"],
      correctAnswer: 2,
      explanation: "Switch bekerja di Layer 2 (Data Link) dan mampu membagi domain tabrakan (collision) per port."
    }
  ],
  quizFeedbacks: [],
  veliciaIntro: "Halo! Aku Velicia, asisten paling asik di X TJKT 2. Mau nanya apa nih hari ini?",
  veliciaSidebarTitle: "Velicia (Asisten)",
  veliciaSidebarSubtitle: "Temen Curhat X-TJKT-2",
  veliciaStatusLabel: "Status Velicia",
  veliciaStatusValue: "Online & Siap Bantu",
  veliciaExpertiseLabel: "Bisa Apa Aja?",
  veliciaExpertiseItems: ["Anak Jaringan", "Admin Server", "Temen Curhat"]
};

const defaultProfile: UserProfile = {
  name: "Tamu",
  age: "17",
  major: "Umum",
  className: "Guest",
  bio: "Baru aja mampir nih.",
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

  useEffect(() => {
    const initDB = () => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
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
      request.onerror = () => setIsLoading(false);
    };
    initDB();
    const savedRole = localStorage.getItem('tjkt_v2_role') as UserRole;
    if (savedRole) setUserRole(savedRole);
    const savedProfile = localStorage.getItem('tjkt_v2_profile');
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
  }, []);

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

  const updateData = (newData: Partial<SiteData>) => setData(prev => ({ ...prev, ...newData }));
  const updateProfile = (newProfile: Partial<UserProfile>) => setUserProfile(prev => ({ ...prev, ...newProfile }));
  const importData = (jsonString: string) => {
    try { setData(JSON.parse(jsonString)); return true; } catch (e) { return false; }
  };
  const resetToDefault = () => { if (window.confirm("Beneran mau reset semua data?")) setData(defaultData); };
  const login = (role: UserRole) => { setUserRole(role); localStorage.setItem('tjkt_v2_role', role || ''); };
  const logout = () => { setUserRole(null); localStorage.removeItem('tjkt_v2_role'); };

  return (
    <StoreContext.Provider value={{ 
      data, updateData, importData, resetToDefault, isEditMode, setEditMode, showNav, setShowNav, 
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
