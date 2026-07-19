import type { ActionValue, EpsilonGreedyResult } from "../../types/reinforcement";
import { assertFiniteNumber, assertName, assertRate, assertUniqueNames } from "./validation";

const EPSILON = 1e-12;

export function selectGreedyActions(actions: ActionValue[]): string[] {
  validateActions(actions);
  const maxValue = Math.max(...actions.map((action) => action.value));
  return actions.filter((action) => Math.abs(action.value - maxValue) < EPSILON).map((action) => action.action);
}

export function calculateEpsilonGreedyProbability(
  actions: ActionValue[],
  targetAction: string,
  epsilon: number,
): EpsilonGreedyResult {
  validateActions(actions);
  assertRate(epsilon, "ε");
  const target = assertName(targetAction, "確率を求める対象の行動");

  if (!actions.some((action) => action.action === target)) {
    throw new Error(`対象の行動「${target}」が選択可能な行動に含まれていません。`);
  }

  const greedyActions = selectGreedyActions(actions);
  const maxValue = Math.max(...actions.map((action) => action.value));
  const actionCount = actions.length;
  const greedyActionCount = greedyActions.length;
  const isGreedy = greedyActions.includes(target);
  const exploitationProbability = isGreedy ? (1 - epsilon) / greedyActionCount : 0;
  const explorationProbability = epsilon / actionCount;

  return {
    targetAction: target,
    greedyActions,
    maxValue,
    actionCount,
    greedyActionCount,
    exploitationProbability,
    explorationProbability,
    probability: exploitationProbability + explorationProbability,
    isGreedy,
  };
}

function validateActions(actions: ActionValue[]): void {
  if (actions.length === 0) {
    throw new Error("選択できる行動を入力してください。");
  }
  assertUniqueNames(
    actions.map((action) => action.action),
    "行動名",
  );
  actions.forEach((action) => {
    assertName(action.action, "行動名");
    assertFiniteNumber(action.value, `${action.action}の評価値`);
  });
}
