export function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${label}は正しい数値で入力してください。`);
  }
}

export function assertRate(value: number, label: string): void {
  assertFiniteNumber(value, label);
  if (value < 0 || value > 1) {
    throw new Error(`${label}は0以上1以下で入力してください。`);
  }
}

export function assertName(value: string, label: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${label}を入力してください。`);
  }
  return trimmed;
}

export function assertUniqueNames(names: string[], label: string): void {
  const seen = new Set<string>();
  for (const name of names) {
    const trimmed = assertName(name, label);
    if (seen.has(trimmed)) {
      throw new Error(`${label}が重複しています: ${trimmed}`);
    }
    seen.add(trimmed);
  }
}
