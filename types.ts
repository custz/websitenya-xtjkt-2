
export type UserRole = 'user' | 'admin' | null;

export interface UserProfile {
  name: string;
  age: string;
  major: string;
  className: string;
  bio: string;
  image: string;
  gender: 'Laki-laki' | 'Perempuan';
}

export interface AdminProfile {
  name: string;
  role: string;
  image: string;
  verified: boolean;
}

// Fixed: Add missing Message interface for VeliciaPage.tsx
export interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface Reply {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  text: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  text: string;
  timestamp: string;
  replies: Reply[];
}

export interface Post {
  id: string;
  authorName: string;
  authorImage: string;
  authorRole: string;
  type: 'text' | 'image' | 'video';
  contentUrl?: string;
  caption: string;
  timestamp: string;
  likes: number;
  likedBy: string[]; // List of user names who liked
  comments: Comment[];
  isAdmin: boolean;
}

export interface Mail {
  id: string;
  sender: string;
  senderImage?: string;
  senderRole?: string;
  subject: string;
  content: string;
  time: string;
  isPriority: boolean;
  isAdmin: boolean;
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
  thumbnail?: string;
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

export interface Feature {
  title: string;
  desc: string;
}

export interface SiteData {
  brandName: string;
  navbarSubtitle: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  heroFloatingText: string;
  stats: {
    students: string;
    subjects: string;
    uptime: string;
  };
  statLabels: {
    students: string;
    subjects: string;
    uptime: string;
    version: string;
  };
  students: Student[];
  gallery: GalleryItem[];
  schedule: { [key: string]: Lesson[] };
  featuresSubtitle: string;
  featuresTitle: string;
  features: Feature[];
  quoteText: string;
  quoteAuthor: string;
  studentsTitle: string;
  studentsDescription: string;
  galleryTitle: string;
  galleryDescription: string;
  scheduleTitle: string;
  scheduleDescription: string;
  scheduleGeneralLabel: string;
  scheduleProductiveLabel: string;
  mails: Mail[];
  adminProfile: AdminProfile;
  posts: Post[];
  // Fixed: Add missing Velicia-related fields for the AI Chat interface
  veliciaIntro: string;
  veliciaSidebarTitle: string;
  veliciaSidebarSubtitle: string;
  veliciaStatusLabel: string;
  veliciaStatusValue: string;
  veliciaExpertiseLabel: string;
  veliciaExpertiseItems: string[];
}
