export function factorialBigInt(n: number): bigint {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("階乗は0以上の整数で計算してください。");
  }

  let result = 1n;
  for (let value = 2; value <= n; value += 1) {
    result *= BigInt(value);
  }
  return result;
}
