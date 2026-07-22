import React from 'react';
import styles from './AssetLayer.module.css';

/**
 * AssetItem – represents a positioned asset (image or video) inside a scene.
 *
 * `left`, `top`, `width`, and `height` are expressed as **percentages** of the
 * container size. This matches the design of the other scene components.
 */
export interface AssetItem {
  src: string;
  type: 'image' | 'video';
  left: number; // %
  top: number; // %
  width: number; // %
  height: number; // %
  /** Optional video attributes – forwarded to the <video> element */
  videoAttrs?: React.VideoHTMLAttributes<HTMLVideoElement>;
}

interface AssetLayerProps {
  /** Array of assets to render */
  items: AssetItem[];
  /** Aspect ratio string like "16/9" – used to set container‑padding for a responsive box */
  aspectRatio: string;
}

/**
 * AssetLayer – renders a collection of positioned images/videos.
 * The container maintains the requested aspect‑ratio using CSS padding‑bottom.
 */
export const AssetLayer: React.FC<AssetLayerProps> = ({ items, aspectRatio }) => {
  // Parse the aspectRatio string (e.g. "16/9")
  const [w, h] = aspectRatio.split('/').map(Number);
  const paddingBottom = h && w ? `${(h / w) * 100}%` : '56.25%'; // default to 16:9

  return (
    <div className={styles.assetLayer} style={{ paddingBottom }}>
      {items.map((item, idx) => {
        const style: React.CSSProperties = {
          position: 'absolute',
          left: `${item.left}%`,
          top: `${item.top}%`,
          width: `${item.width}%`,
          height: `${item.height}%`,
        };
        if (item.type === 'image') {
          return (
            <img
              key={idx}
              src={item.src}
              alt=""
              style={{ ...style, objectFit: 'contain' }}
            />
          );
        }
        // video
        const { videoAttrs = {} } = item;
        return (
          <video
            key={idx}
            src={item.src}
            style={{ ...style, objectFit: 'contain' }}
            {...videoAttrs}
          />
        );
      })}
    </div>
  );
};
