// AudioSystem using Web Audio API for authentic retro sounds
export class AudioSystem {
  constructor() {
    this.audioContext = null;
    this.muted = false;
    this.masterVolume = 0.3; // Lower volume for comfort

    // Try to initialize audio context (may need user interaction first)
    this.init();
  }

  init() {
    try {
      // Create audio context on first user interaction
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  // Resume audio context (required after user interaction in many browsers)
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // The classic "doot-doot-doot-doot" four-note bass cycle
  // Goes from HIGH to LOW (descending pattern) - DEEP RUMBLING BASS
  playBassNote(noteIndex) {
    if (this.muted || !this.audioContext) return;

    this.resume();

    // VERY DEEP descending bass notes - CRANK THE BASS!
    const frequencies = [90, 80, 70, 60]; // Extremely deep, sub-bass rumble
    const frequency = frequencies[noteIndex % 4];

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'square'; // Square wave for that retro sound
    oscillator.frequency.value = frequency;

    // Longer, deeper "DOOT" sound with more power
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(this.masterVolume * 0.7, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    oscillator.start(now);
    oscillator.stop(now + 0.18);
  }

  // "Ker-PSHOOOO!" shooting sound with twang
  playShoot() {
    if (this.muted || !this.audioContext) return;

    this.resume();

    const now = this.audioContext.currentTime;

    // Create the "KER" - sharp metallic attack with harmonics
    const attack = this.audioContext.createOscillator();
    const attackGain = this.audioContext.createGain();

    attack.type = 'square';
    attack.frequency.setValueAtTime(1200, now);
    attack.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    attack.connect(attackGain);
    attackGain.connect(this.audioContext.destination);

    attackGain.gain.setValueAtTime(this.masterVolume * 0.5, now);
    attackGain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    // Create the "PSHOOO" - resonant laser tail with twang
    const laser = this.audioContext.createOscillator();
    const laserFilter = this.audioContext.createBiquadFilter();
    const laserGain = this.audioContext.createGain();

    laser.type = 'sawtooth'; // Sawtooth for that metallic twang
    laser.frequency.setValueAtTime(800, now + 0.03);
    laser.frequency.exponentialRampToValueAtTime(100, now + 0.35);

    // High Q bandpass for resonant "twang"
    laserFilter.type = 'bandpass';
    laserFilter.frequency.setValueAtTime(2500, now + 0.03);
    laserFilter.frequency.exponentialRampToValueAtTime(300, now + 0.35);
    laserFilter.Q.value = 8; // High Q for that resonant twang!

    laser.connect(laserFilter);
    laserFilter.connect(laserGain);
    laserGain.connect(this.audioContext.destination);

    // Sustain the "pshoooo" tail
    laserGain.gain.setValueAtTime(0, now);
    laserGain.gain.setValueAtTime(this.masterVolume * 0.5, now + 0.03);
    laserGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    // Start both sounds
    attack.start(now);
    laser.start(now + 0.03);
    attack.stop(now + 0.1);
    laser.stop(now + 0.4);
  }

  // "PKSHEEEOOW!" - Dramatic alien explosion sound
  playEnemyKilled() {
    if (this.muted || !this.audioContext) return;

    this.resume();

    const now = this.audioContext.currentTime;

    // "PK" - Sharp metallic impact
    const impact = this.audioContext.createOscillator();
    const impactGain = this.audioContext.createGain();

    impact.type = 'square';
    impact.frequency.setValueAtTime(800, now);
    impact.frequency.exponentialRampToValueAtTime(200, now + 0.04);

    impact.connect(impactGain);
    impactGain.connect(this.audioContext.destination);

    impactGain.gain.setValueAtTime(this.masterVolume * 0.6, now);
    impactGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    // "SHEEEOOW" - Dramatic descending laser disintegration
    const disintegrate = this.audioContext.createOscillator();
    const disintegrateFilter = this.audioContext.createBiquadFilter();
    const disintegrateGain = this.audioContext.createGain();

    disintegrate.type = 'sawtooth';
    disintegrate.frequency.setValueAtTime(1200, now + 0.03);
    disintegrate.frequency.exponentialRampToValueAtTime(50, now + 0.3);

    // Resonant filter sweep for dramatic effect
    disintegrateFilter.type = 'bandpass';
    disintegrateFilter.frequency.setValueAtTime(2000, now + 0.03);
    disintegrateFilter.frequency.exponentialRampToValueAtTime(150, now + 0.3);
    disintegrateFilter.Q.value = 6;

    disintegrate.connect(disintegrateFilter);
    disintegrateFilter.connect(disintegrateGain);
    disintegrateGain.connect(this.audioContext.destination);

    disintegrateGain.gain.setValueAtTime(0, now);
    disintegrateGain.gain.setValueAtTime(this.masterVolume * 0.6, now + 0.03);
    disintegrateGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    // Add explosive bass thump for drama
    const bass = this.audioContext.createOscillator();
    const bassGain = this.audioContext.createGain();

    bass.type = 'sine';
    bass.frequency.setValueAtTime(100, now);
    bass.frequency.exponentialRampToValueAtTime(30, now + 0.2);

    bass.connect(bassGain);
    bassGain.connect(this.audioContext.destination);

    bassGain.gain.setValueAtTime(this.masterVolume * 0.5, now);
    bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    // Start all components
    impact.start(now);
    disintegrate.start(now + 0.03);
    bass.start(now);

    impact.stop(now + 0.08);
    disintegrate.stop(now + 0.35);
    bass.stop(now + 0.25);
  }

  // UFO warbling sound - continuous oscillating tone
  playUFO() {
    if (this.muted || !this.audioContext) return;

    this.resume();

    const now = this.audioContext.currentTime;

    // Create oscillating/warbling tone
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // LFO (Low Frequency Oscillator) for the warble effect
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 340; // Base frequency

    // LFO modulates the main oscillator frequency for warble
    lfo.type = 'sine';
    lfo.frequency.value = 6; // 6 Hz warble rate
    lfoGain.gain.value = 20; // Amount of frequency modulation

    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    gainNode.gain.setValueAtTime(this.masterVolume * 0.3, now);

    oscillator.start(now);
    lfo.start(now);

    // Store references for stopping later
    return { oscillator, lfo, gainNode };
  }

  // Stop UFO sound
  stopUFO(ufoSound) {
    if (!ufoSound || !this.audioContext) return;

    const now = this.audioContext.currentTime;

    // Fade out quickly
    ufoSound.gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    ufoSound.oscillator.stop(now + 0.1);
    ufoSound.lfo.stop(now + 0.1);
  }

  // Player explosion - Brushy, gravelly, rumbly death sound
  playPlayerDeath() {
    if (this.muted || !this.audioContext) return;

    this.resume();

    const now = this.audioContext.currentTime;

    // Create gravelly noise burst for brushy/gravelly texture
    const bufferSize = this.audioContext.sampleRate * 0.8;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate decaying noise for gravelly explosion
    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.exp(-i / (bufferSize * 0.4));
      data[i] = (Math.random() * 2 - 1) * decay;
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;

    // Low-pass filter for rumble
    const rumbleFilter = this.audioContext.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(600, now);
    rumbleFilter.frequency.exponentialRampToValueAtTime(100, now + 0.6);
    rumbleFilter.Q.value = 2;

    const noiseGain = this.audioContext.createGain();

    noise.connect(rumbleFilter);
    rumbleFilter.connect(noiseGain);
    noiseGain.connect(this.audioContext.destination);

    noiseGain.gain.setValueAtTime(this.masterVolume * 0.9, now); // CRANKED UP!
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

    // Deep rumbling bass for massive explosion
    const bass1 = this.audioContext.createOscillator();
    const bass2 = this.audioContext.createOscillator();
    const bassGain = this.audioContext.createGain();

    bass1.type = 'sine';
    bass2.type = 'sine';

    // Two bass tones for thickness
    bass1.frequency.setValueAtTime(80, now);
    bass1.frequency.exponentialRampToValueAtTime(20, now + 0.6);

    bass2.frequency.setValueAtTime(120, now);
    bass2.frequency.exponentialRampToValueAtTime(30, now + 0.6);

    bass1.connect(bassGain);
    bass2.connect(bassGain);
    bassGain.connect(this.audioContext.destination);

    bassGain.gain.setValueAtTime(this.masterVolume * 1.0, now); // MAX VOLUME!
    bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    // Start all components
    noise.start(now);
    bass1.start(now);
    bass2.start(now);

    noise.stop(now + 0.8);
    bass1.stop(now + 0.65);
    bass2.stop(now + 0.65);
  }

  // Toggle mute
  toggleMute() {
    this.muted = !this.muted;
    console.log(this.muted ? 'Audio muted' : 'Audio unmuted');
    return this.muted;
  }

  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }
}
