/**
 * Formats seconds into a MM:SS string format
 * @param seconds - The number of seconds to format
 * @returns A string in the format "MM:SS"
 * @example
 * formatSecondsToMMSS(125) // returns "02:05"
 * formatSecondsToMMSS(60)  // returns "01:00"
 * formatSecondsToMMSS(45)  // returns "00:45"
 */
export function formatSecondsToMMSS(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const minutesStr = minutes.toString().padStart(2, '0');
  const secondsStr = remainingSeconds.toString().padStart(2, '0');

  return `${minutesStr}:${secondsStr}`;
}

/**
 * Formats seconds into a HH:MM:SS string format
 * @param seconds - The number of seconds to format
 * @returns A string in the format "HH:MM:SS"
 * @example
 * formatSecondsToHHMMSS(3661) // returns "01:01:01"
 * formatSecondsToHHMMSS(3600) // returns "01:00:00"
 * formatSecondsToHHMMSS(60)   // returns "00:01:00"
 */
export function formatSecondsToHHMMSS(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = Math.floor(seconds % 3600);

  return `${hours}:${formatSecondsToMMSS(remainingSeconds)}`;
}
