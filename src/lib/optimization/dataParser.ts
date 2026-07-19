import type { DataPoint } from "../../types/optimization";

export function parseDataPoints(input: string): DataPoint[] {
  if (!input.trim()) {
    throw new Error("一括入力欄に学習データを入力してください。");
  }

  const parenthesized = [...input.matchAll(/\(\s*([^,\s()]+)\s*,\s*([^,\s()]+)\s*\)/g)];
  if (parenthesized.length > 0) {
    return parenthesized.map((match) => parsePair(match[1], match[2]));
  }

  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error("学習データが1件もありません。");
  }

  return lines.map((line, index) => {
    const parts = line.split(/[,\s]+/).filter(Boolean);
    if (parts.length !== 2) {
      throw new Error(`${index + 1}行目はxとyの2つの数値で入力してください。`);
    }
    return parsePair(parts[0], parts[1]);
  });
}

function parsePair(xText: string, yText: string): DataPoint {
  const x = Number(xText);
  const y = Number(yText);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    throw new Error("学習データには有限の数値を入力してください。");
  }
  return { x, y };
}
