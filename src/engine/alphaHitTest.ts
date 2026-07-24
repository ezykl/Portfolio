const SAMPLE_SIZE = 64; // long-edge px — enough resolution to tell opaque from transparent without a full-res canvas read
const ALPHA_THRESHOLD = 10; // 0-255; near-zero alpha (incl. anti-aliased edges) counts as "transparent"

let scratchCanvas: HTMLCanvasElement | undefined;
function getScratchCanvas(): HTMLCanvasElement {
  if (!scratchCanvas) scratchCanvas = document.createElement('canvas');
  return scratchCanvas;
}

interface ContentSpace {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  /** Cursor position mapped into 0..1 content-space (post objectFit:contain letterbox removal). May fall outside 0..1 when the cursor is over a letterbox bar. */
  contentX: number;
  contentY: number;
}

/**
 * Draws the current frame of an <img>/<video> element into a small offscreen
 * canvas and maps a client-space point into the media's own content space
 * (i.e. undoing `objectFit: contain` letterboxing). Sampling the live
 * element — rather than pre-decoding a separate Image — means this works
 * identically for playing video and static images.
 *
 * Returns undefined when the media isn't ready to sample yet (not decoded,
 * zero-size box) — callers should fail open in that case.
 */
function prepare(
  media: HTMLImageElement | HTMLVideoElement,
  clientX: number,
  clientY: number
): ContentSpace | undefined {
  const naturalWidth = media instanceof HTMLVideoElement ? media.videoWidth : media.naturalWidth;
  const naturalHeight = media instanceof HTMLVideoElement ? media.videoHeight : media.naturalHeight;
  const rect = media.getBoundingClientRect();
  if (!naturalWidth || !naturalHeight || rect.width === 0 || rect.height === 0) return undefined;

  const xRatio = (clientX - rect.left) / rect.width;
  const yRatio = (clientY - rect.top) / rect.height;

  const boxAspect = rect.width / rect.height;
  const mediaAspect = naturalWidth / naturalHeight;
  let contentX = xRatio;
  let contentY = yRatio;
  if (mediaAspect > boxAspect) {
    const contentHeightRatio = boxAspect / mediaAspect;
    const offset = (1 - contentHeightRatio) / 2;
    contentY = (yRatio - offset) / contentHeightRatio;
  } else if (mediaAspect < boxAspect) {
    const contentWidthRatio = mediaAspect / boxAspect;
    const offset = (1 - contentWidthRatio) / 2;
    contentX = (xRatio - offset) / contentWidthRatio;
  }

  const canvasWidth = mediaAspect >= 1 ? SAMPLE_SIZE : Math.round(SAMPLE_SIZE * mediaAspect);
  const canvasHeight = mediaAspect >= 1 ? Math.round(SAMPLE_SIZE / mediaAspect) : SAMPLE_SIZE;
  const canvas = getScratchCanvas();
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return undefined;

  try {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(media, 0, 0, canvasWidth, canvasHeight);
  } catch {
    return undefined; // tainted canvas / decode error
  }

  return { ctx, canvasWidth, canvasHeight, contentX, contentY };
}

function sampleAlpha(space: ContentSpace, x: number, y: number): boolean {
  if (x < 0 || x > 1 || y < 0 || y > 1) return false; // outside the media content (letterbox bar)
  const px = Math.min(space.canvasWidth - 1, Math.max(0, Math.floor(x * space.canvasWidth)));
  const py = Math.min(space.canvasHeight - 1, Math.max(0, Math.floor(y * space.canvasHeight)));
  try {
    return space.ctx.getImageData(px, py, 1, 1).data[3] > ALPHA_THRESHOLD;
  } catch {
    return true; // tainted canvas read — fail open rather than making the asset permanently dead
  }
}

/**
 * Exact pixel-precision opacity test. Used for click: a click is an aimed,
 * deliberate action, so requiring the actual visible pixel is reasonable —
 * clicking on an asset's see-through padding shouldn't activate it.
 */
export function isOpaqueAt(
  media: HTMLImageElement | HTMLVideoElement,
  clientX: number,
  clientY: number
): boolean {
  const space = prepare(media, clientX, clientY);
  if (!space) return true;
  return sampleAlpha(space, space.contentX, space.contentY);
}
