export type NeuronParameters = {
  weights: number[];
  theta: number;
};

export type TrainingData = {
  inputs: number[];
  desired: number;
};

export type ForwardResult = {
  weightedTerms: number[];
  weightedTermSum: number;
  weightedSum: number;
  stepOutput?: number;
  sigmoidOutput?: number;
};

export type PerceptronUpdateResult = {
  weightedSum: number;
  output: number;
  error: number;
  updatedWeights: number[];
  updatedTheta: number;
};

export type SigmoidUpdateResult = {
  weightedSum: number;
  output: number;
  derivativeFactor: number;
  error: number;
  updatedWeights: number[];
  updatedTheta: number;
};
