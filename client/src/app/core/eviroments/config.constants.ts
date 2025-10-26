export const API_URL = 'https://api.example.com/';


export type Profile = {
  id: string;
  name: string;
  email: string;
  class: string;
  skills?: string[];
  department: "IF" | "ET" | "WI" | "MB";
  bio?: string;
  role: 'student' | 'teacher' | 'president' | 'director' | 'admin';
  avatarUrl?: string;
  numberOfProjects?: number;
  numberOfFollowers?: number;
  numberOfFollowing?: number;

  projects?: Project[];
  registeredAt: Date;
}


export type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  likes: number;
}
