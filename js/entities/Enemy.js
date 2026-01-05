import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';
import { SPRITES, renderSprite, getSpriteDimensions } from '../utils/SpriteLoader.js';

export class Enemy extends Entity {
  constructor(x, y, type = 'bottom') {
    // Get sprite dimensions based on type (scaled 2x for visibility)
    const pixelSize = 2;
    let sprite;
    if (type === 'top') {
      sprite = SPRITES.SQUID_1;
    } else if (type === 'middle') {
      sprite = SPRITES.CRAB_1;
    } else {
      sprite = SPRITES.OCTOPUS_1;
    }

    const dims = getSpriteDimensions(sprite, pixelSize);
    super(x, y, dims.width, dims.height);

    this.type = type; // 'top', 'middle', or 'bottom' - determines points
    this.animationFrame = 0;
    this.animationTimer = 0;
    this.animationInterval = 500; // Switch frames every 500ms
    this.pixelSize = pixelSize;

    // Point values based on type
    this.points = CONFIG.ENEMY_POINTS[type.toUpperCase()] || CONFIG.ENEMY_POINTS.BOTTOM;
  }

  update(deltaTime) {
    super.update(deltaTime / 1000); // Convert ms to seconds

    // Update animation
    this.animationTimer += deltaTime;
    if (this.animationTimer >= this.animationInterval) {
      this.animationFrame = (this.animationFrame + 1) % 2; // Toggle between 0 and 1
      this.animationTimer = 0;
    }
  }

  render(ctx) {
    // Render pixel-perfect sprites from original 1979 arcade game
    let sprite;

    if (this.type === 'top') {
      sprite = this.animationFrame === 0 ? SPRITES.SQUID_1 : SPRITES.SQUID_2;
    } else if (this.type === 'middle') {
      sprite = this.animationFrame === 0 ? SPRITES.CRAB_1 : SPRITES.CRAB_2;
    } else {
      sprite = this.animationFrame === 0 ? SPRITES.OCTOPUS_1 : SPRITES.OCTOPUS_2;
    }

    // Use arcade color zones based on Y position
    renderSprite(ctx, sprite, this.x, this.y, this.pixelSize, null);
  }
}
