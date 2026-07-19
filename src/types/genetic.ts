export type CrossoverResult = {
  firstChild: string[];
  secondChild: string[];
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
