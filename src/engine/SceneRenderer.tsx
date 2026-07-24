import React, { useMemo } from 'react';
import type { Scene } from './types';
import { LayerRenderer } from './LayerRenderer';
import styles from './SceneRenderer.module.css';

/**
 * Renders a Scene's aspect-ratio box and hands off to LayerRenderer.
 * Deliberately thin: layout math here is limited to the one thing every
 * scene needs (the padding-bottom aspect-ratio trick) — everything
 * per-asset lives in InteractiveLayer.
 */
export const SceneRenderer: React.FC<{ scene: Scene }> = ({ scene }) => {
  const [w, h] = scene.aspectRatio.split('/').map(Number);
  const paddingBottom = h && w ? `${(h / w) * 100}%` : '56.25%'; // default to 16:9

  const layersById = useMemo(
    () => new Map(scene.layers.map((layer) => [layer.id, layer])),
    [scene.layers]
  );

  return (
    <div className={styles.sceneRenderer} style={{ paddingBottom }}>
      <LayerRenderer layers={scene.layers} layersById={layersById} />
    </div>
  );
};
