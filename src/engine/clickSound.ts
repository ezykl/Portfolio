// One shared <audio> element per sound file, created lazily on first use and
// cached — rapid repeat clicks reuse the same element (reset to 0 and replayed)
// instead of piling up new ones.
const audioCache: Map<string, HTMLAudioElement> = new Map();

/**
 * Returns (creating and caching on first use) the audio element for a file in
 * /assets/music/.
 */
function getAudio(soundFile: string): HTMLAudioElement {
  if (!audioCache.has(soundFile)) {
    const audio = new Audio(`/assets/music/${soundFile}`);
    audio.preload = "auto"; // hint to the browser to fetch it up front
    audioCache.set(soundFile, audio);
  }
  return audioCache.get(soundFile)!;
}

/**
 * Plays a sound effect. Safe to call before any user gesture has unlocked
 * audio only if invoked from a real click — playback errors are swallowed.
 */
export function playSound(soundFile: string): void {
  const audio = getAudio(soundFile);
  audio.currentTime = 0;
  audio.play().catch(() => {}); // ignore failures from rapid repeat clicks
}

/**
 * Plays the standard click sound (backward-compatible shorthand).
 */
export function playClickSound(): void {
  playSound("click.wav");
}
