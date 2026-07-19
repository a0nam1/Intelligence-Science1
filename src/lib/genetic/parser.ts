export function parseGeneSequence(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("遺伝子列を入力してください。");
  }

  if (/[,\s]/.test(trimmed)) {
    const genes = trimmed.split(/[,\s]+/).filter(Boolean);
    if (genes.length === 0) {
      throw new Error("遺伝子列を入力してください。");
    }
    return genes;
  }

  return [...trimmed];
}

export function parseFitnessList(value: string): number[] {
  const tokens = value
    .trim()
    .split(/[,\s]+/)
    .filter(Boolean);

  if (tokens.length === 0) {
    throw new Error("適応度を1つ以上入力してください。");
  }

  return tokens.map((token) => {
    const parsed = Number(token);
    if (!Number.isFinite(parsed)) {
      throw new Error(`「${token}」は有限の数値ではありません。`);
    }
    if (parsed < 0) {
      throw new Error("適応度は0以上で入力してください。");
    }
    return parsed;
  });
}

export function parseNamedFitnessList(value: string): { name: string; fitness: number }[] {
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return parseFitnessList(value).map((fitness, index) => ({ name: `個体${index + 1}`, fitness }));
  }

  const named = lines.map((line, index) => {
    const parts = line.split(/[,\s]+/).filter(Boolean);
    if (parts.length === 1) {
      const fitness = Number(parts[0]);
      if (!Number.isFinite(fitness) || fitness < 0) {
        throw new Error(`${index + 1}行目の適応度を0以上の有限数で入力してください。`);
      }
      return { name: `個体${index + 1}`, fitness };
    }
    const fitness = Number(parts[parts.length - 1]);
    if (!Number.isFinite(fitness) || fitness < 0) {
      throw new Error(`${index + 1}行目の適応度を0以上の有限数で入力してください。`);
    }
    return { name: parts.slice(0, -1).join(" "), fitness };
  });

  return named;
}
