export function parseNumberList(input: string): number[] {
  const normalized = input.replace(/[\[\]]/g, " ").replace(/,/g, " ");
  const tokens = normalized
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    throw new Error("数値を1つ以上入力してください。");
  }

  return tokens.map((token) => {
    const value = Number(token);
    if (!Number.isFinite(value)) {
      throw new Error(`「${token}」は有限の数値ではありません。`);
    }
    return value;
  });
}

export function numbersToListInput(values: number[]): string {
  return values.join(", ");
}
