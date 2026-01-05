export const CONFIG = {
  // Canvas (Portrait like original arcade - 224x256 scaled 2.5x)
  CANVAS_WIDTH: 560,
  CANVAS_HEIGHT: 640,

  // Player (original arcade dimensions)
  PLAYER_SPEED: 200, // pixels per second
  PLAYER_FIRE_RATE: 500, // milliseconds between shots (can only have 1 bullet on screen in original)
  PLAYER_LIVES: 3,
  PLAYER_SIZE: { width: 32, height: 20 }, // Scaled from original 13x8 pixels

  // Enemies (step-based movement like original)
  // Original arcade: 224x256 pixels, 16-pixel gaps, 8-pixel drop
  // Starting speed: just under 1 second per movement cycle with all 55 aliens
  ENEMY_ROWS: 5,
  ENEMY_COLS: 11,
  ENEMY_SPACING_X: 40, // Horizontal spacing (sprite ~24px + gap ~16px)
  ENEMY_SPACING_Y: 32, // Vertical spacing (sprite 16px + gap 16px)
  ENEMY_START_Y: 100,
  ENEMY_STEP_SIZE: 8, // Discrete step movement (jumping) - smaller steps like original
  ENEMY_STEP_INTERVAL: 900, // milliseconds between steps - VERY SLOW to start!
  ENEMY_DROP_DISTANCE: 16, // Drop amount when changing direction (8 pixels * 2x scale)
  ENEMY_FIRE_RATE: 2000, // milliseconds

  // Bullets
  PLAYER_BULLET_SPEED: 400,
  ENEMY_BULLET_SPEED: 200,
  BULLET_SIZE: { width: 4, height: 12 },

  // Shields (like original game - pixel-level erosion)
  SHIELD_COUNT: 4,
  SHIELD_Y_POSITION: 470, // Position between player and enemies

  // Power-ups
  POWERUP_DROP_CHANCE: 0.15,
  POWERUP_DURATION: 10000, // milliseconds
  POWERUP_FALL_SPEED: 100,
  POWERUP_SIZE: 20,

  // Scoring
  ENEMY_POINTS: {
    TOP: 30,
    MIDDLE: 20,
    BOTTOM: 10
  },

  // Levels
  LEVEL_SPEED_INCREASE: 1.2,
  LEVEL_FIRE_RATE_INCREASE: 0.9,

  // Death animation
  DEATH_ANIMATION_DURATION: 1000, // milliseconds
  RESPAWN_DELAY: 1500, // milliseconds after death before respawn

  // Game states
  GAME_STATES: {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAME_OVER: 'GAME_OVER',
    LEVEL_COMPLETE: 'LEVEL_COMPLETE',
    PLAYER_DYING: 'PLAYER_DYING' // Death animation state
  },

  // Audio (for Phase 6 - placeholder for now)
  SOUNDS: {
    SHOOT: 'shoot', // "ker-pew" sound
    ENEMY_KILLED: 'invaderKilled',
    PLAYER_DEATH: 'explosion',
    BASS_1: 'bass1', // The classic "doot-doot-doot-doot"
    BASS_2: 'bass2',
    BASS_3: 'bass3',
    BASS_4: 'bass4'
  },

  // Colors (retro palette with arcade color laminate zones)
  COLORS: {
    BACKGROUND: '#000',
    BULLET: '#fff',
    POWERUP: '#ff0',
    UI_TEXT: '#fff' // Title bar should be white
  },

  // Arcade color laminate zones (emulates plastic overlays on original arcade screen)
  COLOR_ZONES: [
    { yStart: 0, yEnd: 100, color: '#ff0000' },      // Top: Red (UFO zone)
    { yStart: 100, yEnd: 200, color: '#00ffff' },    // Cyan (top row enemies)
    { yStart: 200, yEnd: 300, color: '#ffffff' },    // White (upper middle enemies)
    { yStart: 300, yEnd: 450, color: '#00ff00' },    // Green (lower middle/bottom enemies)
    { yStart: 450, yEnd: 550, color: '#ffff00' },    // Yellow (shields - extended to cover full shield height)
    { yStart: 550, yEnd: 640, color: '#ffffff' }     // White (player zone)
  ],

  // Debug
  DEBUG_MODE: false
};
