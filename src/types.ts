export interface Answer {
  id: number | string;
  is_true: boolean;
  text: string;
}

export interface QuestionAnswer {
  answer_id: number | null;
  answers: Answer[];
  feedback_false: string;
  feedback_true: string;
  id: number | string;
  text: string;
}

export interface Quiz {
  created: string;
  description: string;
  id: number | string;
  modified: string;
  questions_answers: QuestionAnswer[];
  score: number | null;
  title: string;
  url: string;
}
