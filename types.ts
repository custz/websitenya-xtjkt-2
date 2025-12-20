
export type UserRole = 'user' | 'admin' | null;

export interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface Student {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  color: string;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string; // Menyimpan preview gambar untuk video
  title: string;
  category: string;
}

export interface Lesson {
  id: string;
  time: string;
  subject: string;
  teacher: string;
  type: 'umum' | 'produktif';
}

export interface SiteData {
  brandName: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  stats: {
    students: string;
    subjects: string;
    uptime: string;
  };
  students: Student[];
  gallery: GalleryItem[];
  schedule: { [key: string]: Lesson[] };
}
