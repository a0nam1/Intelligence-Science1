export function formatBigIntWithCommas(value: bigint): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatNumberWithCommas(value: string): string {
  const [integerPart, decimalPart] = value.split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimalPart === undefined ? formattedInteger : `${formattedInteger}.${decimalPart}`;
}

export function formatFixed4(value: number): string {
  return value.toFixed(4);
}

export function formatRawNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "";
  }
  return Number.isInteger(value) ? value.toString() : value.toPrecision(15).replace(/\.?0+$/, "");
}
