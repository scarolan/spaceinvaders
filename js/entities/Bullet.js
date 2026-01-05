import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class Bullet extends Entity {
  constructor(x, y, owner = 'player') {
    super(x, y, CONFIG.BULLET_SIZE.width, CONFIG.BULLET_SIZE.height);

    this.owner = owner; // 'player' or 'enemy'

    // Set velocity based on owner
    if (owner === 'player') {
      this.velocity.y = -CONFIG.PLAYER_BULLET_SPEED;
    } else {
      this.velocity.y = CONFIG.ENEMY_BULLET_SPEED;
    }
  }

  update(deltaTime) {
    // Update position
    super.update(deltaTime / 1000); // Convert ms to seconds

    // Check if bullet is off-screen
    if (this.isOffScreen()) {
      this.destroy();
    }
  }

  isOffScreen() {
    return (
      this.y + this.height < 0 ||
      this.y > CONFIG.CANVAS_HEIGHT ||
      this.x + this.width < 0 ||
      this.x > CONFIG.CANVAS_WIDTH
    );
  }

  render(ctx) {
    ctx.fillStyle = CONFIG.COLORS.BULLET;
    ctx.fillRect(
      Math.floor(this.x),
      Math.floor(this.y),
      this.width,
      this.height
    );
  }
}
