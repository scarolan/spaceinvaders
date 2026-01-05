import { CONFIG } from '../config.js';

// Individual shield pixel/block - very small for authentic erosion
class ShieldBlock {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.alive = true; // No health - destroyed instantly on hit!
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.size,
      height: this.size
    };
  }

  render(ctx) {
    if (!this.alive) return;

    // Use arcade color zones based on Y position
    let color;
    if (this.y < 100) {
      color = '#ff0000'; // Red
    } else if (this.y < 200) {
      color = '#00ffff'; // Cyan
    } else if (this.y < 300) {
      color = '#ffffff'; // White
    } else if (this.y < 450) {
      color = '#00ff00'; // Green
    } else if (this.y < 550) {
      color = '#ffff00'; // Yellow (shields are in yellow zone!)
    } else {
      color = '#ffffff'; // White (player zone)
    }

    ctx.fillStyle = color;
    ctx.fillRect(
      Math.floor(this.x),
      Math.floor(this.y),
      this.size,
      this.size
    );
  }
}

// Shield made up of blocks in a specific pattern
export class Shield {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.blocks = [];
    this.createShieldPattern();
  }

  createShieldPattern() {
    // Create authentic Space Invaders shield - 22x16 pixels (scaled 2x = 44x32)
    // Made of many small destructible blocks for pixel-level erosion
    const blockSize = 4; // Very small blocks for granular destruction

    // Classic dome-shaped shield pattern (22 cols x 16 rows at 2x scale)
    const pattern = [
      [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
      [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
      [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1]
    ];

    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        if (pattern[row][col] === 1) {
          const blockX = this.x + col * blockSize;
          const blockY = this.y + row * blockSize;
          this.blocks.push(new ShieldBlock(blockX, blockY, blockSize));
        }
      }
    }
  }

  getAliveBlocks() {
    return this.blocks.filter(block => block.alive);
  }

  render(ctx) {
    for (let block of this.blocks) {
      if (block.alive) {
        block.render(ctx);
      }
    }
  }

  // Check collision with a bullet and ERASE blocks in a radius (erosion effect)
  checkCollision(bullet) {
    const bulletBounds = bullet.getBounds();
    const bulletCenterX = bulletBounds.x + bulletBounds.width / 2;
    const bulletCenterY = bulletBounds.y + bulletBounds.height / 2;

    const erosionRadius = 12; // Erosion radius - size of hole created

    // Find the closest alive block to the bullet center
    let closestBlock = null;
    let closestDistance = Infinity;

    for (let block of this.blocks) {
      if (!block.alive) continue;

      const blockBounds = block.getBounds();
      const blockCenterX = blockBounds.x + blockBounds.width / 2;
      const blockCenterY = blockBounds.y + blockBounds.height / 2;

      // Calculate distance from bullet center to block center
      const dx = bulletCenterX - blockCenterX;
      const dy = bulletCenterY - blockCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Check if bullet is ACTUALLY hitting this block (tight detection)
      // Block size is 4px, bullet is 4px wide x 12px tall
      // Only trigger if bullet center is within ~6px of block center
      const maxHitDistance = 6; // Tight detection - must actually hit the block
      if (distance < maxHitDistance && distance < closestDistance) {
        closestDistance = distance;
        closestBlock = block;
      }
    }

    // If we found a close block, erode at bullet position
    if (closestBlock) {
      this.erodeAtPoint(bulletCenterX, bulletCenterY, erosionRadius);
      bullet.destroy();
      return true;
    }

    return false;
  }

  // Erode shield blocks in a radius (authentic pixel erosion)
  erodeAtPoint(x, y, radius) {
    for (let block of this.blocks) {
      if (!block.alive) continue;

      const blockBounds = block.getBounds();
      const blockCenterX = blockBounds.x + blockBounds.width / 2;
      const blockCenterY = blockBounds.y + blockBounds.height / 2;

      // Calculate distance from erosion point
      const dx = blockCenterX - x;
      const dy = blockCenterY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Destroy blocks within radius
      if (distance <= radius) {
        block.alive = false;
      }
    }
  }

  // Check if an enemy is touching the shield and erode it
  checkEnemyCollision(enemy) {
    if (!enemy.alive) return false;

    const enemyBounds = enemy.getBounds();
    let hitAny = false;

    for (let block of this.blocks) {
      if (!block.alive) continue;

      const blockBounds = block.getBounds();

      // Check AABB collision
      if (
        enemyBounds.x < blockBounds.x + blockBounds.width &&
        enemyBounds.x + enemyBounds.width > blockBounds.x &&
        enemyBounds.y < blockBounds.y + blockBounds.height &&
        enemyBounds.y + enemyBounds.height > blockBounds.y
      ) {
        hitAny = true;
        // Enemy touching shield - erode large chunks as it passes through
        const enemyCenterX = enemyBounds.x + enemyBounds.width / 2;
        const enemyCenterY = enemyBounds.y + enemyBounds.height / 2;
        this.erodeAtPoint(enemyCenterX, enemyCenterY, 20); // Even larger erosion for enemies
        break;
      }
    }

    return hitAny;
  }

  isDestroyed() {
    return this.getAliveBlocks().length === 0;
  }
}
