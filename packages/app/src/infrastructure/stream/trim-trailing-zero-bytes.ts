export function trimTrailingZeroBytes(string: string): string {
  let end = string.length

  while (end > 0 && string[end - 1] === '\x00') {
    --end
  }

  return end < string.length ? string.substring(0, end) : string
}
