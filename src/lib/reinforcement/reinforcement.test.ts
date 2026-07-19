import { describe, expect, it } from "vitest";
import { calculateEpsilonGreedyProbability } from "./epsilonGreedy";
import { updateQValue } from "./qLearning";
import { buildEpisodeTransitions, parseStateSequence } from "./simulation";
import { repeatTdEpisode, runTdEpisode, updateTdValue } from "./td";

const sampleValues = {
  S1: 3,
  S2: 13,
  S3: 33,
  S4: 43,
  S5: 73,
};

const sampleTransitions = buildEpisodeTransitions(
  parseStateSequence("S3→S2→S1→S2→S3→S4→S5→G2"),
  Object.keys(sampleValues),
  0,
  "G2",
  100,
);

describe("reinforcement learning helpers", () => {
  it("updates TD value from S3 to S4 with gamma 1", () => {
    expect(updateTdValue(30, 40, 0, 0.1, 1, false).updatedValue).toBeCloseTo(31);
  });

  it("updates TD value from S3 to S2 with gamma 1", () => {
    expect(updateTdValue(30, 20, 0, 0.1, 1, false).updatedValue).toBeCloseTo(29);
  });

  it("updates TD value from S3 to S4 with gamma 0.9", () => {
    expect(updateTdValue(30, 40, 0, 0.1, 0.9, false).updatedValue).toBeCloseTo(30.6);
  });

  it("updates TD value from S3 to S2 with gamma 0.9", () => {
    expect(updateTdValue(30, 20, 0, 0.1, 0.9, false).updatedValue).toBeCloseTo(28.8);
  });

  it("runs the sample TD episode with online updates", () => {
    const result = runTdEpisode(sampleValues, sampleTransitions, 0.5, 1);

    expect(result.values.S1).toBeCloseTo(5.5);
    expect(result.values.S2).toBeCloseTo(15.5);
    expect(result.values.S3).toBeCloseTo(33);
    expect(result.values.S4).toBeCloseTo(58);
    expect(result.values.S5).toBeCloseTo(86.5);
  });

  it("converges S1 close to 100 when the sample episode is repeated", () => {
    const result = repeatTdEpisode(sampleValues, sampleTransitions, 0.5, 1, {
      tolerance: 1e-10,
      maxIterations: 100000,
    });

    expect(result.values.S1).toBeCloseTo(100, 6);
  });

  it("calculates epsilon-greedy probability for a greedy action", () => {
    const result = calculateEpsilonGreedyProbability(
      [
        { action: "S1へ移動", value: 98 },
        { action: "S3へ移動", value: 33 },
      ],
      "S1へ移動",
      0.1,
    );

    expect(result.probability).toBeCloseTo(0.95);
  });

  it("updates Q value for sample 1", () => {
    expect(updateQValue(80, [40, 50], 0, 0.1, 0.9, false).updatedQ).toBeCloseTo(76.5);
  });

  it("updates Q value for a terminal next state", () => {
    expect(updateQValue(100, [], 0, 0.1, 0.9, true).updatedQ).toBeCloseTo(90);
  });

  it("updates Q value for sample 3", () => {
    expect(updateQValue(90, [40, 50], 0, 0.1, 0.9, false).updatedQ).toBeCloseTo(85.5);
  });

  it("supports tied greedy actions in epsilon-greedy", () => {
    const result = calculateEpsilonGreedyProbability(
      [
        { action: "左", value: 10 },
        { action: "右", value: 10 },
        { action: "待機", value: 0 },
      ],
      "左",
      0.3,
    );

    expect(result.greedyActions).toEqual(["左", "右"]);
    expect(result.probability).toBeCloseTo(0.3 / 3 + 0.7 / 2);
  });

  it("uses zero next value for terminal TD updates", () => {
    expect(updateTdValue(73, 999, 100, 0.5, 1, true).updatedValue).toBeCloseTo(86.5);
    expect(updateQValue(100, [999], 0, 0.1, 0.9, true).nextMaxQ).toBe(0);
  });
});
