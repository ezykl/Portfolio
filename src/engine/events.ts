import type { PopupContent } from "./types";

/**
 * Window CustomEvent names the engine dispatches for app-level features to
 * listen on. Kept as shared constants so the emitter (behaviors.ts) and the
 * listener (e.g. PopupHost) can never drift apart on the string.
 */
export const POPUP_OPEN_EVENT = "portfolio:popup-open";
export const COLLECTIBLE_FOUND_EVENT = "portfolio:collectible-found";
/** Fired whenever any interactive layer is genuinely clicked (opaque-pixel hit). */
export const LAYER_CLICK_EVENT = "portfolio:layer-click";
/** Fired by the `openMinigame` behavior to open the AllScene find-the-object game. */
export const OPEN_MINIGAME_EVENT = "portfolio:open-minigame";
/** Fired by the `music` behavior to toggle background music play/pause. */
export const MUSIC_TOGGLE_EVENT = "portfolio:music-toggle";
/** Fired by the `errorClick` behavior (error sound + tooltip shake); the layer
 *  itself stays visually stable — InteractiveLayer shakes its own tooltip. */
export const ERROR_CLICK_EVENT = "portfolio:error-click";

/** Detail payload for {@link POPUP_OPEN_EVENT}. */
export interface PopupOpenDetail {
  id?: string;
  content?: PopupContent;
}

/** Detail payload for {@link LAYER_CLICK_EVENT}. */
export interface LayerClickDetail {
  id: string;
}
