export type AppMode = 'form' | 'chat';

export const toneOptions = ['Professional', 'Friendly', 'Witty', 'Formal'] as const;
export type ToneOption = typeof toneOptions[number];

export interface FormState {
  topicSubject: string;
  tones: ToneOption[];
  audience: string[];
  keyPoints: string;
  length: number;
  seoKeywords: string[];
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'assistant';
  text: string;
  status: 'sent' | 'loading' | 'error';
}

export interface Conversation {
    id: number;
    title: string;
    messages: ChatMessage[];
}
