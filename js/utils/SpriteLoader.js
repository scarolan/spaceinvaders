// Pixel-perfect sprites from the original 1979 Space Invaders arcade game
// Each sprite is defined as a 2D array where 1 = pixel on, 0 = pixel off

export const SPRITES = {
  // Squid enemy (top row) - 11x8 pixels - Most valuable (30 points)
  // Two animation frames with wavy tentacles
  SQUID_1: [
    [0,0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,0,1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1],
    [0,0,1,0,0,1,0,0,1,0,0],
    [0,1,0,1,0,0,0,1,0,1,0],
    [1,0,1,0,0,0,0,0,1,0,1]
  ],
  SQUID_2: [
    [0,0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,0,1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1],
    [0,1,0,1,0,0,0,1,0,1,0],
    [1,0,0,0,1,0,1,0,0,0,1],
    [0,1,0,0,0,0,0,0,0,1,0]
  ],

  // Crab enemy (middle rows) - 11x8 pixels
  CRAB_1: [
    [0,0,1,0,0,0,0,0,1,0,0],
    [0,0,0,1,0,0,0,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,1,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,1],
    [0,0,0,1,1,0,1,1,0,0,0]
  ],
  CRAB_2: [
    [0,0,1,0,0,0,0,0,1,0,0],
    [1,0,0,1,0,0,0,1,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,1],
    [1,1,1,0,1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,1,0],
    [0,0,1,0,0,0,0,0,1,0,0],
    [0,1,0,0,0,0,0,0,0,1,0]
  ],

  // Octopus enemy (bottom rows) - 12x8 pixels
  OCTOPUS_1: [
    [0,0,0,0,1,1,1,1,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,0,0,1,1,0,0,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,1,1,1,0,0,1,1,1,0,0],
    [0,1,1,0,0,1,1,0,0,1,1,0],
    [1,1,0,0,0,0,0,0,0,0,1,1]
  ],
  OCTOPUS_2: [
    [0,0,0,0,1,1,1,1,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,0,0,1,1,0,0,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,0,1,1,0,0,1,1,0,0,0],
    [0,0,1,1,0,1,1,0,1,1,0,0],
    [0,1,1,0,0,0,0,0,0,1,1,0]
  ],

  // Player ship - 13x8 pixels
  PLAYER: [
    [0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],

  // Mystery UFO - 16x7 pixels - Worth 50-300 points!
  UFO: [
    [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,1,1,1,0,0,1,1,0,0,1,1,1,0,0],
    [0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0]
  ],

  // Player explosion animation frames
  PLAYER_EXPLODE_1: [
    [0,0,0,1,0,0,1,0,0,0,1,0,0],
    [0,0,1,0,0,1,1,0,0,1,0,0,0],
    [0,1,0,0,0,1,0,0,0,0,1,0,0],
    [0,0,1,1,1,0,1,1,1,1,0,1,0],
    [1,1,0,1,1,0,1,1,1,0,1,1,1],
    [0,1,1,1,0,1,1,0,1,1,1,1,0],
    [0,0,1,0,0,0,1,0,0,0,1,0,0],
    [0,1,0,0,1,1,0,1,1,0,0,1,0]
  ],
  PLAYER_EXPLODE_2: [
    [0,1,0,0,0,0,1,0,0,0,0,0,1],
    [0,0,0,1,0,0,0,0,1,0,1,0,0],
    [1,0,0,0,1,0,0,1,0,0,0,1,0],
    [0,0,1,0,0,1,0,0,0,1,0,0,0],
    [0,1,0,0,1,0,0,1,0,0,1,0,1],
    [1,0,0,1,0,0,1,0,1,0,0,0,0],
    [0,0,1,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,1,0]
  ]
};

// Render a sprite to the canvas
export function renderSprite(ctx, sprite, x, y, pixelSize = 2, color = null) {
  // If no color specified, use arcade laminate color zones based on Y position
  if (color === null) {
    // Determine color based on Y position (arcade laminate effect)
    if (y < 100) {
      color = '#ff0000'; // Red (UFO zone)
    } else if (y < 200) {
      color = '#00ffff'; // Cyan (top row enemies)
    } else if (y < 300) {
      color = '#ffffff'; // White (upper middle enemies)
    } else if (y < 450) {
      color = '#00ff00'; // Green (lower middle/bottom enemies)
    } else if (y < 550) {
      color = '#ffff00'; // Yellow (shields)
    } else {
      color = '#ffffff'; // White (player zone)
    }
  }

  ctx.fillStyle = color;

  for (let row = 0; row < sprite.length; row++) {
    for (let col = 0; col < sprite[row].length; col++) {
      if (sprite[row][col] === 1) {
        ctx.fillRect(
          Math.floor(x + col * pixelSize),
          Math.floor(y + row * pixelSize),
          pixelSize,
          pixelSize
        );
      }
    }
  }
}

// Get sprite dimensions
export function getSpriteDimensions(sprite, pixelSize = 2) {
  return {
    width: sprite[0].length * pixelSize,
    height: sprite.length * pixelSize
  };
}
