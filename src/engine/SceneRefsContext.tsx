import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';

type RefMap = Map<string, HTMLElement | null>;

export interface SceneRefsApi {
  /** Current DOM node for a layer id, or undefined if it hasn't mounted (yet). */
  get: (id: string) => HTMLElement | null | undefined;
  /** Called by InteractiveLayer as its element mounts/unmounts. Not meant to be called by consumers directly. */
  set: (id: string, el: HTMLElement | null) => void;
}

const SceneRefsContext = createContext<SceneRefsApi | null>(null);

/**
 * Scopes a live `id -> DOM node` registry to one scene subtree. Wrapping
 * every `SceneEngine` in its own provider (rather than one global registry)
 * means `refs.get('lamp')` always means "the lamp in this scene" even if
 * multiple scenes are mounted at once.
 *
 * Consumers (GSAP timelines, tooltips, sound triggers, camera focus, ...)
 * read through `useSceneRefs()` instead of `document.querySelector` or
 * threading refs through nested JSX.
 */
export const SceneRefsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mapRef = useRef<RefMap>(new Map());

  const api = useMemo<SceneRefsApi>(
    () => ({
      get: (id) => mapRef.current.get(id),
      set: (id, el) => {
        mapRef.current.set(id, el);
      },
    }),
    []
  );

  return <SceneRefsContext.Provider value={api}>{children}</SceneRefsContext.Provider>;
};

/** `const refs = useSceneRefs(); refs.get('lamp')` — for use by future interaction/animation code. */
export function useSceneRefs(): SceneRefsApi {
  const ctx = useContext(SceneRefsContext);
  if (!ctx) {
    throw new Error('useSceneRefs() must be called within a <SceneEngine> / <SceneRefsProvider> subtree.');
  }
  return ctx;
}

/** Callback ref that registers a layer's DOM node under its id. Used internally by InteractiveLayer. */
export function useSceneRef(id: string) {
  const { set } = useSceneRefs();
  return useCallback((el: HTMLElement | null) => set(id, el), [set, id]);
}
