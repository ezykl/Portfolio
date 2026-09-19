import { useEffect, useState } from "react";

interface UseTypewriterCycleOptions {
  typingSpeed?: number;
  deletingSpeed?: number;
  holdTime?: number;
  active?: boolean;
}

/** Cycles through `words`, typing and deleting each in turn, while `active`. */
export function useTypewriterCycle(
  words: string[],
  {
    typingSpeed = 55,
    deletingSpeed = 30,
    holdTime = 1400,
    active = true,
  }: UseTypewriterCycleOptions = {},
) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!active) return;
    const current = words[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), holdTime);
    } else if (deleting && text === "") {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
    } else {
      const next = deleting
        ? current.slice(0, text.length - 1)
        : current.slice(0, text.length + 1);
      timeout = setTimeout(
        () => setText(next),
        deleting ? deletingSpeed : typingSpeed,
      );
    }

    return () => clearTimeout(timeout);
  }, [
    text,
    deleting,
    wordIndex,
    active,
    words,
    typingSpeed,
    deletingSpeed,
    holdTime,
  ]);

  return text;
}
