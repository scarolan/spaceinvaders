# Claude Code Implementation Notes

This document describes the technical implementation details of this Space Invaders clone, built collaboratively with Claude Code.

## Project Overview

A pixel-perfect recreation of the 1978 Space Invaders arcade game using vanilla JavaScript and HTML5 Canvas, with authentic sound design using Web Audio API.

## Implementation Phases

### Phase 1: Foundation
- Set up ES6 module structure
- Implemented base `Entity` class with position, velocity, and collision bounds
- Created fixed-timestep game loop (60 FPS) using accumulator pattern
- Built `Vector2D` utility class for 2D math
- Established canvas rendering with pixel-perfect settings

### Phase 2: Player & Input
- Created `Player` entity with smooth horizontal movement
- Implemented `InputHandler` for keyboard controls (Arrow keys, WASD, Space, ESC/P)
- Added bullet system with owner tracking (player vs enemy)
- Implemented firing rate limiting

### Phase 3: Enemies & Core Gameplay
- Built `EnemyManager` to handle 55-enemy formation (5 rows × 11 columns)
- Implemented **step-based movement** instead of smooth animation:
  - Enemies move in discrete 8-pixel jumps
  - Direction changes at screen edges with 16-pixel drops
  - Simulates Intel 8080 processor limitations of original arcade
- Added collision detection using AABB (Axis-Aligned Bounding Box)
- Created scoring system with combo multipliers
- Implemented random enemy shooting from bottom-most in each column

### Phase 4: Authenticity Pass
Based on user feedback to match 1978 arcade experience:

**Visual Authenticity:**
- Changed canvas to portrait aspect ratio (560x640)
- Created pixel-perfect 1979 sprites as 2D arrays:
  - SQUID (11×8): Top row, 30 points, wavy tentacles
  - CRAB (11×8): Middle rows, 20 points, crab claws
  - OCTOPUS (12×8): Bottom rows, 10 points, simple design
  - PLAYER (13×8): Classic ship shape
  - UFO (16×7): Mystery ship
- Two-frame animation for each enemy type
- Player death animation with explosion sprites

**Movement Authenticity:**
- Adjusted enemy spacing to authentic 16-pixel gaps:
  - Horizontal: 40px (24px sprite + 16px gap)
  - Vertical: 32px (16px sprite + 16px gap)
- Slowed starting speed dramatically (900ms step interval)
- Speed acceleration formula:
  ```javascript
  const aliveRatio = aliveEnemies.length / initialCount;
  const speedMultiplier = Math.pow(aliveRatio, 1.5);
  const currentInterval = 50 + (850 * speedMultiplier);
  ```
  This creates a quadratic curve where max speed only happens with 1 enemy left

**Sound Design:**
All sounds procedurally generated using Web Audio API:

1. **Bass Cycle** ("doot-doot-doot-doot"):
   ```javascript
   const frequencies = [90, 80, 70, 60]; // Deep descending bass
   oscillator.type = 'square';
   ```
   Plays with each enemy step, cycles through 4 notes

2. **Player Shooting** ("ker-PSHOOOO"):
   ```javascript
   // Two-part: sharp attack + resonant laser tail
   attack: 1200Hz → 400Hz (50ms)
   laser: sawtooth with Q=8 filter, 2500Hz → 300Hz (350ms)
   ```

3. **Enemy Explosion** ("PKSHEEEOOW"):
   ```javascript
   // Three parts: impact + disintegration + bass thump
   impact: 800Hz noise burst
   disintegrate: 1200Hz → 50Hz (300ms)
   bass: 60Hz thump
   ```

4. **Player Death** (gravelly/rumbly):
   ```javascript
   // White noise + dual bass oscillators
   noise: 0.8s decay
   bass1: 80Hz
   bass2: 120Hz
   ```

5. **UFO Warble**:
   ```javascript
   // LFO-modulated sine wave
   carrier: 340Hz sine
   LFO: 6Hz @ 20Hz modulation depth
   ```

### Phase 5: Shields
Implemented authentic destructible shields:
- 22×16 pixel shields made of 352 individual 4px blocks
- Dome-shaped pattern with notches at bottom
- **Erosion system**: Bullets destroy blocks in 12px radius
- Enemies destroy blocks in 20px radius when touching shields
- Distance-based collision detection prevents bullet tunneling

### Phase 6: Mystery UFO
- Spawns randomly every 25-35 seconds
- Flies horizontally across top of screen (random direction)
- Worth random bonus: 50, 100, 150, 200, 250, or 300 points
- Displays score briefly when destroyed
- Continuous warbling sound while on screen

### Phase 7: Color Laminate Zones
Emulates the colored plastic overlays on the original arcade cabinet:

```javascript
COLOR_ZONES: [
  { yStart: 0, yEnd: 100, color: '#ff0000' },      // Red (UFO)
  { yStart: 100, yEnd: 200, color: '#00ffff' },    // Cyan (top enemies)
  { yStart: 200, yEnd: 300, color: '#ffffff' },    // White (upper middle)
  { yStart: 300, yEnd: 450, color: '#00ff00' },    // Green (lower enemies)
  { yStart: 450, yEnd: 550, color: '#ffff00' },    // Yellow (shields)
  { yStart: 550, yEnd: 640, color: '#ffffff' }     // White (player)
]
```

All sprites dynamically colored based on Y position. This creates a vibrant, colorful display that mimics the layered plastic overlays used on the original 1978 arcade cabinet to add color to the monochrome display.

### Phase 8: Polish
- Removed FPS meter
- Added 👾 emoji favicon
- Added sound toggle button (🔊/🔇)
- Integrated "Press Start 2P" Google Font for authentic retro look
- Made UI text white to match arcade cabinet

## Technical Challenges & Solutions

### Problem: Bullet Tunneling Through Shields
**Issue**: Fast-moving bullets (400px/s) could skip over tiny 4px shield blocks between frames.

**Solution**: Implemented distance-based collision detection:
```javascript
// Find closest block within detection radius
const distance = Math.sqrt(dx*dx + dy*dy);
if (distance < 6px) { // Tight detection
  erodeAtPoint(bulletX, bulletY, 12px); // Large erosion
}
```

### Problem: Enemy Speed Balancing
**Issue**: Linear speed increase caused enemies to reach max speed too quickly.

**Solution**: Changed to quadratic curve using `Math.pow(aliveRatio, 1.5)`, ensuring maximum speed only occurs with 1 enemy remaining.

### Problem: Authentic Sound Design
**Issue**: Recreating classic arcade sounds without samples.

**Solution**: Procedural audio synthesis:
- Bass notes: Square waves for that authentic "doot" sound
- Shooting: Two-stage (attack + resonant sweep) for "ker-PSHOOOO"
- Explosions: Three-stage (impact + disintegration + bass)
- UFO: LFO-modulated sine wave for warble effect

### Problem: Color Laminate Simulation
**Issue**: Original arcade had colored plastic overlays, not actual colored graphics.

**Solution**: Dynamic color zones based on Y position:
```javascript
if (y < 100) color = '#ff0000';      // Red zone
else if (y < 250) color = '#ffffff'; // White zone
else if (y < 450) color = '#00ff00'; // Green zone
else color = '#ffffff';              // White zone
```

## Key Design Decisions

1. **Pure Vanilla JavaScript**: No frameworks to keep it lightweight and educational
2. **ES6 Modules**: Clean code organization with import/export
3. **Entity-Component Pattern**: Base `Entity` class with specialized subclasses
4. **Fixed Timestep**: Ensures consistent physics regardless of frame rate
5. **Procedural Audio**: Web Audio API for authentic retro sounds
6. **State Machine**: Clean game state management (MENU, PLAYING, PAUSED, GAME_OVER, PLAYER_DYING)

## Code Statistics

- **Total Files**: ~20 JavaScript files
- **Lines of Code**: ~2500+
- **Sprite Data**: 6 enemy types, UFO, player (all as 2D pixel arrays)
- **Sound Effects**: 5 procedurally generated sounds
- **No Dependencies**: 100% vanilla JavaScript

## Performance Considerations

- **Sprite Rendering**: Optimized with `imageSmoothingEnabled = false` for crisp pixels
- **Collision Detection**: Early exit optimizations in nested loops
- **Audio Context**: Single shared context, reused oscillators
- **Memory Management**: Bullets auto-destroy when off-screen

## Iterative Refinement

The project evolved through extensive user feedback:
1. Initial MVP with smooth movement
2. Changed to step-based movement for authenticity
3. Fine-tuned spacing and timing (multiple iterations)
4. Sound design refinement (bass deeper, shooting more dramatic)
5. Shield erosion balancing (multiple attempts to get detection right)
6. Speed curve adjustment for better game feel

## Future Enhancement Ideas

- Additional enemy types (like original game's additional waves)
- Particle effects for explosions
- Screen shake on player death
- Attract mode with demo gameplay
- Touch controls for mobile
- Leaderboard with initials entry
- Rainbow easter egg from Pac-Man

## Lessons Learned

1. **Authenticity requires research**: Getting the exact spacing, timing, and sounds right required careful attention to arcade specs
2. **Collision detection is tricky**: Fast-moving objects need special handling to prevent tunneling
3. **Sound design is an art**: Procedural audio requires experimentation to get the right feel
4. **User feedback is invaluable**: Multiple iterations based on feedback led to much better authenticity
5. **Progressive enhancement works**: Starting with MVP and iterating produced better results than trying to build everything at once

---

*Built with Claude Code - AI pair programming at its finest!*
