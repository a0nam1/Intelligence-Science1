export type StateValue = {
  state: string;
  value: number;
};

export type Transition = {
  from: string;
  to: string;
  reward: number;
  terminal?: boolean;
};

export type TdUpdateResult = {
  state: string;
  previousValue: number;
  nextValue: number;
  reward: number;
  tdTarget: number;
  tdError: number;
  updatedValue: number;
};

export type EpisodeStepResult = TdUpdateResult & {
  step: number;
  from: string;
  to: string;
  terminal: boolean;
};

export type EpisodeResult = {
  values: Record<string, number>;
  history: EpisodeStepResult[];
};

export type ConvergenceIteration = {
  iteration: number;
  values: Record<string, number>;
  maxChange: number;
};

export type ConvergenceResult = {
  values: Record<string, number>;
  iterations: ConvergenceIteration[];
  iterationCount: number;
  maxChange: number;
  converged: boolean;
};

export type ActionValue = {
  action: string;
  value: number;
};

export type EpsilonGreedyResult = {
  targetAction: string;
  greedyActions: string[];
  maxValue: number;
  actionCount: number;
  greedyActionCount: number;
  exploitationProbability: number;
  explorationProbability: number;
  probability: number;
  isGreedy: boolean;
};

export type QLearningResult = {
  selectedAction: string;
  previousQ: number;
  nextMaxQ: number;
  tdTarget: number;
  tdError: number;
  updatedQ: number;
};
