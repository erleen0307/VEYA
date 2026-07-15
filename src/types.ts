/**
 * VEYA Types Definitions
 */

export type CyclePhase = 'menstruation' | 'follicular' | 'ovulatory' | 'luteal';

export interface JournalLog {
  date: string; // YYYY-MM-DD
  flow: number | null; // 0 = none, 1 = light, 2 = medium, 3 = heavy
  pain: number; // 0 = none, 10 = severe
  mood: string; // 'radiant' | 'calm' | 'sensitive' | 'low' | 'anxious' | 'motivated'
  energy: number; // 1 = low, 5 = vibrant
  sleep: number; // hours
  symptoms: string[]; // ['cramps', 'bloating', 'headache', 'backache', 'tender_breasts', 'insomnia', 'cravings']
  medication: string;
  exercise: string; // 'none' | 'light' | 'moderate' | 'intense'
  notes: string;
}

export interface UserProfile {
  name: string;
  cycleLength: number; // average days (default 28)
  periodLength: number; // average days (default 5)
  lastPeriodDate: string; // YYYY-MM-DD
}

export interface InsightCard {
  id: string;
  title: string;
  category: 'rhythm' | 'symptoms' | 'sleep' | 'energy' | 'reflection';
  observation: string;
  context: string;
  suggestion: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'veya';
  text: string;
  timestamp: string;
}

export interface LearningArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string;
}
