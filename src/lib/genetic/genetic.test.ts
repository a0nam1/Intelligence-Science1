import { describe, expect, it } from "vitest";
import { formatFixed4 } from "../format";
import { knowledgeTerms } from "../../data/knowledgeTerms";
import { calculateBlxAlphaRange } from "./blxAlpha";
import { crossoverOddPositions, onePointCrossover, twoPointCrossover } from "./crossover";
import {
  binaryGenesToInteger,
  calculateQuadraticFitness,
  findTheoreticalMaximumFitness,
  integerToBinaryGenes,
} from "./fitness";
import { calculateRequiredGeneCount } from "./geneCount";
import { mutateBinaryGenes } from "./mutation";
import { parseGeneSequence, parsePositionList } from "./parser";
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

  it("calculates odd-position crossover sample", () => {
    const result = crossoverOddPositions(parseGeneSequence("1010101"), parseGeneSequence("1110000"));
    expect(result.firstChild.join("")).toBe("1010000");
    expect(result.secondChild.join("")).toBe("1110101");
  });

  it("exchanges positions 1, 3, 5, and 7 as odd positions", () => {
    const result = crossoverOddPositions(parseGeneSequence("1010101"), parseGeneSequence("1110000"));
    expect(result.exchangedPositions).toEqual([1, 3, 5, 7]);
  });

  it("keeps even positions from the original parents in odd-position crossover", () => {
    const firstParent = parseGeneSequence("1010101");
    const secondParent = parseGeneSequence("1110000");
    const result = crossoverOddPositions(firstParent, secondParent);
    expect(result.firstChild[1]).toBe(firstParent[1]);
    expect(result.firstChild[3]).toBe(firstParent[3]);
    expect(result.firstChild[5]).toBe(firstParent[5]);
    expect(result.secondChild[1]).toBe(secondParent[1]);
    expect(result.secondChild[3]).toBe(secondParent[3]);
    expect(result.secondChild[5]).toBe(secondParent[5]);
  });

  it("keeps leading zeros in position crossover results", () => {
    const result = crossoverOddPositions(parseGeneSequence("0011"), parseGeneSequence("0000"));
    expect(result.firstChild.join("")).toBe("0001");
    expect(result.secondChild.join("")).toBe("0010");
    expect(result.firstChild.join("").startsWith("0")).toBe(true);
    expect(result.secondChild.join("").startsWith("0")).toBe(true);
  });

  it("rejects position crossover with different gene counts", () => {
    expect(() => crossoverOddPositions(parseGeneSequence("101"), parseGeneSequence("10"))).toThrow();
  });

  it("calculates binary mutation sample", () => {
    const result = mutateBinaryGenes(parseGeneSequence("0010111"), parsePositionList("1,5"));
    expect(result.mutatedGenes.join("")).toBe("1010011");
  });

  it("does not change unspecified mutation positions", () => {
    const result = mutateBinaryGenes(parseGeneSequence("0010111"), [1, 5]);
    expect(result.mutatedGenes[1]).toBe("0");
    expect(result.mutatedGenes[2]).toBe("1");
    expect(result.mutatedGenes[3]).toBe("0");
    expect(result.mutatedGenes[5]).toBe("1");
    expect(result.mutatedGenes[6]).toBe("1");
  });

  it("flips 0 to 1 and 1 to 0 in mutation", () => {
    const result = mutateBinaryGenes(parseGeneSequence("01"), [1, 2]);
    expect(result.mutatedGenes.join("")).toBe("10");
  });

  it("rejects mutation positions outside the gene range", () => {
    expect(() => mutateBinaryGenes(parseGeneSequence("0010111"), [8])).toThrow();
  });

  it("converts 1111111 to integer 127", () => {
    expect(binaryGenesToInteger(parseGeneSequence("1111111"))).toBe(127);
  });

  it("converts integer 127 to seven-bit genes", () => {
    expect(integerToBinaryGenes(127, 7)).toBe("1111111");
  });

  it("calculates f(127) = 13599 for x squared minus 20x plus 10", () => {
    expect(calculateQuadraticFitness(127, 1, -20, 10)).toBe(13599);
  });

  it("finds maximum fitness 13599 for the seven-bit sample", () => {
    const result = findTheoreticalMaximumFitness(7, 1, -20, 10);
    expect(result.maximumFitness).toBe(13599);
  });

  it("finds 1111111 as the best seven-bit individual", () => {
    const result = findTheoreticalMaximumFitness(7, 1, -20, 10);
    expect(result.bestIndividuals.map((item) => item.genes)).toEqual(["1111111"]);
  });

  it("searches 128 combinations for seven bits", () => {
    const result = findTheoreticalMaximumFitness(7, 1, -20, 10);
    expect(result.combinationCount).toBe(128);
  });

  it("does not remove leading zeros from parsed genes or binary output", () => {
    expect(parseGeneSequence("0010111").join("")).toBe("0010111");
    expect(integerToBinaryGenes(5, 7)).toBe("0000101");
  });
});
