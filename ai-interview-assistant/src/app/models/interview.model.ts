export interface Question {
  id: string;
  text: string;
  timestamp: Date;
  category: QuestionCategory;
}

export interface AIResponse {
  id: string;
  questionId: string;
  response: string;
  suggestions: string[];
  confidence: number;
  timestamp: Date;
}

export interface InterviewSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  questions: Question[];
  responses: AIResponse[];
  audioSource: AudioSource;
}

export type QuestionCategory =
  | 'technical'
  | 'behavioral'
  | 'experience'
  | 'motivation'
  | 'other';

export type AudioSource =
  | 'microphone'
  | 'tab-capture'
  | 'screen-share';
