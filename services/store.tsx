
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
    { id: 'q1', type: 'pg', text: "Komponen PC yang sering disebut sebagai 'otak' komputer adalah...", options: ["Hardisk", "RAM", "Processor (CPU)", "Monitor"], correctAnswer: 2, explanation: "CPU (Central Processing Unit) adalah otak komputer yang memproses semua instruksi." },
    { id: 'q2', type: 'pg', text: "Perangkat keras yang berfungsi untuk menyimpan data secara permanen adalah...", options: ["RAM", "SSD / Hardisk", "VGA Card", "Power Supply"], correctAnswer: 1, explanation: "SSD atau Hardisk digunakan untuk penyimpanan data jangka panjang (non-volatile)." },
    { id: 'q3', type: 'pg', text: "RAM (Random Access Memory) berfungsi sebagai...", options: ["Penyimpanan permanen", "Penyimpanan sementara saat PC hidup", "Pengolah grafis", "Penyuplai daya"], correctAnswer: 1, explanation: "RAM menyimpan data sementara yang sedang diproses oleh CPU." },
    { id: 'q4', type: 'pg', text: "Mana di bawah ini yang termasuk perangkat lunak (Software) sistem operasi?", options: ["Microsoft Excel", "Google Chrome", "Windows 11", "Adobe Photoshop"], correctAnswer: 2, explanation: "Windows 11 adalah Sistem Operasi, sedangkan yang lain adalah aplikasi." },
    { id: 'q5', type: 'pg', text: "Komponen yang berfungsi menyuplai listrik ke seluruh komponen PC adalah...", options: ["Motherboard", "Casing", "Power Supply Unit (PSU)", "Heatsink"], correctAnswer: 2, explanation: "PSU bertugas mengubah arus AC menjadi DC untuk kebutuhan komponen PC." },
    { id: 'q6', type: 'pg', text: "Papan sirkuit utama tempat semua komponen PC terpasang disebut...", options: ["Sound Card", "Motherboard", "LAN Card", "Processor"], correctAnswer: 1, explanation: "Motherboard adalah papan induk yang menghubungkan semua komponen." },
    { id: 'q7', type: 'pg', text: "Perangkat keras yang digunakan untuk menampilkan visual ke layar adalah...", options: ["VGA / GPU", "RAM", "Processor", "Keyboard"], correctAnswer: 0, explanation: "VGA (Video Graphics Array) atau GPU mengolah data gambar untuk ditampilkan ke monitor." },
    { id: 'q8', type: 'pg', text: "Contoh perangkat Input adalah...", options: ["Monitor", "Speaker", "Printer", "Keyboard"], correctAnswer: 3, explanation: "Keyboard digunakan untuk memasukkan perintah/data ke dalam sistem." },
    { id: 'q9', type: 'pg', text: "Software yang berfungsi untuk menjelajahi internet disebut...", options: ["Word Processor", "Web Browser", "Operating System", "Database"], correctAnswer: 1, explanation: "Web Browser (seperti Chrome/Edge) digunakan untuk browsing internet." },
    { id: 'q10', type: 'pg', text: "BIOS tersimpan di dalam komponen yang disebut...", options: ["RAM", "Hardisk", "ROM (CMOS)", "CPU"], correctAnswer: 2, explanation: "BIOS tersimpan di chip ROM yang dayanya dijaga oleh baterai CMOS." },
    { id: 'q11', type: 'pg', text: "Satuan terkecil dalam penyimpanan data digital adalah...", options: ["Byte", "Kilobyte", "Bit", "Megabyte"], correctAnswer: 2, explanation: "Bit (Binary Digit) adalah unit terkecil (0 atau 1)." },
    { id: 'q12', type: 'pg', text: "Mana yang merupakan perangkat lunak pengolah kata?", options: ["Microsoft PowerPoint", "Microsoft Word", "Microsoft Excel", "Microsoft Access"], correctAnswer: 1, explanation: "Microsoft Word dirancang khusus untuk mengolah kata/dokumen." },
    { id: 'q13', type: 'pg', text: "Komponen PC yang bertugas mendinginkan processor adalah...", options: ["PSU", "VGA Card", "Heatsink / Fan", "Casing"], correctAnswer: 2, explanation: "Heatsink dan kipas menjaga suhu processor agar tidak overheat." },
    { id: 'q14', type: 'pg', text: "Perangkat yang berfungsi mencetak dokumen fisik dari data digital adalah...", options: ["Scanner", "Plotter", "Printer", "Speaker"], correctAnswer: 2, explanation: "Printer adalah perangkat output untuk mencetak ke kertas." },
    { id: 'q15', type: 'pg', text: "Linux adalah contoh dari software yang bersifat...", options: ["Closed Source", "Berbayar Mahal", "Open Source", "Hanya untuk Game"], correctAnswer: 2, explanation: "Linux adalah sistem operasi kode terbuka yang bisa dimodifikasi siapa saja." },
    { id: 'q16', type: 'pg', text: "Slot pada motherboard yang digunakan untuk memasang RAM disebut...", options: ["PCI Slot", "SATA Port", "DIMM Slot", "Socket CPU"], correctAnswer: 2, explanation: "DIMM (Dual In-line Memory Module) adalah slot khusus untuk RAM." },
    { id: 'q17', type: 'pg', text: "Software utilitas yang berfungsi melindungi PC dari virus adalah...", options: ["Browser", "Antivirus", "Media Player", "Compiler"], correctAnswer: 1, explanation: "Antivirus menjaga keamanan sistem dari serangan malware/virus." },
    { id: 'q18', type: 'pg', text: "Konektor yang biasanya digunakan untuk menghubungkan monitor ke PC adalah...", options: ["USB", "SATA", "HDMI / VGA", "RJ45"], correctAnswer: 2, explanation: "HDMI dan VGA adalah standar konektor display/monitor." },
    { id: 'q19', type: 'pg', text: "Multitasking adalah kemampuan komputer untuk...", options: ["Mati otomatis", "Menjalankan banyak program sekaligus", "Menyimpan data sangat besar", "Menghapus virus"], correctAnswer: 1, explanation: "Multitasking memungkinkan user membuka banyak aplikasi dalam satu waktu." },
    { id: 'q20', type: 'pg', text: "Driver dalam komputer berfungsi untuk...", options: ["Membersihkan debu", "Menghubungkan hardware agar dikenali OS", "Mempercepat internet", "Mendinginkan CPU"], correctAnswer: 1, explanation: "Driver adalah software penghubung antara hardware dan sistem operasi." }
  ],
  quizFeedbacks: [],
  quizLeaderboard: [
    { id: 'lb-1', name: "ZENT_MASTER", image: "", score: 3200, accuracy: 100, timestamp: "Hari ini" },
    { id: 'lb-2', name: "ZYLD_DESIGNER", image: "", score: 2950, accuracy: 95, timestamp: "Hari ini" },
    { id: 'lb-3', name: "NOIR_DEV", image: "", score: 2800, accuracy: 90, timestamp: "Hari ini" }
  ],
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
