import { Vector2D } from '../utils/Vector2D.js';

export class Entity {
  constructor(x, y, width, height) {
    this.position = new Vector2D(x, y);
    this.velocity = new Vector2D(0, 0);
    this.width = width;
    this.height = height;
    this.alive = true;
  }

  update(deltaTime) {
    // Update position based on velocity
    // deltaTime is in seconds
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
  }

  render(ctx) {
    // Override in subclasses
  }

  getBounds() {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height
    };
  }

  destroy() {
    this.alive = false;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  set x(value) {
    this.position.x = value;
  }

  set y(value) {
    this.position.y = value;
  }
}
