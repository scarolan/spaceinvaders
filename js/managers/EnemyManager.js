import { Enemy } from '../entities/Enemy.js';
import { Bullet } from '../entities/Bullet.js';
import { CONFIG } from '../config.js';

export class EnemyManager {
  constructor() {
    this.enemies = [];
    this.direction = 1; // 1 = right, -1 = left
    this.dropDistance = CONFIG.ENEMY_DROP_DISTANCE;
    this.shouldDrop = false;

    // Step-based movement (like original arcade)
    this.stepTimer = 0;
    this.stepInterval = CONFIG.ENEMY_STEP_INTERVAL;
    this.stepSize = CONFIG.ENEMY_STEP_SIZE;

    // Shooting
    this.shootTimer = 0;
    this.shootInterval = CONFIG.ENEMY_FIRE_RATE;

    // Track initial count for speed calculation
    this.initialCount = 0;

    // Bass note cycle (for the classic "doot-doot-doot-doot" sound)
    this.bassNote = 0; // 0-3 for the 4-note cycle
  }

  createFormation(level = 1) {
    this.enemies = [];

    const rows = CONFIG.ENEMY_ROWS;
    const cols = CONFIG.ENEMY_COLS;
    const spacingX = CONFIG.ENEMY_SPACING_X;
    const spacingY = CONFIG.ENEMY_SPACING_Y;
    const startY = CONFIG.ENEMY_START_Y;

    // Calculate starting X to center the formation
    const formationWidth = cols * spacingX;
    const startX = (CONFIG.CANVAS_WIDTH - formationWidth) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * spacingX;
        const y = startY + row * spacingY;

        // Determine enemy type based on row
        let type;
        if (row === 0) {
          type = 'top';
        } else if (row === 1 || row === 2) {
          type = 'middle';
        } else {
          type = 'bottom';
        }

        const enemy = new Enemy(x, y, type);
        this.enemies.push(enemy);
      }
    }

    this.initialCount = this.enemies.length;
    console.log(`Created formation with ${this.initialCount} enemies`);
  }

  update(deltaTime, bullets, audioSystem = null) {
    const aliveEnemies = this.enemies.filter(e => e.alive);

    if (aliveEnemies.length === 0) {
      return; // No enemies left
    }

    // Calculate current step interval based on remaining enemies
    // Hardware limitation simulation: fewer sprites = less CPU work = faster movement
    // This creates the dramatic acceleration as aliens are destroyed
    // Use a quadratic curve so maximum speed only happens with 1 enemy left
    const aliveRatio = aliveEnemies.length / this.initialCount;
    const speedMultiplier = Math.pow(aliveRatio, 1.5); // Gradual acceleration curve

    // Interpolate between max speed (50ms) and starting speed (900ms)
    const minStepInterval = 50;
    const speedRange = this.stepInterval - minStepInterval;
    const currentStepInterval = minStepInterval + (speedRange * speedMultiplier);

    // Update step timer
    this.stepTimer += deltaTime;

    if (this.stepTimer >= currentStepInterval) {
      this.stepTimer = 0;

      // Take a step!
      this.performStep(aliveEnemies);

      // Cycle and play bass note (the classic "doot-doot-doot-doot" sound!)
      if (audioSystem) {
        audioSystem.playBassNote(this.bassNote);
      }
      this.bassNote = (this.bassNote + 1) % 4;
    }

    // Update enemy animations
    for (let enemy of aliveEnemies) {
      enemy.update(deltaTime);
    }

    // Update shooting
    this.shootTimer += deltaTime;
    if (this.shootTimer >= this.shootInterval) {
      this.shootTimer = 0;
      this.randomEnemyShoot(bullets);
    }
  }

  performStep(aliveEnemies) {
    // Check if we need to change direction
    let shouldChangeDirection = false;

    for (let enemy of aliveEnemies) {
      const nextX = enemy.x + this.direction * this.stepSize;
      if (this.direction === 1 && nextX + enemy.width >= CONFIG.CANVAS_WIDTH) {
        shouldChangeDirection = true;
        break;
      }
      if (this.direction === -1 && nextX <= 0) {
        shouldChangeDirection = true;
        break;
      }
    }

    if (shouldChangeDirection) {
      // Change direction and drop down
      this.direction *= -1;
      for (let enemy of aliveEnemies) {
        enemy.y += this.dropDistance;
      }
    } else {
      // Move horizontally (all enemies move together in sync!)
      for (let enemy of aliveEnemies) {
        enemy.x += this.direction * this.stepSize;
      }
    }
  }

  randomEnemyShoot(bullets) {
    const aliveEnemies = this.enemies.filter(e => e.alive);
    if (aliveEnemies.length === 0) return;

    // Get bottom-most enemies (ones that can actually shoot)
    const shooters = this.getBottomEnemies(aliveEnemies);

    if (shooters.length > 0) {
      // Pick a random shooter
      const shooter = shooters[Math.floor(Math.random() * shooters.length)];

      // Create bullet
      const bulletX = shooter.x + shooter.width / 2 - CONFIG.BULLET_SIZE.width / 2;
      const bulletY = shooter.y + shooter.height;
      bullets.push(new Bullet(bulletX, bulletY, 'enemy'));
    }
  }

  getBottomEnemies(aliveEnemies) {
    // Group enemies by column
    const columns = {};

    for (let enemy of aliveEnemies) {
      const col = Math.floor(enemy.x / CONFIG.ENEMY_SPACING_X);
      if (!columns[col]) {
        columns[col] = [];
      }
      columns[col].push(enemy);
    }

    // Get the bottom enemy from each column
    const bottomEnemies = [];
    for (let col in columns) {
      const columnEnemies = columns[col];
      // Sort by Y position (descending) and take the first (bottom-most)
      columnEnemies.sort((a, b) => b.y - a.y);
      bottomEnemies.push(columnEnemies[0]);
    }

    return bottomEnemies;
  }

  render(ctx) {
    for (let enemy of this.enemies) {
      if (enemy.alive) {
        enemy.render(ctx);
      }
    }
  }

  getAliveEnemies() {
    return this.enemies.filter(e => e.alive);
  }

  allDestroyed() {
    return this.getAliveEnemies().length === 0;
  }

  getLowestEnemyY() {
    const aliveEnemies = this.getAliveEnemies();
    if (aliveEnemies.length === 0) return 0;

    return Math.max(...aliveEnemies.map(e => e.y + e.height));
  }
}
