
export enum Difficulty {
  EASY = 'Fácil',
  MEDIUM = 'Médio',
  HARD = 'Difícil'
}

export enum UserRole {
  STUDENT = 'ALUNO',
  TEACHER = 'MESTRE'
}

export type Subject = 'Matemática' | 'Português' | 'Ciências' | 'Geral';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  stats?: UserStats;
  cpf: string;
  profilePicture?: string; // Armazenado como base64 string
}

export interface Question {
  id: string;
  enunciado: string;
  options: string[];
  correctAnswerIndex: number;
  difficulty: Difficulty;
  subject: Subject;
  type: 'OBJECTIVE' | 'DESCRIPTIVE';
  basePoints: number;
  
  // Campos da Arquitetura Suprema
  tags: string[];
  timesUsed: number;
  createdAt: number;
  year?: string;
  sourcePdf?: string;
  
  // Campos existentes
  imageBase64?: string;
  contextText?: string;
  usesMotivationalText?: boolean;
}

export interface Simulado {
  id: string;
  title: string;
  description: string;
  questionIds: string[];
  durationMinutes: number;
  createdAt: number;
  rewardXP: number; // Bônus por completar o simulado
  motivationalText?: string;
  motivationalImageBase64?: string;
  motivationalTextId?: string; // Link to the motivational text
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'pending' | 'completed' | 'locked';
  type: 'daily' | 'mastery' | 'audio' | 'ai_creative' | 'custom';
  subject: Subject;
  icon: string;
  questionIds?: string[];
  summary?: {
    text: string;
    audioBase64?: string | null;
  };
}

export interface UserStats {
  points: number;
  streak: number;
  level: number;
  rank: string;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
}

export interface Module {
  id: string;
  name: string;
  subject: Subject;
  contentCount: number;
  summary?: string;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: number;
}

export interface MotivationalText {
  id: string;
  title: string;
  content: string;
  sourcePdf: string;
}
