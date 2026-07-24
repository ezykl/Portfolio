import React from 'react';
import type { Scene } from './types';
import { SceneRefsProvider } from './SceneRefsContext';
import { SceneGlowProvider } from './SceneGlowContext';
import { SceneRenderer } from './SceneRenderer';

/**
 * Public entry point: SceneEngine -> SceneRenderer -> LayerRenderer -> InteractiveLayer.
 *
 * Each SceneEngine instance gets its own refs registry and glow state, so a
 * scene's assets are addressable via `useSceneRefs()` and its clickGlow
 * exclusivity is scoped to that scene, without colliding with another
 * mounted scene.
 */
export const SceneEngine: React.FC<{ scene: Scene }> = ({ scene }) => (
  <SceneRefsProvider>
    <SceneGlowProvider>
      <SceneRenderer scene={scene} />
    </SceneGlowProvider>
  </SceneRefsProvider>
);
