import type {
  ConvergenceResult,
  EpisodeResult,
  EpisodeStepResult,
  TdUpdateResult,
  Transition,
} from "../../types/reinforcement";
import { assertFiniteNumber, assertRate, assertUniqueNames } from "./validation";

export function updateTdValue(
  currentValue: number,
  nextValue: number,
  reward: number,
  alpha: number,
  gamma: number,
  isTerminal: boolean,
): TdUpdateResult {
  assertFiniteNumber(currentValue, "現在の状態価値");
  assertFiniteNumber(nextValue, "移動先の状態価値");
  assertFiniteNumber(reward, "即時報酬");
  assertRate(alpha, "学習率α");
  assertRate(gamma, "割引率γ");

  const effectiveNextValue = isTerminal ? 0 : nextValue;
  const tdTarget = reward + gamma * effectiveNextValue;
  const tdError = tdTarget - currentValue;
  const updatedValue = currentValue + alpha * tdError;

  return {
    state: "V(s)",
    previousValue: currentValue,
    nextValue: effectiveNextValue,
    reward,
    tdTarget,
    tdError,
    updatedValue,
  };
}

export function runTdEpisode(
  initialValues: Record<string, number>,
  transitions: Transition[],
  alpha: number,
  gamma: number,
): EpisodeResult {
  validateEpisodeInput(initialValues, transitions, alpha, gamma);

  const values = { ...initialValues };
  const history: EpisodeStepResult[] = [];

  transitions.forEach((transition, index) => {
    const currentValue = values[transition.from];
    const nextValue = transition.terminal ? 0 : values[transition.to];
    const update = updateTdValue(currentValue, nextValue, transition.reward, alpha, gamma, Boolean(transition.terminal));
    values[transition.from] = update.updatedValue;

    history.push({
      ...update,
      state: transition.from,
      step: index + 1,
      from: transition.from,
      to: transition.to,
      terminal: Boolean(transition.terminal),
    });
  });

  return { values, history };
}

export function repeatTdEpisode(
  initialValues: Record<string, number>,
  transitions: Transition[],
  alpha: number,
  gamma: number,
  options: {
    repetitions?: number;
    tolerance?: number;
    maxIterations?: number;
  },
): ConvergenceResult {
  validateEpisodeInput(initialValues, transitions, alpha, gamma);

  const fixedRepetitions = options.repetitions;
  const tolerance = options.tolerance ?? 1e-10;
  const maxIterations = options.maxIterations ?? 100000;

  if (fixedRepetitions !== undefined && (!Number.isInteger(fixedRepetitions) || fixedRepetitions < 1)) {
    throw new Error("繰り返し回数は1以上の整数で入力してください。");
  }
  assertFiniteNumber(tolerance, "許容誤差");
  if (tolerance <= 0) {
    throw new Error("許容誤差は0より大きい数値で入力してください。");
  }
  if (!Number.isInteger(maxIterations) || maxIterations < 1) {
    throw new Error("最大反復回数は1以上の整数で入力してください。");
  }

  let currentValues = { ...initialValues };
  const iterations = [];
  let maxChange = Number.POSITIVE_INFINITY;
  const limit = fixedRepetitions ?? maxIterations;
  let converged = false;

  for (let iteration = 1; iteration <= limit; iteration += 1) {
    const before = { ...currentValues };
    const result = runTdEpisode(currentValues, transitions, alpha, gamma);
    currentValues = result.values;
    maxChange = calculateMaxChange(before, currentValues);
    iterations.push({ iteration, values: { ...currentValues }, maxChange });

    if (fixedRepetitions === undefined && maxChange < tolerance) {
      converged = true;
      break;
    }
  }

  if (fixedRepetitions !== undefined) {
    converged = false;
  }

  return {
    values: currentValues,
    iterations,
    iterationCount: iterations.length,
    maxChange,
    converged,
  };
}

function validateEpisodeInput(
  initialValues: Record<string, number>,
  transitions: Transition[],
  alpha: number,
  gamma: number,
): void {
  assertRate(alpha, "学習率α");
  assertRate(gamma, "割引率γ");

  const stateNames = Object.keys(initialValues);
  if (stateNames.length === 0) {
    throw new Error("状態の一覧を入力してください。");
  }
  assertUniqueNames(stateNames, "状態名");

  for (const [state, value] of Object.entries(initialValues)) {
    assertFiniteNumber(value, `${state}の初期状態価値`);
  }

  if (transitions.length === 0) {
    throw new Error("移動順を入力してください。");
  }

  transitions.forEach((transition, index) => {
    if (!stateNames.includes(transition.from)) {
      throw new Error(`${index + 1}番目の現在状態「${transition.from}」は存在しません。`);
    }
    if (!transition.terminal && !stateNames.includes(transition.to)) {
      throw new Error(`${index + 1}番目の移動先「${transition.to}」は存在しません。`);
    }
    assertFiniteNumber(transition.reward, `${index + 1}番目の報酬`);
    if (index > 0 && transitions[index - 1].terminal) {
      throw new Error("終端状態に入った後の遷移はできません。");
    }
  });
}

function calculateMaxChange(before: Record<string, number>, after: Record<string, number>): number {
  return Math.max(...Object.keys(before).map((state) => Math.abs(after[state] - before[state])));
}
