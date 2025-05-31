export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Lesson {
  id: number;
  title: string;
  type: 'video' | 'text';
  duration: string;
  contentUrl?: string;
  content?: string;
  description?: string;
  completed?: boolean;
  locked?: boolean;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  duration: string;
  lessons: Lesson[];
  completed?: boolean;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  category: string;
  imageUrl: string;
  duration: string;
  modules: Module[];
  featured?: boolean;
  inProgress?: boolean;
}