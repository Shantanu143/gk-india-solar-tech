export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}
