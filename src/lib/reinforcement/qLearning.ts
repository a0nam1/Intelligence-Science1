import type { ActionValue, QLearningResult } from "../../types/reinforcement";
import { selectGreedyActions } from "./epsilonGreedy";
import { assertFiniteNumber, assertRate } from "./validation";

export function updateQValue(
  currentQ: number,
  nextActionValues: number[],
  reward: number,
  alpha: number,
  gamma: number,
  isTerminal: boolean,
): QLearningResult {
  assertFiniteNumber(currentQ, "更新対象のQ値");
  nextActionValues.forEach((value, index) => assertFiniteNumber(value, `移動先のQ値${index + 1}`));
  assertFiniteNumber(reward, "即時報酬");
  assertRate(alpha, "学習率α");
  assertRate(gamma, "割引率γ");

  if (!isTerminal && nextActionValues.length === 0) {
    throw new Error("移動先状態で選択可能な行動とQ値を入力してください。");
  }

  const nextMaxQ = isTerminal ? 0 : Math.max(...nextActionValues);
  const tdTarget = reward + gamma * nextMaxQ;
  const tdError = tdTarget - currentQ;
  const updatedQ = currentQ + alpha * tdError;

  return {
    selectedAction: "",
    previousQ: currentQ,
    nextMaxQ,
    tdTarget,
    tdError,
    updatedQ,
  };
}

export function chooseQAction(actions: ActionValue[], method: "greedy" | "manual", manualAction: string): string {
  if (method === "manual") {
    if (!actions.some((action) => action.action === manualAction)) {
      throw new Error("手動選択した行動が選択可能な行動に含まれていません。");
    }
    return manualAction;
  }
  return selectGreedyActions(actions)[0];
}
