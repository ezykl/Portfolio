import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface SceneGlowContextValue {
  activeId: string | null;
  setActiveId: React.Dispatch<React.SetStateAction<string | null>>;
}

const SceneGlowContext = createContext<SceneGlowContextValue | undefined>(undefined);

/**
 * At most one clickGlow asset lit within a scene at a time. One instance
 * per SceneEngine (mirrors SceneRefsProvider), so separate scenes never
 * affect each other's glow state.
 */
export const SceneGlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const value = useMemo(() => ({ activeId, setActiveId }), [activeId]);
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
