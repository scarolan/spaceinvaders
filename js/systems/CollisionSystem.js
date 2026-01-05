export class CollisionSystem {
  constructor() {}

  // AABB (Axis-Aligned Bounding Box) collision detection
  checkCollision(entity1, entity2) {
    const bounds1 = entity1.getBounds();
    const bounds2 = entity2.getBounds();

    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }

  // Check bullet collisions with enemies
  checkBulletEnemyCollisions(bullets, enemies) {
    const hits = [];

    for (let bullet of bullets) {
      if (!bullet.alive || bullet.owner !== 'player') continue;

      for (let enemy of enemies) {
        if (!enemy.alive) continue;

        if (this.checkCollision(bullet, enemy)) {
          bullet.destroy();
          enemy.destroy();
          hits.push({
            bullet,
            enemy,
            points: enemy.points
          });
          break; // Bullet can only hit one enemy
        }
      }
    }

    return hits;
  }

  // Check bullet collisions with player
  checkBulletPlayerCollisions(bullets, player) {
    if (!player || !player.alive) return false;

    for (let bullet of bullets) {
      if (!bullet.alive || bullet.owner !== 'enemy') continue;

      if (this.checkCollision(bullet, player)) {
        bullet.destroy();
        return true; // Player was hit
      }
    }

    return false;
  }

  // Check if enemies reached player (game over condition)
  checkEnemyPlayerCollision(enemies, player) {
    if (!player || !player.alive) return false;

    for (let enemy of enemies) {
      if (!enemy.alive) continue;

      if (this.checkCollision(enemy, player)) {
        return true; // Enemy reached player
      }
    }

    return false;
  }

  // Check if enemies reached bottom of screen
  checkEnemiesReachedBottom(enemies, bottomY) {
    for (let enemy of enemies) {
      if (enemy.alive && enemy.y + enemy.height >= bottomY) {
        return true;
      }
    }
    return false;
  }

  // Check bullet collisions with shields
  checkBulletShieldCollisions(bullets, shields) {
    let hitCount = 0;

    for (let bullet of bullets) {
      if (!bullet.alive) continue;

      for (let shield of shields) {
        if (shield.checkCollision(bullet)) {
          hitCount++;
          break; // Bullet can only hit one shield
        }
      }
    }

    return hitCount;
  }

  // Future: Power-up collisions
  checkPowerUpPlayerCollisions(powerUps, player) {
    // TODO: Implement in Phase 9
    return [];
  }
}
