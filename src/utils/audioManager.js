// src/utils/audioManager.js
// Complete audio system using Web Audio API (no files needed!)

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.isMuted = false;
    this.musicVolume = 0.3;
    this.effectsVolume = 0.6;
    this.musicGainNode = null;
    this.effectsGainNode = null;
    this.backgroundMusic = null;
    this.backgroundMusicSource = null;
  }

  // Initialize audio context 
  init() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create gain nodes for volume control
        this.musicGainNode = this.audioContext.createGain();
        this.effectsGainNode = this.audioContext.createGain();
        
        this.musicGainNode.connect(this.audioContext.destination);
        this.effectsGainNode.connect(this.audioContext.destination);
        
        this.musicGainNode.gain.value = this.isMuted ? 0 : this.musicVolume;
        this.effectsGainNode.gain.value = this.isMuted ? 0 : this.effectsVolume;
        
        console.log('🎵 Audio system initialized');
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    }
  }

  // Play coin collection sound (high-pitched ding)
  playCoinSound() {
    if (!this.audioContext || this.isMuted) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.effectsGainNode);
      
      // Sweet coin sound
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      console.error('Coin sound error:', error);
    }
  }

  // Play collision sound (harsh crash)
  playCollisionSound() {
    if (!this.audioContext || this.isMuted) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.effectsGainNode);
      
      // Harsh crash sound
      oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
      oscillator.type = 'sawtooth';
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, this.audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.4);
    } catch (error) {
      console.error('Collision sound error:', error);
    }
  }

  // Play button click sound (short beep)
  playClickSound() {
    if (!this.audioContext || this.isMuted) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.effectsGainNode);
      
      oscillator.frequency.value = 600;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.08);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.08);
    } catch (error) {
      console.error('Click sound error:', error);
    }
  }

  // Play game start sound (power-up whoosh)
  playGameStartSound() {
    if (!this.audioContext || this.isMuted) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.effectsGainNode);
      
      // Ascending whoosh
      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.3);
      oscillator.type = 'triangle';
      
      gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.error('Game start sound error:', error);
    }
  }

  // Play simple background music (looping ambient tone)
  playBackgroundMusic() {
    if (!this.audioContext || this.isMuted || this.backgroundMusicSource) return;
    
    try {
      // Create a simple ambient loop
      const oscillator1 = this.audioContext.createOscillator();
      const oscillator2 = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(this.musicGainNode);
      
      // Two-tone ambient music
      oscillator1.frequency.value = 220; // A3
      oscillator2.frequency.value = 330; // E4
      oscillator1.type = 'sine';
      oscillator2.type = 'sine';
      
      gainNode.gain.value = 0.15;
      
      oscillator1.start();
      oscillator2.start();
      
      // Store reference to stop later
      this.backgroundMusicSource = { oscillator1, oscillator2, gainNode };
      
      console.log('🎵 Background music started');
    } catch (error) {
      console.error('Background music error:', error);
    }
  }

  // Stop background music
  stopBackgroundMusic() {
    if (this.backgroundMusicSource) {
      try {
        this.backgroundMusicSource.oscillator1.stop();
        this.backgroundMusicSource.oscillator2.stop();
        this.backgroundMusicSource = null;
        console.log('🎵 Background music stopped');
      } catch (error) {
        console.error('Stop music error:', error);
      }
    }
  }

  // Toggle mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.musicGainNode && this.effectsGainNode) {
      if (this.isMuted) {
        this.musicGainNode.gain.value = 0;
        this.effectsGainNode.gain.value = 0;
      } else {
        this.musicGainNode.gain.value = this.musicVolume;
        this.effectsGainNode.gain.value = this.effectsVolume;
      }
    }
    
    console.log(this.isMuted ? '🔇 Audio muted' : '🔊 Audio unmuted');
    return this.isMuted;
  }

  // Set music volume (0-1)
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGainNode && !this.isMuted) {
      this.musicGainNode.gain.value = this.musicVolume;
    }
  }

  // Set effects volume (0-1)
  setEffectsVolume(volume) {
    this.effectsVolume = Math.max(0, Math.min(1, volume));
    if (this.effectsGainNode && !this.isMuted) {
      this.effectsGainNode.gain.value = this.effectsVolume;
    }
  }

  // Get mute state
  getMuteState() {
    return this.isMuted;
  }

  // Cleanup
  destroy() {
    this.stopBackgroundMusic();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export default audioManager;