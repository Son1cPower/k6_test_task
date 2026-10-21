export function toMillis(timestamp: string): number {
  return Date.parse(timestamp.replace(/\[.*\]$/, ''));
}
