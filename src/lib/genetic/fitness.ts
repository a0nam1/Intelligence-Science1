import type { FitnessEvaluation, MaximumFitnessResult } from "../../types/genetic";

const MAX_EXHAUSTIVE_BIT_LENGTH = 20;
const TOP_EVALUATION_COUNT = 10;

export function binaryGenesToInteger(genes: string[]): number {
  validateBinaryGenes(genes);
  return Number.parseInt(genes.join(""), 2);
}

export function integerToBinaryGenes(value: number, bitLength: number): string {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error("整数xは0以上の安全な整数で入力してください。");
  }
  validateBitLength(bitLength);
  const maximumValue = 2 ** bitLength - 1;
  if (value > maximumValue) {
    throw new Error("整数xは指定ビット数で表せる範囲内にしてください。");
  }
  return value.toString(2).padStart(bitLength, "0");
}

export function calculateQuadraticFitness(value: number, a: number, b: number, c: number): number {
  if (![value, a, b, c].every(Number.isFinite)) {
    throw new Error("適応度関数の計算には有限の数値を入力してください。");
  }
  return a * value ** 2 + b * value + c;
}

export function findTheoreticalMaximumFitness(
  bitLength: number,
  a: number,
  b: number,
  c: number,
): MaximumFitnessResult {
  validateBitLength(bitLength);
  if (bitLength > MAX_EXHAUSTIVE_BIT_LENGTH) {
    throw new Error("全探索の組み合わせ数が多すぎます。ビット数を20以下にしてください。");
  }
  if (![a, b, c].every(Number.isFinite)) {
    throw new Error("係数a、b、cは有限の数値で入力してください。");
  }

  const combinationCount = 2 ** bitLength;
  let maximumFitness = Number.NEGATIVE_INFINITY;
  const bestIndividuals: FitnessEvaluation[] = [];
  const allEvaluations: FitnessEvaluation[] = [];

  for (let value = 0; value < combinationCount; value += 1) {
    const evaluation = {
      genes: integerToBinaryGenes(value, bitLength),
      decimalValue: value,
      fitness: calculateQuadraticFitness(value, a, b, c),
    };
    allEvaluations.push(evaluation);

    if (evaluation.fitness > maximumFitness) {
      maximumFitness = evaluation.fitness;
      bestIndividuals.length = 0;
      bestIndividuals.push(evaluation);
    } else if (evaluation.fitness === maximumFitness) {
      bestIndividuals.push(evaluation);
    }
  }

  return {
    bitLength,
    combinationCount,
    maximumFitness,
    bestIndividuals,
    topEvaluations: allEvaluations
      .sort((first, second) => second.fitness - first.fitness || first.decimalValue - second.decimalValue)
      .slice(0, TOP_EVALUATION_COUNT),
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

function validateBitLength(bitLength: number): void {
  if (!Number.isInteger(bitLength) || bitLength < 1) {
    throw new Error("ビット数は1以上の整数で入力してください。");
  }
}
