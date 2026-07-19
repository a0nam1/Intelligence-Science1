import type { RouletteIndividual, RouletteProbability } from "../../types/genetic";

export function calculateRouletteProbabilities(individuals: RouletteIndividual[]): RouletteProbability[] {
  validateIndividuals(individuals);
  const totalFitness = individuals.reduce((sum, individual) => sum + individual.fitness, 0);
  if (totalFitness <= 0) {
    throw new Error("適応度の合計が0のため、ルーレット選択を計算できません。");
  }

  return individuals.map((individual) => ({
    ...individual,
    probability: individual.fitness / totalFitness,
  }));
}

export function selectTournamentWinner(individuals: RouletteIndividual[]): RouletteIndividual[] {
  validateIndividuals(individuals);
  const maxFitness = Math.max(...individuals.map((individual) => individual.fitness));
  return individuals.filter((individual) => individual.fitness === maxFitness);
}

export function validateIndividuals(individuals: RouletteIndividual[]): void {
  if (individuals.length === 0) {
    throw new Error("個体を1つ以上入力してください。");
  }
  individuals.forEach((individual, index) => {
    if (!individual.name.trim()) {
      throw new Error(`${index + 1}番目の個体名を入力してください。`);
    }
    if (!Number.isFinite(individual.fitness) || individual.fitness < 0) {
      throw new Error(`${individual.name}の適応度は0以上の有限数で入力してください。`);
    }
  });
}

export function seededSample<T>(items: T[], size: number, seedText: string): T[] {
  if (!Number.isInteger(size) || size < 1 || size > items.length) {
    throw new Error("トーナメントサイズは1以上、個体数以下の整数で入力してください。");
  }

  const remaining = [...items];
  const sample: T[] = [];
  let seed = hashSeed(seedText || "default-seed");

  while (sample.length < size) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const index = seed % remaining.length;
    sample.push(remaining[index]);
    remaining.splice(index, 1);
  }
  return sample;
}

function hashSeed(seedText: string): number {
  let hash = 2166136261;
  for (const char of seedText) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
