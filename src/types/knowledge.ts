export type KnowledgeCategory = "強化学習" | "ニューラルネットワーク" | "遺伝的アルゴリズム" | "最適化";

export type KnowledgeQuestion = {
  id: string;
  category: KnowledgeCategory;
  question: string;
  answer: string | string[];
  choices?: {
    id: string;
    text: string;
  }[];
  explanation?: string;
};
