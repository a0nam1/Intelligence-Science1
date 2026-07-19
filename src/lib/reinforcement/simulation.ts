import type { StateValue, Transition } from "../../types/reinforcement";
import { assertFiniteNumber, assertName, assertUniqueNames } from "./validation";

export function parseStateSequence(input: string): string[] {
  const normalized = input.replace(/→/g, " ").replace(/->/g, " ");
  const states = normalized
    .split(/\s+/)
    .map((state) => state.trim())
    .filter(Boolean);

  if (states.length < 2) {
    throw new Error("移動順は2つ以上の状態で入力してください。");
  }
  return states;
}

export function stateValuesToRecord(states: StateValue[]): Record<string, number> {
  if (states.length === 0) {
    throw new Error("状態の一覧を入力してください。");
  }
  assertUniqueNames(
    states.map((state) => state.state),
    "状態名",
  );

  return states.reduce<Record<string, number>>((record, item) => {
    const state = assertName(item.state, "状態名");
    assertFiniteNumber(item.value, `${state}の状態価値`);
    record[state] = item.value;
    return record;
  }, {});
}

export function buildEpisodeTransitions(
  sequence: string[],
  knownStates: string[],
  normalReward: number,
  terminalState: string,
  terminalReward: number,
): Transition[] {
  assertFiniteNumber(normalReward, "通常の遷移報酬");
  assertFiniteNumber(terminalReward, "終端状態に入ったときの報酬");
  const terminal = assertName(terminalState, "終端状態");

  return sequence.slice(0, -1).map((from, index) => {
    const to = sequence[index + 1];
    if (!knownStates.includes(from)) {
      throw new Error(`現在状態「${from}」は状態一覧にありません。`);
    }
    const isTerminal = to === terminal;
    if (!isTerminal && !knownStates.includes(to)) {
      throw new Error(`移動先「${to}」は状態一覧にありません。`);
    }
    if (index > 0 && sequence[index] === terminal) {
      throw new Error("終端状態から次の状態へ移動することはできません。");
    }
    return {
      from,
      to,
      reward: isTerminal ? terminalReward : normalReward,
      terminal: isTerminal,
    };
  });
}
