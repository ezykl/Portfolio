import React, { useEffect, useRef, useState } from "react";
import { MUSIC_TOGGLE_EVENT } from "../../engine";

/**
 * Owns the background-music <audio> element for the whole page and toggles it
 * play/pause whenever the in-scene music control (the `music` behavior on
 * `zyk-music`) emits MUSIC_TOGGLE_EVENT. Invisible — the visible control is the
 * scene object itself. Music only ever starts from that explicit click, so
 * there's no autoplay-policy fight.
 */
const TRACK = encodeURI("/assets/music/komii - downtown.mp3");

export const MusicHost: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const onToggle = () => setPlaying((p) => !p);
    window.addEventListener(MUSIC_TOGGLE_EVENT, onToggle as EventListener);
    return () =>
      window.removeEventListener(MUSIC_TOGGLE_EVENT, onToggle as EventListener);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }, [playing]);

  return (
    <audio ref={audioRef} loop preload="none">
      <source src={TRACK} />
    </audio>
  );
};
