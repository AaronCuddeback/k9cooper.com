/**
 * Day-of-year, used to rotate Cooper's safety tips.
 * Called only from the browser (after hydration) so the server and client
 * never disagree about what day it is.
 */
export function dayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / 86_400_000)
}
