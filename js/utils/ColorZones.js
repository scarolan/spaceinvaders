import { CONFIG } from '../config.js';

/**
 * Get the arcade laminate color for a given Y position
 * Emulates the colored plastic overlays on the original arcade cabinet
 */
export function getColorForY(y) {
  for (let zone of CONFIG.COLOR_ZONES) {
    if (y >= zone.yStart && y < zone.yEnd) {
      return zone.color;
    }
  }

  // Default to white if outside all zones
  return '#ffffff';
}
