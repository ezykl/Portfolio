// One shared <audio> element reused across every clickable asset, rather
// than each InteractiveLayer owning its own — there can be many clickGlow
// layers in a scene, and they never play concurrently anyway.
let sharedAudio: HTMLAudioElement | undefined;

export function playClickSound(): void {
  if (!sharedAudio) sharedAudio = new Audio('/assets/music/click.wav');
  sharedAudio.currentTime = 0;
  sharedAudio.play().catch(() => {}); // ignore — playback can't be blocked here since this runs from a real click
}
