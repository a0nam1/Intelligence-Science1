import { describe, expect, it } from "vitest";
import { formatFixed4 } from "../format";
import { knowledgeTerms } from "../../data/knowledgeTerms";
import { calculateBlxAlphaRange } from "./blxAlpha";
import { onePointCrossover, twoPointCrossover } from "./crossover";
import { calculateRequiredGeneCount } from "./geneCount";
import { parseGeneSequence } from "./parser";
import { calculateRouletteProbabilities } from "./selection";

describe("genetic algorithm helpers", () => {
  it("calculates one-point crossover", () => {
    const result = onePointCrossover(parseGeneSequence("0010000"), parseGeneSequence("1101111"), 3);
    expect(result.firstChild.join("")).toBe("0001111");
    expect(result.secondChild.join("")).toBe("1110000");
  });

  it("restores parents with two-point crossover", () => {
    const result = twoPointCrossover(parseGeneSequence("0000000"), parseGeneSequence("1111111"), 3, 6);
    expect(result.firstChild.join("")).toBe("0011110");
    expect(result.secondChild.join("")).toBe("1100001");
  });

  it("keeps leading zeros in crossover results", () => {
    const onePoint = onePointCrossover(parseGeneSequence("001"), parseGeneSequence("110"), 2);
    const twoPoint = twoPointCrossover(parseGeneSequence("001"), parseGeneSequence("110"), 1, 2);
    expect(onePoint.firstChild.join("").startsWith("0")).toBe(true);
    expect(twoPoint.firstChild.join("").startsWith("1")).toBe(true);
  });

  it("rejects parents with different gene counts", () => {
    expect(() => onePointCrossover(parseGeneSequence("001"), parseGeneSequence("11"), 2)).toThrow();
  });

  it("calculates roulette probabilities", () => {
    const result = calculateRouletteProbabilities([
      { id: "1", name: "個体1", fitness: 32 },
      { id: "2", name: "個体2", fitness: 256 },
      { id: "3", name: "個体3", fitness: 2048 },
      { id: "4", name: "個体4", fitness: 8 },
    ]);
    const total = result.reduce((sum, individual) => sum + individual.fitness, 0);
    expect(total).toBe(2344);
    expect(result[2].probability).toBeCloseTo(2048 / 2344);
    expect(formatFixed4(result[2].probability)).toBe("0.8737");
  });

  it("rejects roulette selection when total fitness is zero", () => {
    expect(() => calculateRouletteProbabilities([{ id: "1", name: "個体1", fitness: 0 }])).toThrow();
  });

  it("calculates required gene count", () => {
    expect(calculateRequiredGeneCount(100)).toBe(128);
  });

  it("calculates BLX-alpha range", () => {
    const result = calculateBlxAlphaRange(1.15, -3.85, 0.5);
    expect(result.lowerBound).toBeCloseTo(-6.35);
    expect(result.upperBound).toBeCloseTo(3.65);
    expect(result.average).toBeCloseTo(-1.35);
  });

  it("keeps the BLX-alpha average unchanged when alpha changes", () => {
    expect(calculateBlxAlphaRange(1.15, -3.85, 9999.9999).average).toBeCloseTo(-1.35);
  });

  it("stores genetic algorithm knowledge answers", () => {
    const answers = knowledgeTerms.flatMap((term) => term.answer);
    expect(answers).toEqual(expect.arrayContaining(["一点交叉", "二点交叉", "ルーレット選択", "トーナメント選択", "実数値遺伝的アルゴリズム"]));
  });

  it("stores the TSP genetic question answer as b", () => {
    expect(knowledgeTerms.find((term) => term.id === "ga-tsp-crossover")?.answer).toBe("b");
  });
});
