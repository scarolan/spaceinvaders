# Space Invaders 👾

An authentic recreation of the classic 1978 arcade game, built with vanilla JavaScript and HTML5 Canvas.

## Features

✨ **Pixel-Perfect Arcade Accuracy**
- Authentic 1978 sprites for all three enemy types (Squid, Crab, Octopus)
- Step-based "jumping" enemy movement (not smooth animation)
- Portrait aspect ratio matching the original arcade cabinet (560x640)
- Arcade color laminate zones emulating the plastic overlays from the original cabinet

🎵 **Authentic Sound Design**
- Classic descending bass "doot-doot-doot-doot" that speeds up as enemies are destroyed
- "ker-PSHOOOO" player shooting sound with resonant twang
- "PKSHEEEOOW" enemy explosion
- Gravelly, rumbly player death sound
- Warbling mystery UFO sound
- All sounds procedurally generated using Web Audio API

🎮 **Core Gameplay**
- 55 enemies in formation (5 rows × 11 columns) with authentic spacing
- Destructible shields with pixel-level erosion
- Mystery UFO that flies across the top for bonus points (50-300)
- Progressive difficulty - enemies speed up as they're destroyed
- Lives system with death animation
- High score persistence using LocalStorage

🎯 **Controls**
- **Arrow Keys** or **A/D** - Move left/right
- **Space** - Shoot
- **ESC** or **P** - Pause
- **🔊** - Toggle sound on/off

## Play Now

1. Clone this repository
2. Start a local web server:
   ```bash
   python3 -m http.server 8000
   ```
3. Open `http://localhost:8000` in your browser
4. Press **SPACE** to start!

## Technical Details

- **Pure vanilla JavaScript** - No frameworks or libraries
- **ES6 Modules** for code organization
- **Object-Oriented Programming** with entity inheritance
- **Fixed timestep game loop** (60 FPS) for consistent physics
- **Procedural audio** using Web Audio API
- **Pixel-perfect rendering** (`imageSmoothingEnabled = false`)

## Arcade Color Zones

The game emulates the colored plastic overlays from the original arcade cabinet:
- **Red** (0-100px) - UFO zone at the top
- **Cyan** (100-200px) - Top row of enemies (Squid)
- **White** (200-300px) - Upper middle enemies (Crab)
- **Green** (300-450px) - Lower middle and bottom enemies (Octopus)
- **Yellow** (450-550px) - Shields zone
- **White** (550-640px) - Player zone

## Game Architecture

```
js/
├── main.js              # Main game class and loop
├── config.js            # Game configuration constants
├── entities/            # Game objects
│   ├── Entity.js        # Base entity class
│   ├── Player.js        # Player ship
│   ├── Enemy.js         # Enemy invaders
│   ├── Bullet.js        # Projectiles
│   ├── Shield.js        # Destructible shields
│   └── UFO.js          # Mystery UFO
├── systems/             # Game systems
│   ├── InputHandler.js  # Keyboard input
│   ├── Renderer.js      # Canvas rendering
│   ├── CollisionSystem.js # Collision detection
│   └── AudioSystem.js   # Sound generation
├── managers/            # Game managers
│   ├── EnemyManager.js  # Enemy formation & movement
│   └── ScoreManager.js  # Score tracking
└── utils/              # Utilities
    ├── Vector2D.js      # 2D vector math
    ├── SpriteLoader.js  # Pixel art sprites
    └── ColorZones.js    # Arcade color zones
```

## Development

The game was built iteratively with careful attention to authenticity:
1. Foundation - Game loop, entities, rendering
2. Player & Input - Ship movement, shooting
3. Enemies - Formation, step-based movement, shooting
4. Authenticity Pass - Exact sprites, bass cycle sound, proper timing
5. Shields - Pixel-level destructible shields
6. UFO - Mystery ship with bonus points
7. Polish - Color zones, sound toggle, UI improvements

## Credits

Created as a tribute to the original 1978 Space Invaders arcade game by Tomohiro Nishikado.

Built with ❤️ using vanilla JavaScript and HTML5 Canvas.

## License

This is a non-commercial educational project created for fun and learning.

---

**High Score:** Can you beat the aliens? 👾
