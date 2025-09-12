class SoundService {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;
  private volume: number = 0.7;

  constructor() {
    // Initialize sounds
    this.initializeSounds();
  }

  private initializeSounds() {
    // Initialize with empty audio objects - fallback sounds will be created
    this.sounds = {
      correct: new Audio(),
      wrong: new Audio(),
      click: new Audio(),
      gameOver: new Audio(),
      countdown: new Audio(),
    };

    // Set volume for all sounds
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume;
    });

    // Create simple beep sounds as fallback
    this.createFallbackSounds();
  }

  private createFallbackSounds() {
    // Create simple beep sounds using Web Audio API as fallback
    try {
      const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const audioContext = new AudioContextClass();
    
    // Simple beep function
    const createBeep = (frequency: number, duration: number) => {
      return () => {
        if (!this.enabled) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
      };
    };

    // Override play methods with beeps
    this.playCorrect = createBeep(523.25, 200); // C5 note
    this.playWrong = createBeep(220, 300); // A3 note
    this.playClick = createBeep(800, 50); // High beep
    this.playGameOver = createBeep(110, 500); // Low A2 note
    this.playCountdown = createBeep(440, 100); // A4 note
    } catch (error) {
      console.warn('Failed to create fallback sounds:', error);
      // Create silent fallback methods
      this.playCorrect = () => {};
      this.playWrong = () => {};
      this.playClick = () => {};
      this.playGameOver = () => {};
      this.playCountdown = () => {};
    }
  }

  playSound(soundName: string) {
    if (!this.enabled) return;

    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(error => {
        console.warn(`Failed to play sound ${soundName}:`, error);
      });
    }
  }

  // Individual sound methods
  playCorrect() {
    this.playSound('correct');
  }

  playWrong() {
    this.playSound('wrong');
  }

  playClick() {
    this.playSound('click');
  }

  playGameOver() {
    this.playSound('gameOver');
  }

  playCountdown() {
    this.playSound('countdown');
  }

  // Settings
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume;
    });
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getVolume(): number {
    return this.volume;
  }
}

// Export singleton instance
export const soundService = new SoundService();