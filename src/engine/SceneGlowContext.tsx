import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface SceneGlowContextValue {
  activeId: string | null;
  setActiveId: React.Dispatch<React.SetStateAction<string | null>>;
}

const SceneGlowContext = createContext<SceneGlowContextValue | undefined>(undefined);

/**
 * At most one clickGlow asset lit at a time within whichever tree shares a
 * single SceneGlowProvider. SceneEngine wraps every scene with one of these
 * so a scene works standalone — but nesting-safe: if an ancestor already
 * provides glow state (e.g. several composited, overlapping scenes sharing
 * one explicit SceneGlowProvider higher up, as in Hero), this becomes a
 * no-op passthrough instead of shadowing it with a fresh, scene-local one.
 * That's what makes glow exclusivity span multiple visually-overlapping
 * scenes instead of stopping at each one's own boundary.
 */
export const SceneGlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const existing = useContext(SceneGlowContext);
  const [activeId, setActiveId] = useState<string | null>(null);
  const value = useMemo(() => ({ activeId, setActiveId }), [activeId]);
  if (existing) return <>{children}</>;
  return <SceneGlowContext.Provider value={value}>{children}</SceneGlowContext.Provider>;
};

/** Clicking a new clickGlow layer turns off whichever was previously lit; clicking the lit one again turns it off. */
export function useSceneGlow(layerId: string): { glowOn: boolean; toggleGlow: () => void } {
  const ctx = useContext(SceneGlowContext);
  if (!ctx) throw new Error('useSceneGlow must be used within a SceneGlowProvider (i.e. inside SceneEngine)');
  const { activeId, setActiveId } = ctx;
  const toggleGlow = useCallback(() => {
    setActiveId((current) => (current === layerId ? null : layerId));
  }, [layerId, setActiveId]);
  return { glowOn: activeId === layerId, toggleGlow };
}
