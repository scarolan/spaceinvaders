import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';
import { SPRITES, renderSprite, getSpriteDimensions } from '../utils/SpriteLoader.js';

export class UFO extends Entity {
  constructor(x, y, direction = 1) {
    const dimensions = getSpriteDimensions(SPRITES.UFO, 2);
    super(x, y, dimensions.width, dimensions.height);

    this.direction = direction; // 1 = left-to-right, -1 = right-to-left
    this.speed = 100; // pixels per second (slow, steady movement)
    this.velocity.x = this.speed * this.direction;

    // Random bonus point value (50, 100, 150, 200, 250, or 300)
    const bonusValues = [50, 100, 150, 200, 250, 300];
    this.points = bonusValues[Math.floor(Math.random() * bonusValues.length)];

    // Track if we've been hit (to show score briefly)
    this.showScore = false;
    this.scoreDisplayTimer = 0;
    this.scoreDisplayDuration = 1000; // milliseconds
  }

  update(deltaTime) {
    if (!this.alive) {
      // If destroyed, count down score display timer
      if (this.showScore) {
        this.scoreDisplayTimer += deltaTime;
        if (this.scoreDisplayTimer >= this.scoreDisplayDuration) {
          this.showScore = false;
        }
      }
      return;
    }

    // Move horizontally
    this.x += this.velocity.x * (deltaTime / 1000);

    // Destroy if off-screen
    if (this.direction > 0 && this.x > CONFIG.CANVAS_WIDTH) {
      this.destroy();
    } else if (this.direction < 0 && this.x + this.width < 0) {
      this.destroy();
    }
  }

  render(ctx) {
    if (this.showScore) {
      // Display points briefly instead of sprite (red since UFO is in red zone)
      ctx.fillStyle = '#ff0000';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.points.toString(), this.x + this.width / 2, this.y + this.height / 2 + 6);
      return;
    }

    if (!this.alive) return;

    // Render UFO sprite (uses arcade color zones - should be red at top)
    renderSprite(ctx, SPRITES.UFO, this.x, this.y, 2, null);
  }

  hit() {
    if (!this.alive) return this.points;

    this.alive = false;
    this.showScore = true;
    this.scoreDisplayTimer = 0;
    return this.points;
  }

  // Check if fully off-screen and done displaying score
  isFullyDone() {
    return !this.alive && !this.showScore;
  }
}
