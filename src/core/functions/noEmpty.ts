export function noEmpty<T>(value: T | undefined): T {
  if (value == null) throw new Error("value is empty!")
  return value
}