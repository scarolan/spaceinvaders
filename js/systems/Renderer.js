import { CONFIG } from '../config.js';
import { SPRITES, renderSprite } from '../utils/SpriteLoader.js';

export class Renderer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    // Set pixel-perfect rendering
    this.ctx.imageSmoothingEnabled = false;

    // Animation for blinking text
    this.blinkTimer = 0;
  }

  clear() {
    this.ctx.fillStyle = CONFIG.COLORS.BACKGROUND;
    this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
  }

  renderColorLaminateOverlay() {
    // Draw semi-transparent color bands to simulate plastic arcade overlays
    for (let zone of CONFIG.COLOR_ZONES) {
      // Very subtle transparent overlay (10% opacity)
      this.ctx.fillStyle = zone.color + '1A'; // Add alpha hex (1A = ~10% opacity)
      this.ctx.fillRect(0, zone.yStart, CONFIG.CANVAS_WIDTH, zone.yEnd - zone.yStart);
    }
  }

  renderEntity(entity) {
    if (entity && entity.alive) {
      entity.render(this.ctx);
    }
  }

  renderEntities(entities) {
    entities.forEach(entity => {
      if (entity.alive) {
        this.renderEntity(entity);
      }
    });
  }

  renderText(text, x, y, fontSize = 16, color = CONFIG.COLORS.TEXT, align = 'left') {
    this.ctx.fillStyle = color;
    this.ctx.font = `${fontSize}px monospace`;
    this.ctx.textAlign = align;
    this.ctx.fillText(text, x, y);
    this.ctx.textAlign = 'left'; // Reset
  }

  renderUI(score, lives, level) {
    // Update DOM elements
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('lives').textContent = `Lives: ${lives}`;
    document.getElementById('level').textContent = `Level: ${level}`;
  }

  renderMenu() {
    this.clear();

    // Update blink timer
    this.blinkTimer += 16; // Approximate 60fps

    // Big title at top
    this.renderText(
      'SPACE',
      CONFIG.CANVAS_WIDTH / 2,
      100,
      40,
      '#00ff00',
      'center'
    );

    this.renderText(
      'INVADERS',
      CONFIG.CANVAS_WIDTH / 2,
      150,
      40,
      '#00ff00',
      'center'
    );

    // Score advance table
    this.renderText(
      '*SCORE ADVANCE TABLE*',
      CONFIG.CANVAS_WIDTH / 2,
      220,
      12,
      '#ffffff',
      'center'
    );

    // Show enemy sprites with point values
    renderSprite(this.ctx, SPRITES.SQUID_1, 180, 260, 2, '#ffffff');
    this.renderText('= 30 POINTS', 240, 275, 14, '#ffffff');

    renderSprite(this.ctx, SPRITES.CRAB_1, 180, 300, 2, '#ffffff');
    this.renderText('= 20 POINTS', 240, 315, 14, '#ffffff');

    renderSprite(this.ctx, SPRITES.OCTOPUS_1, 180, 340, 2, '#ffffff');
    this.renderText('= 10 POINTS', 240, 355, 14, '#ffffff');

    renderSprite(this.ctx, SPRITES.UFO, 180, 380, 2, '#ff0000');
    this.renderText('= ? MYSTERY', 240, 395, 14, '#ff0000');

    // Blinking "INSERT COIN" message
    if (Math.floor(this.blinkTimer / 500) % 2 === 0) {
      this.renderText(
        'INSERT COIN',
        CONFIG.CANVAS_WIDTH / 2,
        470,
        20,
        '#ffff00',
        'center'
      );
    }

    // Controls at bottom
    this.renderText(
      'PRESS SPACE TO START',
      CONFIG.CANVAS_WIDTH / 2,
      540,
      12,
      '#00ffff',
      'center'
    );

    this.renderText(
      'ARROW KEYS / A-D = MOVE    SPACE = FIRE',
      CONFIG.CANVAS_WIDTH / 2,
      570,
      10,
      '#ffffff',
      'center'
    );
  }

  renderGameOver(score) {
    this.clear();

    // Update blink timer
    this.blinkTimer += 16;

    // Game Over message
    this.renderText(
      'GAME OVER',
      CONFIG.CANVAS_WIDTH / 2,
      CONFIG.CANVAS_HEIGHT / 2 - 80,
      36,
      '#ff0000',
      'center'
    );

    this.renderText(
      `FINAL SCORE: ${score}`,
      CONFIG.CANVAS_WIDTH / 2,
      CONFIG.CANVAS_HEIGHT / 2 - 20,
      20,
      '#ffffff',
      'center'
    );

    // Blinking "INSERT COIN" message
    if (Math.floor(this.blinkTimer / 500) % 2 === 0) {
      this.renderText(
        'INSERT COIN',
        CONFIG.CANVAS_WIDTH / 2,
        CONFIG.CANVAS_HEIGHT / 2 + 60,
        20,
        '#ffff00',
        'center'
      );
    }

    this.renderText(
      'PRESS SPACE TO CONTINUE',
      CONFIG.CANVAS_WIDTH / 2,
      CONFIG.CANVAS_HEIGHT / 2 + 120,
      12,
      '#00ffff',
      'center'
    );
  }

  renderPaused() {
    // Semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    this.renderText(
      'PAUSED',
      CONFIG.CANVAS_WIDTH / 2,
      CONFIG.CANVAS_HEIGHT / 2,
      32,
      CONFIG.COLORS.TEXT,
      'center'
    );

    this.renderText(
      'Press ESC or P to Resume',
      CONFIG.CANVAS_WIDTH / 2,
      CONFIG.CANVAS_HEIGHT / 2 + 40,
      16,
      CONFIG.COLORS.TEXT,
      'center'
    );
  }
}
