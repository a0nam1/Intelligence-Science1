export function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${label}は有限の数値で入力してください。`);
  }
}

export function assertPositiveNumber(value: number, label: string): void {
  assertFiniteNumber(value, label);
  if (value <= 0) {
    throw new Error(`${label}は0より大きい値で入力してください。`);
  }
}

export function assertIterations(iterations: number, max = 100000): void {
  if (!Number.isInteger(iterations) || iterations < 1) {
    throw new Error("更新回数は1以上の整数で入力してください。");
  }
  if (iterations > max) {
    throw new Error(`更新回数は${max}回以下で入力してください。`);
  }
}

export function parseRequiredNumber(value: string, label: string): number {
  if (!value.trim()) {
    throw new Error(`${label}を入力してください。`);
  }
  const parsed = Number(value);
  assertFiniteNumber(parsed, label);
  return parsed;
}
