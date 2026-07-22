import type { MutationResult } from "../../types/genetic";

export function mutateBinaryGenes(genes: string[], positions: number[]): MutationResult {
  validateBinaryGenes(genes);
  const mutatedPositions = normalizeMutationPositions(positions, genes.length);
  const mutatedSet = new Set(mutatedPositions);

  return {
    originalGenes: [...genes],
    mutatedGenes: genes.map((gene, index) => {
      if (!mutatedSet.has(index + 1)) {
        return gene;
      }
      return gene === "0" ? "1" : "0";
    }),
    mutatedPositions,
  };
}

function validateBinaryGenes(genes: string[]): void {
  if (genes.length === 0) {
    throw new Error("遺伝子列を入力してください。");
  }
  const invalidGene = genes.find((gene) => gene !== "0" && gene !== "1");
  if (invalidGene !== undefined) {
    throw new Error("遺伝子は0または1だけで入力してください。");
  }
}

function normalizeMutationPositions(positions: number[], geneCount: number): number[] {
  const uniquePositions = [...new Set(positions)];
  if (uniquePositions.length === 0) {
    throw new Error("突然変異位置を1つ以上指定してください。");
  }
  for (const position of uniquePositions) {
    if (!Number.isInteger(position)) {
      throw new Error("突然変異位置は整数で入力してください。");
    }
    if (position < 1) {
      throw new Error("突然変異位置は1以上で入力してください。");
    }
    if (position > geneCount) {
      throw new Error("突然変異位置は遺伝子数以下で入力してください。");
    }
  }
  return uniquePositions.sort((first, second) => first - second);
}
