export class InputHandler {
  constructor() {
    this.keys = new Set();
    this.init();
  }

  init() {
    // Keyboard event listeners
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));
  }

  onKeyDown(event) {
    this.keys.add(event.key.toLowerCase());
    this.keys.add(event.code);
  }

  onKeyUp(event) {
    this.keys.delete(event.key.toLowerCase());
    this.keys.delete(event.code);
  }

  isKeyDown(key) {
    return this.keys.has(key.toLowerCase()) || this.keys.has(key);
  }

  // Convenience methods for common controls
  isLeftPressed() {
    return this.isKeyDown('ArrowLeft') || this.isKeyDown('a');
  }

  isRightPressed() {
    return this.isKeyDown('ArrowRight') || this.isKeyDown('d');
  }

  isShootPressed() {
    return this.isKeyDown(' ') || this.isKeyDown('Space');
  }

  isPausePressed() {
    return this.isKeyDown('Escape') || this.isKeyDown('p');
  }
}
