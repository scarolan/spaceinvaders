import { CONFIG } from './config.js';
import { Player } from './entities/Player.js';
import { Bullet } from './entities/Bullet.js';
import { Shield } from './entities/Shield.js';
import { UFO } from './entities/UFO.js';
import { InputHandler } from './systems/InputHandler.js';
import { Renderer } from './systems/Renderer.js';
import { CollisionSystem } from './systems/CollisionSystem.js';
import { AudioSystem } from './systems/AudioSystem.js';
import { EnemyManager } from './managers/EnemyManager.js';
import { ScoreManager } from './managers/ScoreManager.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // Game loop timing
    this.FIXED_TIMESTEP = 1000 / 60; // 16.67ms (60 FPS)
    this.lastTime = 0;
    this.accumulator = 0;

    // FPS tracking
    this.fps = 60;
    this.frameCount = 0;
    this.fpsTime = 0;

    // Game systems
    this.inputHandler = new InputHandler();
    this.renderer = new Renderer(this.canvas, this.ctx);
    this.collisionSystem = new CollisionSystem();
    this.audioSystem = new AudioSystem();
    this.enemyManager = new EnemyManager();
    this.scoreManager = new ScoreManager();

    // Game state
    this.gameState = CONFIG.GAME_STATES.MENU;
    this.level = 1;

    // Game entities
    this.player = null;
    this.bullets = [];
    this.shields = [];
    this.ufo = null;
    this.ufoSound = null;

    // UFO spawn timing (random intervals: 25-35 seconds)
    this.ufoSpawnTimer = 0;
    this.nextUfoSpawnTime = this.getRandomUfoSpawnTime();

    // Input state tracking for single-press actions
    this.lastSpacePressed = false;

    // Death state tracking
    this.deathStateTimer = 0;

    // Game initialized
    this.initialized = false;
  }

  init() {
    console.log('Initializing Space Invaders...');
    console.log('Canvas size:', CONFIG.CANVAS_WIDTH, 'x', CONFIG.CANVAS_HEIGHT);

    // Setup sound toggle button
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        this.audioSystem.toggleMute();
        soundToggle.textContent = this.audioSystem.muted ? '🔇' : '🔊';
        soundToggle.classList.toggle('muted', this.audioSystem.muted);
        // Remove focus from button to prevent spacebar from triggering it
        soundToggle.blur();
      });
    }

    this.initialized = true;

    // Start game loop
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  startGame() {
    this.gameState = CONFIG.GAME_STATES.PLAYING;
    this.level = 1;

    // Resume audio context (browsers require user interaction)
    this.audioSystem.resume();

    // Reset score
    this.scoreManager.reset();

    // Create player at bottom center
    const playerX = CONFIG.CANVAS_WIDTH / 2 - CONFIG.PLAYER_SIZE.width / 2;
    const playerY = CONFIG.CANVAS_HEIGHT - CONFIG.PLAYER_SIZE.height - 20;
    this.player = new Player(playerX, playerY);

    // Clear bullets
    this.bullets = [];

    // Create shields
    this.createShields();

    // Create enemy formation
    this.enemyManager.createFormation(this.level);

    console.log('Game started!');
  }

  createShields() {
    this.shields = [];
    const shieldCount = CONFIG.SHIELD_COUNT;
    const shieldWidth = 22 * 4; // 22 pixels wide at 4px per block = 88px
    const totalWidth = shieldCount * shieldWidth;
    const spacing = (CONFIG.CANVAS_WIDTH - totalWidth) / (shieldCount + 1);

    for (let i = 0; i < shieldCount; i++) {
      const x = spacing + i * (shieldWidth + spacing);
      const y = CONFIG.SHIELD_Y_POSITION;
      this.shields.push(new Shield(x, y));
    }
  }

  getRandomUfoSpawnTime() {
    // Random interval between 25-35 seconds
    return 25000 + Math.random() * 10000;
  }

  spawnUFO() {
    // Random direction (0 = left-to-right, 1 = right-to-left)
    const direction = Math.random() < 0.5 ? 1 : -1;

    // Spawn position based on direction
    const y = 50; // Top of screen
    let x;
    if (direction > 0) {
      x = -50; // Start off-screen left
    } else {
      x = CONFIG.CANVAS_WIDTH + 10; // Start off-screen right
    }

    this.ufo = new UFO(x, y, direction);

    // Start UFO warbling sound
    this.ufoSound = this.audioSystem.playUFO();

    console.log('Mystery UFO spawned! Worth', this.ufo.points, 'points');
  }

  update(deltaTime) {
    const currentTime = Date.now();

    // Handle game state transitions
    if (this.gameState === CONFIG.GAME_STATES.MENU) {
      const spacePressed = this.inputHandler.isShootPressed();
      if (spacePressed && !this.lastSpacePressed) {
        this.startGame();
      }
      this.lastSpacePressed = spacePressed;
      return;
    }

    if (this.gameState === CONFIG.GAME_STATES.GAME_OVER) {
      const spacePressed = this.inputHandler.isShootPressed();
      if (spacePressed && !this.lastSpacePressed) {
        this.startGame();
      }
      this.lastSpacePressed = spacePressed;
      return;
    }

    if (this.gameState === CONFIG.GAME_STATES.PLAYER_DYING) {
      // Handle death animation and respawn
      this.deathStateTimer += deltaTime;

      // Update player death animation
      if (this.player) {
        this.player.update(deltaTime, this.inputHandler);
      }

      // After death animation + pause, respawn or game over
      const totalDeathTime = CONFIG.DEATH_ANIMATION_DURATION + CONFIG.RESPAWN_DELAY;
      if (this.deathStateTimer >= totalDeathTime) {
        this.player.finishDeath();

        if (this.player.alive) {
          // Respawn - reset player position
          const playerX = CONFIG.CANVAS_WIDTH / 2 - CONFIG.PLAYER_SIZE.width / 2;
          const playerY = CONFIG.CANVAS_HEIGHT - CONFIG.PLAYER_SIZE.height - 20;
          this.player.x = playerX;
          this.player.y = playerY;
          this.gameState = CONFIG.GAME_STATES.PLAYING;
          console.log('Player respawned!');
        } else {
          // Game over
          this.gameState = CONFIG.GAME_STATES.GAME_OVER;
        }
      }

      // Continue updating enemies and bullets during death
      this.enemyManager.update(deltaTime, this.bullets, this.audioSystem);
      this.bullets = this.bullets.filter(bullet => bullet.alive);
      this.bullets.forEach(bullet => bullet.update(deltaTime));

      return;
    }

    if (this.gameState !== CONFIG.GAME_STATES.PLAYING) {
      return;
    }

    // Update score manager
    this.scoreManager.update(deltaTime);

    // Update player
    if (this.player && this.player.alive) {
      this.player.update(deltaTime, this.inputHandler);

      // Handle shooting
      const spacePressed = this.inputHandler.isShootPressed();
      if (spacePressed && !this.lastSpacePressed) {
        if (this.player.shoot(currentTime)) {
          this.createPlayerBullet();
          // Play the classic "ker-pew!" shooting sound
          this.audioSystem.playShoot();
        }
      }
      this.lastSpacePressed = spacePressed;
    }

    // Update UFO spawn timer
    this.ufoSpawnTimer += deltaTime;
    if (this.ufoSpawnTimer >= this.nextUfoSpawnTime && !this.ufo) {
      this.spawnUFO();
      this.ufoSpawnTimer = 0;
      this.nextUfoSpawnTime = this.getRandomUfoSpawnTime();
    }

    // Update UFO
    if (this.ufo) {
      this.ufo.update(deltaTime);

      // Clean up UFO when it's fully done (off-screen and score displayed)
      if (this.ufo.isFullyDone()) {
        this.ufo = null;
        if (this.ufoSound) {
          this.audioSystem.stopUFO(this.ufoSound);
          this.ufoSound = null;
        }
      }

      // Stop UFO sound if UFO is destroyed but still showing score
      if (this.ufo && !this.ufo.alive && this.ufoSound) {
        this.audioSystem.stopUFO(this.ufoSound);
        this.ufoSound = null;
      }
    }

    // Update enemies
    this.enemyManager.update(deltaTime, this.bullets, this.audioSystem);

    // Update bullets
    this.bullets = this.bullets.filter(bullet => bullet.alive);
    this.bullets.forEach(bullet => bullet.update(deltaTime));

    // Check collisions
    this.handleCollisions();

    // Check win condition (all enemies destroyed)
    if (this.enemyManager.allDestroyed()) {
      console.log('Level complete!');
      // For now, just restart with next level
      this.level++;
      this.enemyManager.createFormation(this.level);
    }

    // Check lose conditions
    if (this.player && !this.player.alive) {
      this.gameState = CONFIG.GAME_STATES.GAME_OVER;
    }

    // Check if enemies reached bottom
    const lowestEnemyY = this.enemyManager.getLowestEnemyY();
    if (lowestEnemyY >= CONFIG.CANVAS_HEIGHT - 50) {
      console.log('Enemies reached the bottom!');
      this.player.lives = 0;
      this.player.alive = false;
      this.gameState = CONFIG.GAME_STATES.GAME_OVER;
    }
  }

  handleCollisions() {
    // Check bullet-shield collisions FIRST (shields should block bullets)
    this.collisionSystem.checkBulletShieldCollisions(this.bullets, this.shields);

    // Check enemy-shield collisions (enemies erode shields as they touch them)
    const aliveEnemies = this.enemyManager.getAliveEnemies();
    for (let enemy of aliveEnemies) {
      for (let shield of this.shields) {
        shield.checkEnemyCollision(enemy);
      }
    }

    // Check bullet-enemy collisions
    const hits = this.collisionSystem.checkBulletEnemyCollisions(
      this.bullets,
      aliveEnemies
    );

    // Add score for each hit
    hits.forEach(hit => {
      const scoreGained = this.scoreManager.addScore(hit.points);
      console.log(`Enemy destroyed! +${scoreGained} points (${hit.points} x ${this.scoreManager.getCombo().toFixed(1)})`);
      // Play enemy killed sound
      this.audioSystem.playEnemyKilled();
    });

    // Check bullet-UFO collisions
    if (this.ufo && this.ufo.alive) {
      const ufoBounds = this.ufo.getBounds();
      for (let bullet of this.bullets) {
        if (!bullet.alive || bullet.owner !== 'player') continue;

        const bulletBounds = bullet.getBounds();
        if (
          bulletBounds.x < ufoBounds.x + ufoBounds.width &&
          bulletBounds.x + bulletBounds.width > ufoBounds.x &&
          bulletBounds.y < ufoBounds.y + ufoBounds.height &&
          bulletBounds.y + bulletBounds.height > ufoBounds.y
        ) {
          // Hit the UFO!
          const points = this.ufo.hit();
          bullet.destroy();

          const scoreGained = this.scoreManager.addScore(points);
          console.log(`Mystery UFO destroyed! +${scoreGained} bonus points!`);

          // Play enemy killed sound for UFO
          this.audioSystem.playEnemyKilled();

          // Stop UFO sound
          if (this.ufoSound) {
            this.audioSystem.stopUFO(this.ufoSound);
            this.ufoSound = null;
          }

          break;
        }
      }
    }

    // Check bullet-player collisions
    if (this.collisionSystem.checkBulletPlayerCollisions(this.bullets, this.player)) {
      if (this.player.takeDamage()) {
        console.log('Player hit! Lives remaining:', this.player.lives);
        // Play player death sound
        this.audioSystem.playPlayerDeath();
        // Transition to death animation state
        this.gameState = CONFIG.GAME_STATES.PLAYER_DYING;
        this.deathStateTimer = 0;
      }
    }
  }

  createPlayerBullet() {
    const bulletX = this.player.x + this.player.width / 2 - CONFIG.BULLET_SIZE.width / 2;
    const bulletY = this.player.y;
    this.bullets.push(new Bullet(bulletX, bulletY, 'player'));
  }

  render() {
    // Clear canvas
    this.renderer.clear();

    // Render based on game state
    if (this.gameState === CONFIG.GAME_STATES.MENU) {
      this.renderer.renderMenu();
    } else if (this.gameState === CONFIG.GAME_STATES.GAME_OVER) {
      this.renderer.renderGameOver(this.scoreManager.getScore());
    } else if (this.gameState === CONFIG.GAME_STATES.PLAYING || this.gameState === CONFIG.GAME_STATES.PLAYER_DYING) {
      // Render enemies
      this.enemyManager.render(this.ctx);

      // Render shields
      for (let shield of this.shields) {
        shield.render(this.ctx);
      }

      // Render player
      if (this.player) {
        this.renderer.renderEntity(this.player);
      }

      // Render bullets
      this.renderer.renderEntities(this.bullets);

      // Render UFO
      if (this.ufo) {
        this.ufo.render(this.ctx);
      }

      // Update UI
      this.renderer.renderUI(
        this.scoreManager.getScore(),
        this.player ? this.player.lives : 0,
        this.level
      );
    }

    // Render color laminate overlay (simulates plastic arcade overlays)
    this.renderer.renderColorLaminateOverlay();
  }

  gameLoop(currentTime) {
    // Calculate delta time
    if (this.lastTime === 0) {
      this.lastTime = currentTime;
    }

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Add to accumulator
    this.accumulator += deltaTime;

    // Fixed timestep update loop
    while (this.accumulator >= this.FIXED_TIMESTEP) {
      this.update(this.FIXED_TIMESTEP);
      this.accumulator -= this.FIXED_TIMESTEP;
    }

    // Render (variable timestep)
    this.render();

    // Update FPS counter
    this.frameCount++;
    this.fpsTime += deltaTime;
    if (this.fpsTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsTime = 0;
    }

    // Continue game loop
    requestAnimationFrame((time) => this.gameLoop(time));
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.init();
});
