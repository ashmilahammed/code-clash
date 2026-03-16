export function toNumber(
  value: unknown,
  defaultValue: number
): number {
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  }

  return defaultValue;
}