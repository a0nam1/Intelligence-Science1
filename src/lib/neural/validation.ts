export function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${label}は有限の数値で入力してください。`);
  }
}

export function assertLearningRate(alpha: number): void {
  assertFiniteNumber(alpha, "学習率α");
  if (alpha <= 0 || alpha > 1) {
    throw new Error("学習率αは0より大きく1以下で入力してください。");
  }
}

export function validateWeightsAndInputs(weights: number[], inputs: number[]): void {
  if (weights.length < 1 || inputs.length < 1) {
    throw new Error("入力数は1以上にしてください。");
  }
  if (weights.length !== inputs.length) {
    throw new Error("重みと入力の個数が一致していません。");
  }
  weights.forEach((weight, index) => assertFiniteNumber(weight, `w${index + 1}`));
  inputs.forEach((input, index) => assertFiniteNumber(input, `x${index + 1}`));
}
