import type { CrossoverResult, PositionCrossoverResult } from "../../types/genetic";

export function onePointCrossover(
  firstParent: string[],
  secondParent: string[],
  crossoverPosition: number,
): CrossoverResult {
  validateParents(firstParent, secondParent);
  if (!Number.isInteger(crossoverPosition) || crossoverPosition < 1 || crossoverPosition > firstParent.length) {
    throw new Error("一点交叉の位置は1以上、遺伝子数以下で入力してください。");
  }

  const index = crossoverPosition - 1;
  return {
    firstChild: firstParent.slice(0, index).concat(secondParent.slice(index)),
    secondChild: secondParent.slice(0, index).concat(firstParent.slice(index)),
  };
}

export function twoPointCrossover(
  firstParent: string[],
  secondParent: string[],
  startPosition: number,
  endPosition: number,
): CrossoverResult {
  validateParents(firstParent, secondParent);
  if (!Number.isInteger(startPosition) || !Number.isInteger(endPosition)) {
    throw new Error("交叉位置は整数で入力してください。");
  }
  if (startPosition < 1 || endPosition < 1 || startPosition > firstParent.length || endPosition > firstParent.length) {
    throw new Error("二点交叉の開始位置と終了位置は範囲内で入力してください。");
  }
  if (startPosition > endPosition) {
    throw new Error("開始位置は終了位置以下にしてください。");
  }

  const startIndex = startPosition - 1;
  const endIndex = endPosition;
  return {
    firstChild: firstParent
      .slice(0, startIndex)
      .concat(secondParent.slice(startIndex, endIndex), firstParent.slice(endIndex)),
    secondChild: secondParent
      .slice(0, startIndex)
      .concat(firstParent.slice(startIndex, endIndex), secondParent.slice(endIndex)),
  };
}

export function crossoverByPositions(
  firstParent: string[],
  secondParent: string[],
  positions: number[],
): PositionCrossoverResult {
  validateParents(firstParent, secondParent);
  validateBinaryGenes(firstParent, "個体1");
  validateBinaryGenes(secondParent, "個体2");

  const exchangedPositions = normalizePositions(positions, firstParent.length);
  const exchangedSet = new Set(exchangedPositions);

  return {
    firstChild: firstParent.map((gene, index) => (exchangedSet.has(index + 1) ? secondParent[index] : gene)),
    secondChild: secondParent.map((gene, index) => (exchangedSet.has(index + 1) ? firstParent[index] : gene)),
    exchangedPositions,
  };
}

export function crossoverOddPositions(firstParent: string[], secondParent: string[]): PositionCrossoverResult {
  validateParents(firstParent, secondParent);
  return crossoverByPositions(firstParent, secondParent, positionsByParity(firstParent.length, "odd"));
}

export function crossoverEvenPositions(firstParent: string[], secondParent: string[]): PositionCrossoverResult {
  validateParents(firstParent, secondParent);
  return crossoverByPositions(firstParent, secondParent, positionsByParity(firstParent.length, "even"));
}

function validateParents(firstParent: string[], secondParent: string[]): void {
  if (firstParent.length === 0 || secondParent.length === 0) {
    throw new Error("個体の遺伝子列は空にできません。");
  }
  if (firstParent.length !== secondParent.length) {
    throw new Error("個体1と個体2の遺伝子数が一致していません。");
  }
}

function validateBinaryGenes(genes: string[], label: string): void {
  const invalidGene = genes.find((gene) => gene !== "0" && gene !== "1");
  if (invalidGene !== undefined) {
    throw new Error(`${label}の遺伝子は0または1だけで入力してください。`);
  }
}

function normalizePositions(positions: number[], geneCount: number): number[] {
  const uniquePositions = [...new Set(positions)];
  if (uniquePositions.length === 0) {
    throw new Error("交換対象の位置を1つ以上指定してください。");
  }
  for (const position of uniquePositions) {
    if (!Number.isInteger(position)) {
      throw new Error("交換対象の位置は整数で入力してください。");
    }
    if (position < 1 || position > geneCount) {
      throw new Error("交換対象の位置は1以上、遺伝子数以下で入力してください。");
    }
  }
  return uniquePositions.sort((first, second) => first - second);
}

function positionsByParity(geneCount: number, parity: "odd" | "even"): number[] {
  const start = parity === "odd" ? 1 : 2;
  const positions: number[] = [];
  for (let position = start; position <= geneCount; position += 2) {
    positions.push(position);
  }
  return positions;
}
