export type NavTab = 'inicio' | 'calendario' | 'tareas' | 'notas' | 'progreso';

export type TaskStatus = 'pending' | 'completed';

export type ClassModality = 'Clase en vivo' | 'Práctica guiada' | 'Tutoría';

export const COURSE_TOPICS = [
  'Introducción a Google AI Studio',
  'Ingeniería de Prompts',
  'Parámetros y Modelos Gemini',
  'Multimodalidad y Datos',
  'Salida Estructurada (JSON)',
  'Integración y API',
] as const;

export interface ClassSession {
  id: string;
  title: string;
  topic: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  modality: ClassModality;
  description: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  topic: string;
  status: TaskStatus;
}

export interface NoteItem {
  id: string;
  title: string;
  topic: string;
  content: string;
  updatedAt: string; // YYYY-MM-DD
}
