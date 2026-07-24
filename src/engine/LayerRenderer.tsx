import React from 'react';
import type { SceneLayer } from './types';
import { InteractiveLayer } from './InteractiveLayer';

interface LayerRendererProps {
  layers: SceneLayer[];
  layersById: Map<string, SceneLayer>;
}

/**
 * Purely rendering — no interaction logic lives here. Placement, hover,
 * click, drag, etc. all belong to InteractiveLayer; this just maps data to
 * components in DOM order (which is also stacking order, since no layer
 * sets an explicit zIndex today).
 */
export const LayerRenderer: React.FC<LayerRendererProps> = ({ layers, layersById }) => (
  <>
    {layers.map((layer) => (
      <InteractiveLayer key={layer.id} layer={layer} layersById={layersById} />
    ))}
  </>
);
