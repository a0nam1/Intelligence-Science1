export function formatNumberFixed4(value: number): string {
  if (!Number.isFinite(value)) {
    throw new Error("有限の数値を表示してください。");
  }
  return value.toFixed(4);
}

export function formatNumberListFixed4(values: number[]): string {
  return values.map(formatNumberFixed4).join(" ");
}
