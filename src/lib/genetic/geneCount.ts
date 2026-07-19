export function calculateRequiredGeneCount(numberOfPeople: number): number {
  if (!Number.isInteger(numberOfPeople) || numberOfPeople < 1) {
    throw new Error("人数は1以上の整数で入力してください。");
  }
  return 2 ** Math.ceil(Math.log2(numberOfPeople));
}

export function validateGroupCount(numberOfPeople: number, groupCount: number): void {
  if (!Number.isInteger(groupCount) || groupCount < 1) {
    throw new Error("グループ数は1以上の整数で入力してください。");
  }
  if (groupCount > numberOfPeople) {
    throw new Error("グループ数は人数以下にしてください。");
  }
}
