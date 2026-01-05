import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';
import { SPRITES, renderSprite, getSpriteDimensions } from '../utils/SpriteLoader.js';

export class Player extends Entity {
  constructor(x, y) {
    super(x, y, CONFIG.PLAYER_SIZE.width, CONFIG.PLAYER_SIZE.height);

    this.lives = CONFIG.PLAYER_LIVES;
    this.lastFireTime = 0;
    this.invulnerable = false;
    this.invulnerableTimer = 0;
    this.invulnerableDuration = 2000; // 2 seconds after hit
    this.pixelSize = 2;

    // Death animation
    this.isDying = false;
    this.deathTimer = 0;
    this.deathAnimationFrame = 0;

    // Power-up states
    this.powerUps = {
      rapidFire: false,
      spreadShot: false,
      shield: false
    };
    this.powerUpTimers = {
      rapidFire: 0,
      spreadShot: 0,
      shield: 0
    };
  }

  update(deltaTime, inputHandler) {
    // Handle death animation
    if (this.isDying) {
      this.deathTimer += deltaTime;

      // Animate between two explosion frames
      if (this.deathTimer > 200) {
        this.deathAnimationFrame = (this.deathAnimationFrame + 1) % 2;
        this.deathTimer = 0;
      }

      return; // Don't do anything else while dying
    }

    // Handle movement
    if (inputHandler.isLeftPressed()) {
      this.velocity.x = -CONFIG.PLAYER_SPEED;
    } else if (inputHandler.isRightPressed()) {
      this.velocity.x = CONFIG.PLAYER_SPEED;
    } else {
      this.velocity.x = 0;
    }

    // Update position
    super.update(deltaTime / 1000); // Convert ms to seconds

    // Clamp position to screen bounds
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width > CONFIG.CANVAS_WIDTH) {
      this.x = CONFIG.CANVAS_WIDTH - this.width;
    }

    // Update invulnerability timer
    if (this.invulnerable) {
      this.invulnerableTimer -= deltaTime;
      if (this.invulnerableTimer <= 0) {
        this.invulnerable = false;
      }
    }

    // Update power-up timers
    for (let powerUp in this.powerUpTimers) {
      if (this.powerUps[powerUp]) {
        this.powerUpTimers[powerUp] -= deltaTime;
        if (this.powerUpTimers[powerUp] <= 0) {
          this.powerUps[powerUp] = false;
        }
      }
    }
  }

  canShoot(currentTime) {
    const fireRate = this.powerUps.rapidFire ?
      CONFIG.PLAYER_FIRE_RATE / 2 :
      CONFIG.PLAYER_FIRE_RATE;

    return currentTime - this.lastFireTime >= fireRate;
  }

  shoot(currentTime) {
    if (this.canShoot(currentTime)) {
      this.lastFireTime = currentTime;
      return true;
    }
    return false;
  }

  takeDamage() {
    if (this.invulnerable || this.powerUps.shield || this.isDying) {
      return false;
    }

    this.lives--;
    this.isDying = true;
    this.deathTimer = 0;
    this.deathAnimationFrame = 0;

    // TODO Phase 6: Play player death sound

    return true;
  }

  finishDeath() {
    this.isDying = false;
    if (this.lives > 0) {
      // Respawn
      this.invulnerable = true;
      this.invulnerableTimer = this.invulnerableDuration;
    } else {
      // Game over
      this.alive = false;
    }
  }

  applyPowerUp(type, duration = CONFIG.POWERUP_DURATION) {
    if (type === 'extraLife') {
      this.lives++;
    } else if (this.powerUps.hasOwnProperty(type)) {
      this.powerUps[type] = true;
      this.powerUpTimers[type] = duration;
    }
  }

  render(ctx) {
    // Show death animation if dying
    if (this.isDying) {
      let sprite;
      if (this.deathAnimationFrame === 0) {
        sprite = SPRITES.PLAYER_EXPLODE_1;
      } else {
        sprite = SPRITES.PLAYER_EXPLODE_2;
      }
      renderSprite(ctx, sprite, this.x, this.y, this.pixelSize, null);
      return;
    }

    // Flash when invulnerable
    if (this.invulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
      return;
    }

    // Draw authentic pixel-perfect player ship from 1979 arcade (uses arcade color zones)
    renderSprite(ctx, SPRITES.PLAYER, this.x, this.y, this.pixelSize, null);

    // Draw shield indicator if active
    if (this.powerUps.shield) {
      ctx.strokeStyle = '#0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2 + 5,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }
  }
}
