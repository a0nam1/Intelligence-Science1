import type { KnowledgeQuestion } from "../types/knowledge";

export function normalizeKnowledgeAnswer(value: string): string {
  return value.replace(/\u3000/g, " ").trim().replace(/\s+/g, " ");
}

export function getKnowledgeAnswerText(item: KnowledgeQuestion): string {
  return Array.isArray(item.answer) ? item.answer.join(" / ") : item.answer;
}

export function isCorrectKnowledgeAnswer(item: KnowledgeQuestion, answer: string): boolean {
  const normalizedAnswer = normalizeKnowledgeAnswer(answer);
  if (!normalizedAnswer) {
    return false;
  }

  const acceptedAnswers = [
    ...(Array.isArray(item.answer) ? item.answer : [item.answer]),
    ...(item.acceptedAnswers ?? []),
  ];

  return acceptedAnswers.some((acceptedAnswer) => normalizeKnowledgeAnswer(acceptedAnswer) === normalizedAnswer);
}

export function searchKnowledgeQuestions(
  questions: KnowledgeQuestion[],
  keyword: string,
  category: "すべて" | KnowledgeQuestion["category"],
): KnowledgeQuestion[] {
  const normalizedKeyword = normalizeKnowledgeAnswer(keyword).toLowerCase();

  return questions.filter((item) => {
    const searchableText = [
      item.question,
      getKnowledgeAnswerText(item),
      item.explanation ?? "",
      ...(item.acceptedAnswers ?? []),
      ...(item.choices?.map((choice) => choice.text) ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return (category === "すべて" || item.category === category) && (!normalizedKeyword || searchableText.includes(normalizedKeyword));
  });
}
