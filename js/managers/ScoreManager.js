export class ScoreManager {
  constructor() {
    this.score = 0;
    this.highScore = this.loadHighScore();
    this.combo = 1;
    this.comboTimer = 0;
    this.comboTimeout = 2000; // Reset combo after 2 seconds without a kill
  }

  reset() {
    this.score = 0;
    this.combo = 1;
    this.comboTimer = 0;
  }

  addScore(points) {
    const scoreWithCombo = Math.floor(points * this.combo);
    this.score += scoreWithCombo;

    // Increase combo
    this.combo = Math.min(this.combo + 0.1, 3.0); // Max 3x combo
    this.comboTimer = this.comboTimeout;

    // Update high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }

    return scoreWithCombo;
  }

  update(deltaTime) {
    // Update combo timer
    if (this.comboTimer > 0) {
      this.comboTimer -= deltaTime;
      if (this.comboTimer <= 0) {
        this.resetCombo();
      }
    }
  }

  resetCombo() {
    this.combo = 1;
    this.comboTimer = 0;
  }

  getScore() {
    return this.score;
  }

  getHighScore() {
    return this.highScore;
  }

  getCombo() {
    return this.combo;
  }

  saveHighScore() {
    try {
      localStorage.setItem('spaceInvadersHighScore', this.highScore.toString());
    } catch (e) {
      console.warn('Could not save high score:', e);
    }
  }

  loadHighScore() {
    try {
      const saved = localStorage.getItem('spaceInvadersHighScore');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      console.warn('Could not load high score:', e);
      return 0;
    }
  }
}
