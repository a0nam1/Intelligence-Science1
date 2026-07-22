import { describe, expect, it } from "vitest";
import { knowledgeTerms } from "../data/knowledgeTerms";
import { isCorrectKnowledgeAnswer, searchKnowledgeQuestions } from "./knowledge";

const addedGeneticQuestionIds = [
  "ga-individual",
  "ga-gene",
  "ga-fitness",
  "ga-selection",
  "ga-crossover",
  "ga-mutation-operation",
];

describe("knowledge terms", () => {
  it("stores individual as a genetic algorithm answer", () => {
    expect(allAnswers()).toContain("個体");
  });

  it("stores gene as a genetic algorithm answer", () => {
    expect(allAnswers()).toContain("遺伝子");
  });

  it("stores fitness as a genetic algorithm answer", () => {
    expect(allAnswers()).toContain("適応度");
  });

  it("stores selection as a genetic algorithm answer", () => {
    expect(allAnswers()).toContain("選択");
  });

  it("stores crossover as a genetic algorithm answer", () => {
    expect(allAnswers()).toContain("交叉");
  });

  it("stores mutation as a genetic algorithm answer", () => {
    expect(allAnswers()).toContain("突然変異");
  });

  it("sets all newly added genetic questions to the genetic algorithm category", () => {
    const addedQuestions = knowledgeTerms.filter((term) => addedGeneticQuestionIds.includes(term.id));
    expect(addedQuestions).toHaveLength(6);
    expect(addedQuestions.every((term) => term.category === "遺伝的アルゴリズム")).toBe(true);
  });

  it("does not duplicate newly added question IDs", () => {
    expect(new Set(addedGeneticQuestionIds).size).toBe(addedGeneticQuestionIds.length);
    const matchingIds = knowledgeTerms.filter((term) => addedGeneticQuestionIds.includes(term.id)).map((term) => term.id);
    expect(new Set(matchingIds).size).toBe(matchingIds.length);
  });

  it("accepts answers with leading and trailing whitespace", () => {
    const individualQuestion = knowledgeTerms.find((term) => term.id === "ga-individual");
    expect(individualQuestion).toBeDefined();
    expect(isCorrectKnowledgeAnswer(individualQuestion!, "　 個体 　")).toBe(true);
  });

  it("finds added questions by keywords", () => {
    expect(searchKnowledgeQuestions(knowledgeTerms, "適応度", "遺伝的アルゴリズム").map((term) => term.id)).toContain("ga-fitness");
    expect(searchKnowledgeQuestions(knowledgeTerms, "遺伝子", "遺伝的アルゴリズム").map((term) => term.id)).toEqual(
      expect.arrayContaining(["ga-gene", "ga-mutation-operation"]),
    );
    expect(searchKnowledgeQuestions(knowledgeTerms, "次に残す個体", "遺伝的アルゴリズム").map((term) => term.id)).toContain(
      "ga-selection",
    );
  });
});

function allAnswers(): string[] {
  return knowledgeTerms.flatMap((term) => (Array.isArray(term.answer) ? term.answer : [term.answer]));
}
