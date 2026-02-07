export enum JobStage {
  SAVED = 'SAVED',
  APPLIED = 'APPLIED',
  OA = 'OA',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
}

export interface Job {
  id: string;
  userId: string;
  company: string;
  title: string;
  url?: string;
  stage: JobStage;
  deadline?: Date;
  notes?: string;
  descriptionText?: string;
  matchScore?: number;
  createdAt: Date;
  updatedAt: Date;
}
