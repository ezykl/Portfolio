// Preload audio elements for instant playback without delay
const audioCache: Map<string, HTMLAudioElement> = new Map();


function preloadEssentialSounds() {
  const essentialSounds = ['click.wav', 'error.flac'];
  essentialSounds.forEach(sound => {
    if (!audioCache.has(sound)) {
      const audio = new Audio(`/assets/music/${sound}`);
      audio.preload = 'auto';
      audioCache.set(sound, audio);
    }
  });
}

// Call preload immediately when module loads
if (typeof window !== 'undefined') {
  preloadEssentialSounds();
}

/**
 * Preloads and returns an audio element for the given sound file
 */
function getAudio(soundFile: string): HTMLAudioElement {
  if (!audioCache.has(soundFile)) {
    const audio = new Audio(`/assets/music/${soundFile}`);
    audio.preload = 'auto'; // Hint to browser to preload
    audioCache.set(soundFile, audio);
  }
  return audioCache.get(soundFile)!;
}


/**
 * Plays a sound effect instantly (no delay from lazy loading)
 */
export function playSound(soundFile: string): void {
  const audio = getAudio(soundFile);
  audio.currentTime = 0;
  audio.play().catch(() => {}); // Ignoreplayback errors from rapid clicks
}

/**
 * Plays the standard click sound (backward compatibility)
 */
export function playClickSound(): void {
  playSound('click.wav');
}