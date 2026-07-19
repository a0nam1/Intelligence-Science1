import type { BlxAlphaResult } from "../../types/genetic";

export function calculateBlxAlphaRange(firstParent: number, secondParent: number, alpha: number): BlxAlphaResult {
  if (!Number.isFinite(firstParent) || !Number.isFinite(secondParent)) {
    throw new Error("親遺伝子は有限の数値で入力してください。");
  }
  if (!Number.isFinite(alpha) || alpha < 0) {
    throw new Error("αは0以上の有限数で入力してください。");
  }

  const minimumParent = Math.min(firstParent, secondParent);
  const maximumParent = Math.max(firstParent, secondParent);
  const interval = maximumParent - minimumParent;
  const extension = alpha * interval;
  const lowerBound = minimumParent - extension;
  const upperBound = maximumParent + extension;
  const average = (lowerBound + upperBound) / 2;

  return {
    firstParent,
    secondParent,
    minimumParent,
    maximumParent,
    interval,
    extension,
    lowerBound,
    upperBound,
    average,
  };
}
