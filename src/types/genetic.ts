export type CrossoverResult = {
  firstChild: string[];
  secondChild: string[];
};

export type PositionCrossoverResult = {
  firstChild: string[];
  secondChild: string[];
  exchangedPositions: number[];
};

export type MutationResult = {
  originalGenes: string[];
  mutatedGenes: string[];
  mutatedPositions: number[];
};

export type FitnessEvaluation = {
  genes: string;
  decimalValue: number;
  fitness: number;
};

export type MaximumFitnessResult = {
  bitLength: number;
  combinationCount: number;
  maximumFitness: number;
  bestIndividuals: FitnessEvaluation[];
  topEvaluations: FitnessEvaluation[];
};

export type RouletteIndividual = {
  id: string;
  name: string;
  fitness: number;
};

export type RouletteProbability = {
  id: string;
  name: string;
  fitness: number;
  probability: number;
};

export type BlxAlphaResult = {
  firstParent: number;
  secondParent: number;
  minimumParent: number;
  maximumParent: number;
  interval: number;
  extension: number;
  lowerBound: number;
  upperBound: number;
  average: number;
};
