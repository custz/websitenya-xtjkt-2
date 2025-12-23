
export type UserRole = 'user' | 'admin' | null;

export interface LeaderboardEntry {
  id: string;
  name: string;
  image: string;
  score: number;
  accuracy: number;
  timestamp: string;
}

export interface Question {
  id: string;
  type: 'pg';
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizFeedback {
  id: string;
  userName: string;
  topic: string;
  suggestion: string;
  timestamp: string;
}

export interface LoginNotification {
  id: string;
  userName: string;
  timestamp: string;
  isRead: boolean;
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  status: 'active' | 'completed' | 'urgent';
  description: string;
}

export interface Resource {
  id: string;
  title: string;
  category: 'Cisco' | 'Mikrotik' | 'Linux' | 'Web' | 'Lainnya';
  link: string;
  iconType: string;
}

export interface MaintenanceLog {
  id: string;
  timestamp: string;
  action: string;
  statusBefore: string;
  statusAfter: string;
}

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
  likedBy: string[];
  comments: Comment[];
  isAdmin: boolean;
}

export interface Menfess {
  id: string;
  to: string;
  from: string;
  message: string;
  song?: {
    title: string;
    artist: string;
  };
  timestamp: string;
  color: string;
}

export interface Student {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  color: string;
  isVerified?: boolean;
}

export interface Group {
  id: string;
  name: string;
  members: Student[];
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
  globalAnnouncement: string;
  systemStatus: 'Normal' | 'Maintenance' | 'Overload';
  loginNotifications: LoginNotification[];
  tasks: Task[];
  resources: Resource[];
  maintenanceLogs: MaintenanceLog[];
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
  mails: any[];
  adminProfile: AdminProfile;
  posts: Post[];
  menfess: Menfess[];
  quizQuestions: Question[];
  quizFeedbacks: QuizFeedback[];
  quizLeaderboard: LeaderboardEntry[];
  groups: Group[];
  veliciaIntro: string;
  veliciaSidebarTitle: string;
  veliciaSidebarSubtitle: string;
  veliciaStatusLabel: string;
  veliciaStatusValue: string;
  veliciaExpertiseLabel: string;
  veliciaExpertiseItems: string[];
}
